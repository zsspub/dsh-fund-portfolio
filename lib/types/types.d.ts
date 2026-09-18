/** Wire-safe portfolio records. Decimal values are strings; dates belong to the data provider. */
import type { Branded } from '@deepseek-ai/dsh-brand';
declare module '@deepseek-ai/dsh-typert-protocol' {
    interface RemoteErrorDetailsMap {
        'fund-portfolio/duplicate-holding': {
            readonly accountId: string;
            readonly fundCode: string;
        };
        'fund-portfolio/rejected': {
            readonly operation: string;
        };
        'fund-portfolio/unavailable': {
            readonly operation: string;
        };
    }
}
export type AccountId = Branded<'FundAccountId'>;
export type HoldingId = Branded<'FundHoldingId'>;
export type FundKind = 'nav' | 'qdii' | 'money';
export interface Account {
    id: AccountId;
    name: string;
    version: number;
}
export interface Holding {
    id: HoldingId;
    accountId: AccountId;
    fundCode: string;
    shares: string;
    costPrice: string;
    targetRatio: string | null;
    version: number;
}
export interface Fund {
    code: string;
    name: string;
    kind: FundKind;
    currency: 'CNY';
    fetchedAt: string;
}
export interface Nav {
    date: string;
    value: string;
    annualYield: string | null;
    action: string | null;
}
export interface Estimate {
    date: string;
    time: string;
    value: string;
    referenceValue: string;
    referenceDate: string | null;
}
export interface Quote {
    code: string;
    navs: Nav[];
    estimate: Estimate | null;
    navFetchedAt: string | null;
    estimateFetchedAt: string | null;
    error: string | null;
}
export interface Income {
    amount: string;
    date: string;
    basisDate: string | null;
    kind: 'confirmed' | 'estimated';
}
export interface HoldingView {
    holding: Holding;
    accountName: string;
    fund: Fund;
    quote: Quote;
    cost: string;
    marketValue: string | null;
    priceKind: 'nav' | 'estimate' | 'money' | null;
    priceDate: string | null;
    floatingProfit: string | null;
    floatingRate: string | null;
    confirmed: Income | null;
    estimated: Income | null;
    today: Income | null;
    referenceChange: string | null;
    issue: 'pending' | 'review' | 'baseline' | 'unavailable' | null;
    currentRatio: string | null;
    rebalance: Rebalance | null;
}
export interface Rebalance {
    action: 'buy' | 'sell' | 'hold';
    amount: string;
    shares: string;
}
export interface AllocationSummary {
    status: 'unconfigured' | 'invalid-target-total' | 'market-incomplete' | 'ready';
    holdings: number;
    configured: number;
    targetTotal: string;
    buyAmount: string | null;
    sellAmount: string | null;
}
export interface Portfolio {
    date: string;
    accounts: Account[];
    holdings: HoldingView[];
    cost: string;
    marketValue: string | null;
    marketCovered: number;
    floatingProfit: string | null;
    floatingCovered: number;
    confirmedToday: string | null;
    estimatedToday: string | null;
    todayTotal: string | null;
    confirmedCount: number;
    estimatedCount: number;
    missingCount: number;
    refreshIntervalMs: number;
    allocation: AllocationSummary | null;
}
export interface AccountInput {
    name: string;
}
export interface AccountEdit {
    id: AccountId;
    version: number;
    name: string;
}
export interface AccountRef {
    id: AccountId;
    version: number;
}
export interface HoldingInput {
    accountId: AccountId;
    fundCode: string;
    shares: string;
    costPrice: string;
}
export interface HoldingEdit extends HoldingInput {
    id: HoldingId;
    version: number;
}
export interface HoldingRef {
    id: HoldingId;
    version: number;
}
export interface AllocationTarget {
    id: HoldingId;
    version: number;
    targetRatio: string;
}
export interface AllocationUpdateInput {
    accountId: AccountId;
    allocations: AllocationTarget[];
}
export interface LookupInput {
    code: string;
}
export interface PortfolioInput {
    accountId?: AccountId;
    refresh?: boolean;
    force?: boolean;
}
export interface EmptyInput {
    readonly unused?: never;
}
export interface MutationResult {
    ok: boolean;
}
export interface BackupFile {
    filename: string;
    json: string;
}
export interface ImportInput {
    json: string;
}
export interface ImportCommit {
    json: string;
    previewToken: string;
    mode: 'merge' | 'replace';
}
export interface ImportPreview {
    previewToken: string;
    accounts: number;
    holdings: number;
    conflicts: string[];
}
export type LegacyHolding = Omit<Holding, 'targetRatio'>;
export interface BackupV1 {
    format: 1;
    accounts: Account[];
    holdings: LegacyHolding[];
    funds: Fund[];
}
export interface BackupV2 {
    format: 2;
    accounts: Account[];
    holdings: Holding[];
    funds: Fund[];
}
export type Backup = BackupV1 | BackupV2;
