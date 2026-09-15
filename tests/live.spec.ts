import { expect, it } from 'vitest'
import { PublicFundProvider } from '../src/host/providers.ts'

it.skipIf(process.env.DSH_FUND_LIVE !== '1')('reads ordinary, money and QDII public quotes without submitting holdings', async () => {
  const provider = new PublicFundProvider({ timeoutMs: 10000 })
  const signal = new AbortController().signal
  for (const [code, kind] of [['005827', 'nav'], ['000198', 'money'], ['270042', 'qdii']] as const) {
    const fund = await provider.fund(code, signal)
    expect(fund.kind).toBe(kind)
    const navs = await provider.nav(fund, signal)
    expect(navs.length).toBeGreaterThan(0)
    if (kind !== 'money') {
      const estimate = await provider.estimate(code, signal)
      expect(estimate === null || /^\d{4}-\d{2}-\d{2}$/.test(estimate.date)).toBe(true)
    }
  }
}, 90000)
