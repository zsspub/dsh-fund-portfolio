/** Fund portfolio Host service shared by Agent tools and the generated Web Remote. */
import type { Context } from '@deepseek-ai/cordis'
import Schema from '@deepseek-ai/schemastery'
import { Remote, TypertRemoteService } from '@deepseek-ai/dsh-typert-protocol'
import { PortfolioStore } from './host/store.ts'
import { PublicFundProvider } from './host/providers.ts'
import { Market } from './host/market.ts'
import { summarize, valueHolding } from './host/profit.ts'
import { todayAt } from './host/validation.ts'
import { remoteOperation } from './host/errors.ts'
import type {
  Account, AccountEdit, AccountInput, AccountRef, AllocationUpdateInput, BackupFile, EmptyInput,
  Fund, Holding, HoldingEdit, HoldingInput, HoldingRef, ImportCommit, ImportInput, ImportPreview,
  LookupInput, MutationResult, Portfolio, PortfolioInput,
} from './types.ts'

export type * from './types.ts'

declare module '@deepseek-ai/cordis' {
  interface Context { fundPortfolio: FundPortfolioService }
}

export interface Config {
  databasePath: string
  busyTimeoutMs: number
  refreshIntervalMs: number
  estimateCacheMs: number
  navCacheMs: number
  fundCacheMs: number
  minRefreshMs: number
  timeoutMs: number
  concurrency: number
}

export class FundPortfolioService extends TypertRemoteService {
  static Config: Schema<Config> = Schema.object({
    databasePath: Schema.string().required(),
    busyTimeoutMs: Schema.number().min(1).step(1).default(5000),
    refreshIntervalMs: Schema.number().min(10000).step(1).default(60000),
    estimateCacheMs: Schema.number().min(1000).step(1).default(60000),
    navCacheMs: Schema.number().min(1000).step(1).default(300000),
    fundCacheMs: Schema.number().min(1000).step(1).default(86400000),
    minRefreshMs: Schema.number().min(1000).step(1).default(10000),
    timeoutMs: Schema.number().min(1).step(1).default(10000),
    concurrency: Schema.number().min(1).max(16).step(1).default(4),
  })

  private readonly store: PortfolioStore
  private readonly market: Market

  constructor(ctx: Context, private readonly config: Config) {
    super(ctx, 'fundPortfolio')
    this.store = new PortfolioStore(config.databasePath, config.busyTimeoutMs)
    this.market = new Market(this.store, new PublicFundProvider({ timeoutMs: config.timeoutMs }), config)
    ctx.effect(() => async () => {
      await this.market.dispose()
      this.store.close()
    }, 'fund-portfolio: close market and store')
  }

  /** List all accounts. @param _request Empty request. @param signal Cancellation. @returns Current accounts. */
  @Remote
  async accountList(_request: EmptyInput, signal: AbortSignal): Promise<Account[]> {
    return remoteOperation('account.list', signal, () => this.store.accounts())
  }

  /** Create an account. @param request Account name. @param signal Cancellation. @returns Persisted account. */
  @Remote
  async accountCreate(request: AccountInput, signal: AbortSignal): Promise<Account> {
    return remoteOperation('account.create', signal, () => this.store.createAccount(request.name))
  }

  /** Rename with optimistic concurrency. @param request Expected version and name. @param signal Cancellation. @returns Updated account. */
  @Remote
  async accountUpdate(request: AccountEdit, signal: AbortSignal): Promise<Account> {
    return remoteOperation('account.update', signal, () => this.store.editAccount(request))
  }

  /** Delete an empty account. @param request Expected account version. @param signal Cancellation. @returns Successful deletion. */
  @Remote
  async accountDelete(request: AccountRef, signal: AbortSignal): Promise<MutationResult> {
    return remoteOperation('account.delete', signal, () => {
      this.store.deleteAccount(request)
      return { ok: true }
    })
  }

  /** Verify a fund code with the public provider. @param request Six-digit fund code. @param signal Cancellation. @returns Verified metadata. */
  @Remote
  async lookup(request: LookupInput, signal: AbortSignal): Promise<Fund> {
    return remoteOperation('fund.lookup', signal, () => this.market.lookup(request.code, signal), true)
  }

  /** List current holdings without refreshing market data. @param _request Empty request. @param signal Cancellation. @returns Holdings and record versions. */
  @Remote
  async holdingList(_request: EmptyInput, signal: AbortSignal): Promise<Holding[]> {
    return remoteOperation('holding.list', signal, () => this.store.holdings())
  }

  /** Add a previously verified fund. @param request Account, fund and decimal values. @param signal Cancellation. @returns Persisted holding. */
  @Remote
  async holdingAdd(request: HoldingInput, signal: AbortSignal): Promise<Holding> {
    return remoteOperation('holding.add', signal, () => this.store.addHolding(request))
  }

  /** Edit with optimistic concurrency. @param request Expected version and replacement values. @param signal Cancellation. @returns Updated holding. */
  @Remote
  async holdingUpdate(request: HoldingEdit, signal: AbortSignal): Promise<Holding> {
    return remoteOperation('holding.update', signal, () => this.store.editHolding(request))
  }

  /** Delete a holding. @param request Expected holding version. @param signal Cancellation. @returns Successful deletion. */
  @Remote
  async holdingDelete(request: HoldingRef, signal: AbortSignal): Promise<MutationResult> {
    return remoteOperation('holding.delete', signal, () => {
      this.store.deleteHolding(request)
      return { ok: true }
    })
  }

  /** Atomically replace every target ratio in an account. @param request Complete account allocation and current holding versions. @param signal Cancellation. @returns Updated holdings. */
  @Remote
  async allocationUpdate(request: AllocationUpdateInput, signal: AbortSignal): Promise<Holding[]> {
    return remoteOperation('allocation.update', signal, () => this.store.updateAllocation(request))
  }

  /** Calculate current-share returns, optionally refreshing quotes. @param request Account filter and refresh policy. @param signal Cancellation. @returns Dated results including coverage and missing values. */
  @Remote
  async summary(request: PortfolioInput, signal: AbortSignal): Promise<Portfolio> {
    return remoteOperation('portfolio.summary', signal, async () => {
      if (request.accountId) this.store.account(request.accountId)
      const before = this.store.holdings().filter(item => !request.accountId || item.accountId === request.accountId)
      if (request.refresh !== false) {
        const funds = [...new Set(before.map(item => item.fundCode))]
          .map(code => this.store.fund(code))
          .filter((fund): fund is Fund => fund !== null)
        await Promise.all(funds.map(fund => this.market.refresh(fund, request.force === true, signal)))
      }
      const accounts = this.store.accounts()
      const holdings = this.store.holdings().filter(item => !request.accountId || item.accountId === request.accountId)
      const date = todayAt(Date.now())
      const rows = holdings.map(holding => {
        const fund = this.store.fund(holding.fundCode)
        if (!fund) throw new Error(`Missing metadata for ${holding.fundCode}`)
        return valueHolding(
          holding, this.store.account(holding.accountId), fund,
          this.store.quote(holding.fundCode), date,
        )
      })
      return summarize(date, accounts, rows, this.config.refreshIntervalMs, request.accountId)
    })
  }

  /** Export private portfolio data, without market caches. @param _request Empty request. @param signal Cancellation. @returns JSON backup and suggested filename. */
  @Remote
  async exportData(_request: EmptyInput, signal: AbortSignal): Promise<BackupFile> {
    return remoteOperation('portfolio.export', signal, () => ({
      filename: `fund-portfolio-${todayAt(Date.now())}.json`,
      json: JSON.stringify(this.store.backup(), null, 2),
    }))
  }

  /** Preview an import without mutation. @param request Backup JSON. @param signal Cancellation. @returns Conflict list and state-bound token. */
  @Remote
  async previewImport(request: ImportInput, signal: AbortSignal): Promise<ImportPreview> {
    return remoteOperation('portfolio.import-preview', signal, () => this.store.preview(request.json))
  }

  /** Apply an explicitly confirmed preview in one transaction. @param request Backup, mode and preview token. @param signal Cancellation. @returns Successful import. */
  @Remote
  async importData(request: ImportCommit, signal: AbortSignal): Promise<MutationResult> {
    return remoteOperation('portfolio.import', signal, () => {
      this.store.import(request)
      return { ok: true }
    })
  }
}

export default FundPortfolioService
