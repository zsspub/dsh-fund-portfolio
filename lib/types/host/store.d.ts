import type { Account, AccountEdit, AccountId, AccountRef, AllocationUpdateInput, BackupV2, Fund, Holding, HoldingEdit, HoldingId, HoldingInput, HoldingRef, ImportCommit, ImportPreview, Quote } from '../types.ts';
export declare class PortfolioStore {
    private readonly database;
    constructor(path: string, busyTimeoutMs: number);
    close(): void;
    accounts(): Account[];
    holdings(): Holding[];
    account(id: AccountId): Account;
    holding(id: HoldingId): Holding;
    createAccount(name: string): Account;
    editAccount(input: AccountEdit): Account;
    deleteAccount(input: AccountRef): void;
    saveFund(fund: Fund): void;
    fund(code: string): Fund | null;
    private checkHolding;
    addHolding(input: HoldingInput): Holding;
    editHolding(input: HoldingEdit): Holding;
    deleteHolding(input: HoldingRef): void;
    updateAllocation(input: AllocationUpdateInput): Holding[];
    quote(code: string): Quote;
    saveQuote(quote: Quote): void;
    backup(): BackupV2;
    private readBackup;
    preview(json: string): ImportPreview;
    import(input: ImportCommit): void;
    private transaction;
}
