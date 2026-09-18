import { describe, expect, it } from 'vitest'
import { summarize, valueHolding } from '../src/host/profit.ts'
import { account, fund, holding, nav, quote } from './fixtures.ts'

describe('current-share returns', () => {
  it('separates daily return from cost-based floating profit', () => {
    const result = valueHolding(holding, account, fund, quote(), '2026-09-15')
    expect(result.today?.amount).toBe('20')
    expect(result.floatingProfit).toBe('120')
    expect(result.cost).toBe('1200')
    expect(result.today?.kind).toBe('estimated')
  })

  it('prefers disclosed NAV over a same-day estimate', () => {
    const prices = quote()
    prices.navs.unshift(nav('2026-09-15', '1.31'))
    const result = valueHolding(holding, account, fund, prices, '2026-09-15')
    expect(result.today).toEqual({ amount: '10', date: '2026-09-15', basisDate: '2026-09-14', kind: 'confirmed' })
    expect(result.priceKind).toBe('nav')
    expect(result.floatingProfit).toBe('110')
    expect(result.quote.estimate?.value).toBe('1.32')
  })

  it('never substitutes annual yield for a money-fund daily return', () => {
    const prices = quote()
    prices.navs = [{ ...nav('2026-09-15', '0.2332'), annualYield: '0.817' }]
    const result = valueHolding({ ...holding, shares: '10000', costPrice: '1' }, account, { ...fund, kind: 'money' }, prices, '2026-09-15')
    expect(result.today?.amount).toBe('0.2332')
    expect(result.marketValue).toBe('10000')
    expect(result.floatingProfit).toBeNull()
    expect(result.estimated).toBeNull()
  })

  it('allows money-fund disclosure on a weekend but not fabricated estimates', () => {
    const prices = quote()
    prices.navs = [nav('2026-09-13', '0.22')]
    const result = valueHolding(holding, account, { ...fund, kind: 'money' }, prices, '2026-09-13')
    expect(result.today?.amount).toBe('0.022')
    expect(valueHolding(holding, account, { ...fund, kind: 'money' }, prices, '2026-09-14').today).toBeNull()
  })

  it('keeps delayed QDII returns outside today totals', () => {
    const prices = quote()
    prices.navs = [nav('2026-09-11', '1.30'), nav('2026-09-10', '1.29')]
    prices.estimate!.referenceDate = '2026-09-11'
    const result = valueHolding(holding, account, { ...fund, kind: 'qdii' }, prices, '2026-09-15')
    expect(result.today).toBeNull()
    expect(result.confirmed?.date).toBe('2026-09-11')
    expect(result.referenceChange).toBe('20')
    expect(result.issue).toBe('baseline')
  })

  it('does not infer the overseas trading interval from a one-day date gap', () => {
    expect(valueHolding(holding, account, { ...fund, kind: 'qdii' }, quote(), '2026-09-15').today).toBeNull()
  })

  it.each(['date', 'value', 'holiday', 'weekend'])('rejects an unreliable %s estimate baseline', reason => {
    const prices = quote()
    if (reason === 'date') prices.estimate!.referenceDate = null
    if (reason === 'value') prices.estimate!.referenceValue = '1.29'
    if (reason === 'holiday') prices.navs[0]!.date = '2026-09-10'
    if (reason === 'weekend') prices.estimate!.date = '2026-09-19'
    const result = valueHolding(holding, account, fund, prices, prices.estimate!.date)
    expect(result.today).toBeNull()
  })

  it('suppresses misleading returns on corporate-action dates', () => {
    const prices = quote()
    prices.navs.unshift(nav('2026-09-15', '0.8', 'distribution'))
    const result = valueHolding(holding, account, fund, prices, '2026-09-15')
    expect(result.confirmed).toBeNull()
    expect(result.today).toBeNull()
    expect(result.issue).toBe('review')
  })

  it('keeps decimal precision and does not divide by zero cost', () => {
    const result = valueHolding({ ...holding, shares: '0.1', costPrice: '0' }, account, fund, quote(), '2026-09-15')
    expect(result.today?.amount).toBe('0.002')
    expect(result.floatingRate).toBeNull()
  })

  it('reports partial coverage without treating missing rows as zero income', () => {
    const available = valueHolding(holding, account, fund, quote(), '2026-09-15')
    const missing = valueHolding(holding, account, { ...fund, kind: 'qdii' }, quote(), '2026-09-15')
    const result = summarize('2026-09-15', [account], [available, missing], 60000)
    expect(result.todayTotal).toBe('20')
    expect(result.confirmedToday).toBeNull()
    expect(result.estimatedCount).toBe(1)
    expect(result.missingCount).toBe(1)
    expect(summarize('2026-09-15', [], [], 60000).todayTotal).toBeNull()
  })

  it('calculates account target ratios and balanced theoretical trades', () => {
    const first = valueHolding(
      { ...holding, shares: '600', costPrice: '1', targetRatio: '50' },
      account, { ...fund, kind: 'money' }, quote(), '2026-09-15',
    )
    const second = valueHolding(
      {
        ...holding,
        id: '33333333-3333-4333-8333-333333333333' as typeof holding.id,
        fundCode: '005828',
        shares: '400',
        costPrice: '1',
        targetRatio: '50',
      },
      account, { ...fund, code: '005828', kind: 'money' }, { ...quote(), code: '005828' }, '2026-09-15',
    )
    const result = summarize('2026-09-15', [account], [first, second], 60000, account.id)
    expect(result.allocation).toEqual({
      status: 'ready',
      holdings: 2,
      configured: 2,
      targetTotal: '100',
      buyAmount: '100',
      sellAmount: '100',
    })
    expect(result.holdings[0]?.currentRatio).toBe('60')
    expect(result.holdings[0]?.rebalance).toEqual({ action: 'sell', amount: '100', shares: '100' })
    expect(result.holdings[1]?.currentRatio).toBe('40')
    expect(result.holdings[1]?.rebalance).toEqual({ action: 'buy', amount: '100', shares: '100' })
  })

  it('withholds recommendations until targets and market values are complete', () => {
    const unconfigured = valueHolding(holding, account, fund, quote(), '2026-09-15')
    expect(summarize('2026-09-15', [account], [unconfigured], 60000, account.id).allocation?.status)
      .toBe('unconfigured')
    expect(unconfigured.currentRatio).toBe('100')
    expect(unconfigured.rebalance).toBeNull()

    const invalid = valueHolding({ ...holding, targetRatio: '99.99' }, account, fund, quote(), '2026-09-15')
    expect(summarize('2026-09-15', [account], [invalid], 60000, account.id).allocation?.status)
      .toBe('invalid-target-total')
    expect(invalid.rebalance).toBeNull()

    const missing = valueHolding(
      { ...holding, targetRatio: '100' }, account, fund,
      { ...quote(), navs: [], estimate: null }, '2026-09-15',
    )
    expect(summarize('2026-09-15', [account], [missing], 60000, account.id).allocation?.status)
      .toBe('market-incomplete')
    expect(missing.currentRatio).toBeNull()
    expect(missing.rebalance).toBeNull()
  })

  it('keeps exact balance as hold and preserves any nonzero adjustment', () => {
    const balanced = valueHolding(
      { ...holding, shares: '100', costPrice: '1', targetRatio: '100' },
      account, { ...fund, kind: 'money' }, quote(), '2026-09-15',
    )
    summarize('2026-09-15', [account], [balanced], 60000, account.id)
    expect(balanced.rebalance).toEqual({ action: 'hold', amount: '0', shares: '0' })

    const first = valueHolding(
      { ...holding, shares: '50.004', costPrice: '1', targetRatio: '50' },
      account, { ...fund, kind: 'money' }, quote(), '2026-09-15',
    )
    const second = valueHolding(
      {
        ...holding,
        id: '33333333-3333-4333-8333-333333333333' as typeof holding.id,
        fundCode: '005828',
        shares: '49.996',
        costPrice: '1',
        targetRatio: '50',
      },
      account, { ...fund, code: '005828', kind: 'money' }, { ...quote(), code: '005828' }, '2026-09-15',
    )
    summarize('2026-09-15', [account], [first, second], 60000, account.id)
    expect(first.rebalance).toEqual({ action: 'sell', amount: '0.004', shares: '0.004' })
    expect(second.rebalance).toEqual({ action: 'buy', amount: '0.004', shares: '0.004' })
  })
})
