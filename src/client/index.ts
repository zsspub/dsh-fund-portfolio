/** Mount the generated Remote and contribute a native right-sidebar tab. */
import type { Context } from '@deepseek-ai/cordis'
import type {} from '@deepseek-ai/dsh-api-remotes/client'
import type {} from '@deepseek-ai/dsh-client-locale/client'
import type {} from '@deepseek-ai/dsh-client-ui-renderer/client'
import type {} from '@deepseek-ai/dsh-client-ui-sidebar/client'
import type {} from '@deepseek-ai/dsh-client-ui-sidebar-right/client'
import remote from 'dsh-fund-portfolio/remote'
import { PortfolioPanel, PortfolioTrigger } from './Panel.tsx'
import { en, NS, zh, type PortfolioKey } from './locales.ts'
import type {
  Account, AccountEdit, AccountInput, AccountRef, AllocationUpdateInput, BackupFile, EmptyInput,
  Fund, Holding, HoldingEdit, HoldingInput, HoldingRef, ImportCommit, ImportInput, ImportPreview,
  LookupInput, MutationResult, Portfolio, PortfolioInput,
} from '../types.ts'

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap { fundPortfolio: PortfolioKey }
}

export interface FundApi {
  accountCreate(input: AccountInput, signal: AbortSignal): Promise<Account>
  accountUpdate(input: AccountEdit, signal: AbortSignal): Promise<Account>
  accountDelete(input: AccountRef, signal: AbortSignal): Promise<MutationResult>
  lookup(input: LookupInput, signal: AbortSignal): Promise<Fund>
  holdingAdd(input: HoldingInput, signal: AbortSignal): Promise<Holding>
  holdingUpdate(input: HoldingEdit, signal: AbortSignal): Promise<Holding>
  holdingDelete(input: HoldingRef, signal: AbortSignal): Promise<MutationResult>
  allocationUpdate(input: AllocationUpdateInput, signal: AbortSignal): Promise<Holding[]>
  summary(input: PortfolioInput, signal: AbortSignal): Promise<Portfolio>
  exportData(input: EmptyInput, signal: AbortSignal): Promise<BackupFile>
  previewImport(input: ImportInput, signal: AbortSignal): Promise<ImportPreview>
  importData(input: ImportCommit, signal: AbortSignal): Promise<MutationResult>
}

export const inject = ['slots', 'locale', 'remote', 'sidebarRight', 'sidebarRightTabs']

function unwrap<Value>(result: { ok: true; value: Value } | { ok: false; error: Error }): Value {
  if (!result.ok) throw result.error
  return result.value
}

export async function apply(ctx: Context): Promise<() => Promise<void>> {
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'fund-portfolio: locales')
  const t = ctx.locale.bind(NS)
  const unmount = await ctx.remote.$mount(remote)
  const fiber = ctx.inject(['remote.fundPortfolio'], scope => {
    scope.effect(() => scope.sidebarRightTabs.register({
      id: 'dsh-fund-portfolio', kind: 'fund-portfolio', title: () => t('title'),
    }), 'fund-portfolio: tab')
    const api: FundApi = {
      accountCreate: async (input, signal) => unwrap(await scope.remote.fundPortfolio.accountCreate(input, signal)),
      accountUpdate: async (input, signal) => unwrap(await scope.remote.fundPortfolio.accountUpdate(input, signal)),
      accountDelete: async (input, signal) => unwrap(await scope.remote.fundPortfolio.accountDelete(input, signal)),
      lookup: async (input, signal) => unwrap(await scope.remote.fundPortfolio.lookup(input, signal)),
      holdingAdd: async (input, signal) => unwrap(await scope.remote.fundPortfolio.holdingAdd(input, signal)),
      holdingUpdate: async (input, signal) => unwrap(await scope.remote.fundPortfolio.holdingUpdate(input, signal)),
      holdingDelete: async (input, signal) => unwrap(await scope.remote.fundPortfolio.holdingDelete(input, signal)),
      allocationUpdate: async (input, signal) => unwrap(await scope.remote.fundPortfolio.allocationUpdate(input, signal)),
      summary: async (input, signal) => unwrap(await scope.remote.fundPortfolio.summary(input, signal)),
      exportData: async (input, signal) => unwrap(await scope.remote.fundPortfolio.exportData(input, signal)),
      previewImport: async (input, signal) => unwrap(await scope.remote.fundPortfolio.previewImport(input, signal)),
      importData: async (input, signal) => unwrap(await scope.remote.fundPortfolio.importData(input, signal)),
    }
    scope.slots.inject('sidebar.footer.action', () => scope.slots.register({
      name: 'sidebar.footer.action', id: 'fund-portfolio', order: 60, locale: NS,
      inject: () => ({ openPanel: () => scope.sidebarRight.openTab('fund-portfolio') }),
    }, PortfolioTrigger))
    scope.slots.inject('sidebar.right.pane.tab', () => scope.slots.register({
      name: 'sidebar.right.pane.tab', key: 'dsh-fund-portfolio', locale: NS, inject: () => ({ api }),
    }, PortfolioPanel))
  })
  try { await fiber } catch (error) { await unmount(); throw error }
  return async () => { await fiber.dispose(); await unmount() }
}
