import { afterEach, describe, expect, it, vi } from 'vitest'
import { PortfolioController } from '../src/client/controller.ts'
import { summarize } from '../src/host/profit.ts'

afterEach(() => vi.useRealTimers())

describe('visible-tab refresh', () => {
  it('polls only while visible and cancels its timer on hide', async () => {
    vi.useFakeTimers()
    const summary = vi.fn(async () => summarize('2026-09-15', [], [], 60000))
    const controller = new PortfolioController({ summary })
    controller.setVisible(true)
    await vi.advanceTimersByTimeAsync(0)
    expect(summary).toHaveBeenCalledTimes(1)
    await vi.advanceTimersByTimeAsync(60000)
    expect(summary).toHaveBeenCalledTimes(2)
    controller.setVisible(false)
    await vi.advanceTimersByTimeAsync(180000)
    expect(summary).toHaveBeenCalledTimes(2)
    controller.dispose()
    expect(vi.getTimerCount()).toBe(0)
  })

  it('ignores a late response after a filter change', async () => {
    let settle!: (value: ReturnType<typeof summarize>) => void
    let calls = 0
    const controller = new PortfolioController({
      summary: async () => {
        calls++
        if (calls === 1) return new Promise(resolve => { settle = resolve })
        return summarize('2026-09-16', [], [], 60000)
      },
    })
    controller.setVisible(true)
    await controller.refresh()
    settle(summarize('2026-09-15', [], [], 60000))
    await Promise.resolve()
    expect(controller.getSnapshot().data?.date).toBe('2026-09-16')
    controller.dispose()
  })
})
