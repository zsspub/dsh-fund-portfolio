/** Mount the generated Remote and contribute a native right-sidebar tab. */
import type { Context } from '@deepseek-ai/cordis';
import { type PortfolioKey } from './locales.ts';
import type { Account, AccountEdit, AccountInput, AccountRef, BackupFile, EmptyInput, Fund, Holding, HoldingEdit, HoldingInput, HoldingRef, ImportCommit, ImportInput, ImportPreview, LookupInput, MutationResult, Portfolio, PortfolioInput } from '../types.ts';
declare module '@deepseek-ai/dsh-client-ui-slots' {
    interface LocaleNamespaceMap {
        fundPortfolio: PortfolioKey;
    }
}
export interface FundApi {
    accountCreate(input: AccountInput, signal: AbortSignal): Promise<Account>;
    accountUpdate(input: AccountEdit, signal: AbortSignal): Promise<Account>;
    accountDelete(input: AccountRef, signal: AbortSignal): Promise<MutationResult>;
    lookup(input: LookupInput, signal: AbortSignal): Promise<Fund>;
    holdingAdd(input: HoldingInput, signal: AbortSignal): Promise<Holding>;
    holdingUpdate(input: HoldingEdit, signal: AbortSignal): Promise<Holding>;
    holdingDelete(input: HoldingRef, signal: AbortSignal): Promise<MutationResult>;
    summary(input: PortfolioInput, signal: AbortSignal): Promise<Portfolio>;
    exportData(input: EmptyInput, signal: AbortSignal): Promise<BackupFile>;
    previewImport(input: ImportInput, signal: AbortSignal): Promise<ImportPreview>;
    importData(input: ImportCommit, signal: AbortSignal): Promise<MutationResult>;
}
export declare const inject: string[];
export declare function apply(ctx: Context): Promise<() => Promise<void>>;
