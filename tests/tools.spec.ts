import { describe, expect, it, vi } from 'vitest'
import type { Context } from '@deepseek-ai/cordis'
import type { ToolDefinition, ToolRunContext } from '@deepseek-ai/dsh-tools'
import { apply } from '../src/tools.ts'

const holdingId = '22222222-2222-4222-8222-222222222222'

describe('Agent tool registration', () => {
  it('registers the complete portfolio tool set', () => {
    const definitions: ToolDefinition[] = []
    const context = {
      fundPortfolio: {},
      tools: { register: (definition: ToolDefinition) => { definitions.push(definition); return () => undefined } },
      approval: { request: vi.fn() },
      effect: (register: () => unknown) => register(),
    } as unknown as Context
    apply(context)
    expect(definitions.map(definition => definition.name)).toEqual([
      'fund_account_list', 'fund_account_create', 'fund_account_update', 'fund_account_delete',
      'fund_lookup', 'fund_holding_list', 'fund_holding_add', 'fund_holding_update',
      'fund_holding_delete', 'fund_allocation_update', 'fund_portfolio_summary', 'fund_quote_refresh',
      'fund_portfolio_export', 'fund_portfolio_import',
    ])
  })

  it('routes destructive calls through native Agent approval', async () => {
    const definitions: ToolDefinition[] = []
    const request = vi.fn(async () => 'denied' as const)
    const context = {
      fundPortfolio: {},
      tools: { register: (definition: ToolDefinition) => { definitions.push(definition); return () => undefined } },
      approval: { request },
      effect: (register: () => unknown) => register(),
    } as unknown as Context
    apply(context)
    const remove = definitions.find(definition => definition.name === 'fund_holding_delete')!
    const execution = {
      agent: {}, callId: 'tool-call', signal: new AbortController().signal,
    } as unknown as ToolRunContext
    await expect(remove.execute({ id: holdingId, version: 1 }, execution)).rejects.toThrow(/not approved/)
    expect(request).toHaveBeenCalledWith(expect.objectContaining({
      toolName: 'fund_holding_delete',
      reason: expect.stringContaining(holdingId),
    }))
  })
})
