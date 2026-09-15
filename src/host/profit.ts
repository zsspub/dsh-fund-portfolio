/** Date-aware current-share valuations, not a transaction or settlement ledger. */
import { Decimal } from 'decimal.js'
import type { Account, Fund, Holding, HoldingView, Income, Portfolio, Quote } from '../types.ts'
import { priorCalendarDate } from './validation.ts'

const Money = Decimal.clone({ precision: 64 })

export function valueHolding(holding: Holding, account: Account, fund: Fund, quote: Quote, today: string): HoldingView {
  const shares = new Money(holding.shares)
  const cost = shares.mul(holding.costPrice)
  const nav = quote.navs[0]
  const previous = quote.navs[1]
  const estimate = quote.estimate
  const result: HoldingView = {
    holding, accountName: account.name, fund, quote, cost: cost.toFixed(),
    marketValue: null, priceKind: null, priceDate: null, floatingProfit: null, floatingRate: null,
    confirmed: null, estimated: null, today: null, referenceChange: null, issue: 'pending',
  }
  if (fund.kind === 'money') {
    result.marketValue = shares.toFixed()
    result.priceKind = 'money'
    if (nav) {
      result.confirmed = { amount: shares.div(10000).mul(nav.value).toFixed(), date: nav.date, basisDate: null, kind: 'confirmed' }
      result.priceDate = nav.date
      if (nav.action) {
        result.confirmed = null
        result.issue = 'review'
      }
    }
  } else {
    const action = Boolean(nav?.action)
    if (nav && previous && !action) {
      result.confirmed = {
        amount: shares.mul(new Money(nav.value).sub(previous.value)).toFixed(),
        date: nav.date, basisDate: previous.date, kind: 'confirmed',
      }
    }
    if (estimate && nav) {
      const referenceMatches = new Money(estimate.referenceValue).eq(nav.value)
      const referenceDateMatches = estimate.referenceDate === nav.date
      const oneCalendarDay = priorCalendarDate(estimate.date) === nav.date
      const mondayAfterFriday = new Date(`${estimate.date}T00:00:00Z`).getUTCDay() === 1
        && Date.parse(`${estimate.date}T00:00:00Z`) - Date.parse(`${nav.date}T00:00:00Z`) === 3 * 86400_000
      const weekday = new Date(`${estimate.date}T00:00:00Z`).getUTCDay()
      const validInterval = fund.kind === 'nav' && (oneCalendarDay || mondayAfterFriday) && weekday > 0 && weekday < 6
      result.referenceChange = shares.mul(new Money(estimate.value).sub(estimate.referenceValue)).toFixed()
      if (referenceMatches && referenceDateMatches && validInterval && !action) {
        result.estimated = {
          amount: shares.mul(new Money(estimate.value).sub(estimate.referenceValue)).toFixed(), date: estimate.date, basisDate: nav.date, kind: 'estimated',
        }
      } else if (estimate.date === today && nav.date !== today) {
        result.issue = 'baseline'
      }
    }
    const useEstimate = estimate !== null && estimate.date === today && (!nav || nav.date < estimate.date)
    const price = useEstimate ? estimate.value : nav?.value
    if (price !== undefined) {
      const market = shares.mul(price)
      result.marketValue = market.toFixed()
      result.floatingProfit = market.sub(cost).toFixed()
      result.floatingRate = cost.isZero() ? null : market.sub(cost).div(cost).mul(100).toFixed()
      result.priceKind = useEstimate ? 'estimate' : 'nav'
      result.priceDate = useEstimate ? estimate.date : nav!.date
    }
    if (action) result.issue = 'review'
  }
  if (result.confirmed?.date === today) result.today = result.confirmed
  else if (result.estimated?.date === today) result.today = result.estimated
  if (result.today) result.issue = null
  if (!nav && !estimate) result.issue = 'unavailable'
  return result
}

export function summarize(date: string, accounts: Account[], holdings: HoldingView[], refreshIntervalMs: number): Portfolio {
  const sum = (values: (string | null)[]): string | null => {
    const present = values.filter((value): value is string => value !== null)
    return present.length ? present.reduce((total, value) => total.add(value), new Money(0)).toFixed() : null
  }
  const incomes = holdings.map(row => row.today).filter((income): income is Income => income !== null)
  const confirmed = incomes.filter(income => income.kind === 'confirmed')
  const estimated = incomes.filter(income => income.kind === 'estimated')
  return {
    date, accounts, holdings, refreshIntervalMs,
    cost: sum(holdings.map(row => row.cost)) ?? '0',
    marketValue: sum(holdings.map(row => row.marketValue)),
    marketCovered: holdings.filter(row => row.marketValue !== null).length,
    floatingProfit: sum(holdings.map(row => row.floatingProfit)),
    floatingCovered: holdings.filter(row => row.floatingProfit !== null).length,
    confirmedToday: sum(confirmed.map(income => income.amount)),
    estimatedToday: sum(estimated.map(income => income.amount)),
    todayTotal: sum(incomes.map(income => income.amount)),
    confirmedCount: confirmed.length, estimatedCount: estimated.length,
    missingCount: holdings.length - incomes.length,
  }
}
