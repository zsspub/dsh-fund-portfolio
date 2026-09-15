/** Instance-local deduplication and bounded, cancellable refresh of anonymous market data. */
import { Decimal } from 'decimal.js'
import type { Fund, Quote } from '../types.ts'
import { PortfolioStore } from './store.ts'
import { PublicFundProvider } from './providers.ts'

export interface MarketConfig {
  estimateCacheMs: number
  navCacheMs: number
  fundCacheMs: number
  minRefreshMs: number
  concurrency: number
}

export class Market {
  private readonly controller = new AbortController()
  private readonly pending = new Map<string, Promise<Quote>>()
  private readonly lookups = new Map<string, Promise<Fund>>()
  private readonly attempts = new Map<string, number>()
  private active = 0
  private readonly queue: (() => void)[] = []

  constructor(
    private readonly store: PortfolioStore,
    private readonly provider: PublicFundProvider,
    private readonly config: MarketConfig,
    private readonly now: () => number = Date.now,
  ) {}

  private async limited<Result>(operation: () => Promise<Result>): Promise<Result> {
    if (this.active >= this.config.concurrency) await new Promise<void>(resolve => this.queue.push(resolve))
    else this.active++
    try {
      this.controller.signal.throwIfAborted()
      return await operation()
    } finally {
      const next = this.queue.shift()
      if (next) next()
      else this.active--
    }
  }

  private async waitForCaller<Result>(pending: Promise<Result>, signal: AbortSignal): Promise<Result> {
    signal.throwIfAborted()
    let rejectAbort: ((reason?: unknown) => void) | undefined
    const aborted = new Promise<Result>((_resolve, reject) => {
      rejectAbort = reject
    })
    const onAbort = () => rejectAbort?.(signal.reason)
    signal.addEventListener('abort', onAbort, { once: true })
    try {
      return await Promise.race([pending, aborted])
    } finally {
      signal.removeEventListener('abort', onAbort)
    }
  }

  async lookup(code: string, signal: AbortSignal): Promise<Fund> {
    signal.throwIfAborted()
    this.controller.signal.throwIfAborted()
    const cached = this.store.fund(code)
    if (cached && this.now() - Date.parse(cached.fetchedAt) < this.config.fundCacheMs) return cached
    let pending = this.lookups.get(code)
    if (!pending) {
      pending = this.limited(async () => {
        const fund = await this.provider.fund(code, this.controller.signal)
        this.controller.signal.throwIfAborted()
        this.store.saveFund(fund)
        return fund
      }).finally(() => this.lookups.delete(code))
      this.lookups.set(code, pending)
    }
    const result = await this.waitForCaller(pending, signal)
    signal.throwIfAborted()
    return result
  }

  async refresh(fund: Fund, force: boolean, signal: AbortSignal): Promise<Quote> {
    signal.throwIfAborted()
    this.controller.signal.throwIfAborted()
    let pending = this.pending.get(fund.code)
    if (!pending) {
      pending = this.limited(() => this.refreshOne(fund, force)).finally(() => this.pending.delete(fund.code))
      this.pending.set(fund.code, pending)
    }
    const result = await this.waitForCaller(pending, signal)
    signal.throwIfAborted()
    return result
  }

  private async refreshOne(fund: Fund, force: boolean): Promise<Quote> {
    const quote = this.store.quote(fund.code)
    const timestamp = this.now()
    const lastAttempt = this.attempts.get(fund.code)
    if (lastAttempt !== undefined && timestamp - lastAttempt < this.config.minRefreshMs) return quote
    const expired = (value: string | null, ttl: number): boolean => value === null || timestamp - Date.parse(value) >= ttl
    const fetchNav = force || expired(quote.navFetchedAt, this.config.navCacheMs)
    const fetchEstimate = fund.kind !== 'money' && (force || expired(quote.estimateFetchedAt, this.config.estimateCacheMs))
    if (!fetchNav && !fetchEstimate) return quote
    this.attempts.set(fund.code, timestamp)
    const failures: string[] = []
    const fetchedAt = new Date(timestamp).toISOString()
    if (fetchNav) {
      try {
        const navs = await this.provider.nav(fund, this.controller.signal)
        if (!quote.navs[0] || navs[0]!.date >= quote.navs[0].date) quote.navs = navs
        quote.navFetchedAt = fetchedAt
      } catch (error) {
        failures.push(`NAV: ${error instanceof Error ? error.message : String(error)}`)
      }
    }
    if (fetchEstimate) {
      try {
        const estimate = await this.provider.estimate(fund.code, this.controller.signal)
        if (estimate && (!quote.estimate || `${estimate.date} ${estimate.time}` >= `${quote.estimate.date} ${quote.estimate.time}`)) {
          const basis = quote.navs.find(nav => nav.date < estimate.date && new Decimal(nav.value).eq(estimate.referenceValue))
          estimate.referenceDate = basis?.date ?? null
          quote.estimate = estimate
        }
        quote.estimateFetchedAt = fetchedAt
        if (!estimate) failures.push('Estimate unavailable')
      } catch (error) {
        failures.push(`Estimate: ${error instanceof Error ? error.message : String(error)}`)
      }
    }
    this.controller.signal.throwIfAborted()
    quote.error = failures.length ? failures.join('; ') : null
    this.store.saveQuote(quote)
    return quote
  }

  async dispose(): Promise<void> {
    this.controller.abort()
    await Promise.allSettled([...this.pending.values(), ...this.lookups.values()])
  }
}
