import { afterEach, describe, expect, it } from 'vitest'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { Market } from '../src/host/market.ts'
import { PortfolioStore } from '../src/host/store.ts'
import { PublicFundProvider } from '../src/host/providers.ts'
import { fund } from './fixtures.ts'

const cleanups: (() => Promise<void>)[] = []
afterEach(async () => { while (cleanups.length) await cleanups.pop()!() })
const config = { estimateCacheMs: 60000, navCacheMs: 300000, fundCacheMs: 86400000, minRefreshMs: 10000, concurrency: 2 }

function harness(fetcher: typeof fetch) {
  let time = Date.parse('2026-09-15T06:00:00Z')
  const root = mkdtempSync(join(tmpdir(), 'fund-market-'))
  const store = new PortfolioStore(join(root, 'db.sqlite3'), 1000)
  store.saveFund(fund)
  const market = new Market(store, new PublicFundProvider({ timeoutMs: 1000, fetch: fetcher, now: () => time }), config, () => time)
  cleanups.push(async () => { await market.dispose(); store.close(); rmSync(root, { recursive: true, force: true }) })
  return { market, store, advance: (milliseconds: number) => { time += milliseconds } }
}

function response(input: string): Response {
  if (input.includes('lsjz')) return Response.json({ ErrCode: 0, Data: { SYType: null, LSJZList: [
    { FSRQ: '2026-09-14', DWJZ: '1.30', JZZZL: '0.78' },
    { FSRQ: '2026-09-11', DWJZ: '1.29', JZZZL: '0' },
  ] } })
  return new Response('var hq_str_fu_005827="Fund,14:00:00,1.32,1.30,1.30,0,1.53,2026-09-15";')
}

describe('market refresh ownership', () => {
  it('deduplicates concurrent requests and respects separate cache lifetimes', async () => {
    const calls: string[] = []
    const { market, advance } = harness(async input => { calls.push(String(input)); return response(String(input)) })
    const signal = new AbortController().signal
    const [first, second] = await Promise.all([market.refresh(fund, false, signal), market.refresh(fund, false, signal)])
    expect(calls).toHaveLength(2)
    expect(first).toEqual(second)
    expect(first.estimate?.referenceDate).toBe('2026-09-14')
    await market.refresh(fund, true, signal)
    expect(calls).toHaveLength(2)
    advance(61000)
    await market.refresh(fund, false, signal)
    expect(calls).toHaveLength(3)
    expect(calls[2]).toContain('sina')
  })

  it('retains valid cached observations when a provider later fails', async () => {
    let failed = false
    const { market, advance } = harness(async input => failed ? new Response('limited', { status: 429 }) : response(String(input)))
    const signal = new AbortController().signal
    const before = await market.refresh(fund, false, signal)
    advance(10001)
    failed = true
    const after = await market.refresh(fund, true, signal)
    expect(after.navs).toEqual(before.navs)
    expect(after.estimate).toEqual(before.estimate)
    expect(after.error).toContain('429')
    expect(after.navFetchedAt).toBe(before.navFetchedAt)
  })

  it('does not regress a newer disclosure when a provider returns older records', async () => {
    const { market, store } = harness(async input => response(String(input)))
    store.saveQuote({
      code: fund.code, navs: [{ date: '2026-09-15', value: '1.31', annualYield: null, action: null }],
      estimate: null, navFetchedAt: null, estimateFetchedAt: null, error: null,
    })
    expect((await market.refresh(fund, true, new AbortController().signal)).navs[0]?.date).toBe('2026-09-15')
  })

  it('stops waiting when one caller cancels without aborting the shared refresh', async () => {
    let release!: () => void
    const blocked = new Promise<void>(resolve => { release = resolve })
    const { market } = harness(async input => {
      await blocked
      return response(String(input))
    })
    const controller = new AbortController()
    const cancelled = market.refresh(fund, true, controller.signal)
    const shared = market.refresh(fund, true, new AbortController().signal)
    controller.abort()
    await expect(cancelled).rejects.toThrow()
    release()
    await expect(shared).resolves.toMatchObject({ code: fund.code })
  })

  it('aborts in-flight requests and waits for quiescence before disposal', async () => {
    let started!: () => void
    const ready = new Promise<void>(resolve => { started = resolve })
    let aborted = 0
    const { market } = harness(async (_input, init) => {
      started()
      return new Promise<Response>((_resolve, reject) => {
        init!.signal!.addEventListener('abort', () => { aborted++; reject(new Error('aborted')) }, { once: true })
      })
    })
    const pending = market.refresh(fund, true, new AbortController().signal)
    const rejection = expect(pending).rejects.toThrow()
    await ready
    await market.dispose()
    await rejection
    expect(aborted).toBeGreaterThan(0)
    await expect(market.refresh(fund, false, new AbortController().signal)).rejects.toThrow()
  })
})
