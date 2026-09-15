/** Fund portfolio Host service shared by Agent tools and the generated Web Remote. */
import type { Context } from '@deepseek-ai/cordis';
import Schema from '@deepseek-ai/schemastery';
import { TypertRemoteService } from '@deepseek-ai/dsh-typert-protocol';
import type { Account, AccountEdit, AccountInput, AccountRef, BackupFile, EmptyInput, Fund, Holding, HoldingEdit, HoldingInput, HoldingRef, ImportCommit, ImportInput, ImportPreview, LookupInput, MutationResult, Portfolio, PortfolioInput } from './types.ts';
export type * from './types.ts';
declare module '@deepseek-ai/cordis' {
    interface Context {
        fundPortfolio: FundPortfolioService;
    }
}
export interface Config {
    databasePath: string;
    busyTimeoutMs: number;
    refreshIntervalMs: number;
    estimateCacheMs: number;
    navCacheMs: number;
    fundCacheMs: number;
    minRefreshMs: number;
    timeoutMs: number;
    concurrency: number;
}
export declare class FundPortfolioService extends TypertRemoteService {
    private readonly config;
    static Config: Schema<Config>;
    private readonly store;
    private readonly market;
    constructor(ctx: Context, config: Config);
    /** List all accounts. @param _request Empty request. @param signal Cancellation. @returns Current accounts. */
    accountList(_request: EmptyInput, signal: AbortSignal): Promise<Account[]>;
    /** Create an account. @param request Account name. @param signal Cancellation. @returns Persisted account. */
    accountCreate(request: AccountInput, signal: AbortSignal): Promise<Account>;
    /** Rename with optimistic concurrency. @param request Expected version and name. @param signal Cancellation. @returns Updated account. */
    accountUpdate(request: AccountEdit, signal: AbortSignal): Promise<Account>;
    /** Delete an empty account. @param request Expected account version. @param signal Cancellation. @returns Successful deletion. */
    accountDelete(request: AccountRef, signal: AbortSignal): Promise<MutationResult>;
    /** Verify a fund code with the public provider. @param request Six-digit fund code. @param signal Cancellation. @returns Verified metadata. */
    lookup(request: LookupInput, signal: AbortSignal): Promise<Fund>;
    /** List current holdings without refreshing market data. @param _request Empty request. @param signal Cancellation. @returns Holdings and record versions. */
    holdingList(_request: EmptyInput, signal: AbortSignal): Promise<Holding[]>;
    /** Add a previously verified fund. @param request Account, fund and decimal values. @param signal Cancellation. @returns Persisted holding. */
    holdingAdd(request: HoldingInput, signal: AbortSignal): Promise<Holding>;
    /** Edit with optimistic concurrency. @param request Expected version and replacement values. @param signal Cancellation. @returns Updated holding. */
    holdingUpdate(request: HoldingEdit, signal: AbortSignal): Promise<Holding>;
    /** Delete a holding. @param request Expected holding version. @param signal Cancellation. @returns Successful deletion. */
    holdingDelete(request: HoldingRef, signal: AbortSignal): Promise<MutationResult>;
    /** Calculate current-share returns, optionally refreshing quotes. @param request Account filter and refresh policy. @param signal Cancellation. @returns Dated results including coverage and missing values. */
    summary(request: PortfolioInput, signal: AbortSignal): Promise<Portfolio>;
    /** Export private portfolio data, without market caches. @param _request Empty request. @param signal Cancellation. @returns JSON backup and suggested filename. */
    exportData(_request: EmptyInput, signal: AbortSignal): Promise<BackupFile>;
    /** Preview an import without mutation. @param request Backup JSON. @param signal Cancellation. @returns Conflict list and state-bound token. */
    previewImport(request: ImportInput, signal: AbortSignal): Promise<ImportPreview>;
    /** Apply an explicitly confirmed preview in one transaction. @param request Backup, mode and preview token. @param signal Cancellation. @returns Successful import. */
    importData(request: ImportCommit, signal: AbortSignal): Promise<MutationResult>;
}
export default FundPortfolioService;
