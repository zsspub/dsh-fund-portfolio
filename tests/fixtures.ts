import type { Account, AccountId, Fund, Holding, HoldingId, Nav, Quote } from '../src/types.ts'

export const account: Account = { id: '11111111-1111-4111-8111-111111111111' as AccountId, name: 'Test account', version: 1 }
export const fund: Fund = { code: '005827', name: 'Test fund', kind: 'nav', currency: 'CNY', fetchedAt: '2026-09-15T02:00:00.000Z' }
export const holding: Holding = {
  id: '22222222-2222-4222-8222-222222222222' as HoldingId,
  accountId: account.id, fundCode: fund.code, shares: '1000', costPrice: '1.20',
  targetRatio: null, version: 1,
}
export function nav(date: string, value: string, action: string | null = null): Nav {
  return { date, value, action, annualYield: null }
}
export function quote(): Quote {
  return {
    code: fund.code, navs: [nav('2026-09-14', '1.30'), nav('2026-09-11', '1.29')],
    estimate: { date: '2026-09-15', time: '14:00:00', value: '1.32', referenceValue: '1.30', referenceDate: '2026-09-14' },
    navFetchedAt: '2026-09-15T02:00:00.000Z', estimateFetchedAt: '2026-09-15T06:00:00.000Z', error: null,
  }
}
