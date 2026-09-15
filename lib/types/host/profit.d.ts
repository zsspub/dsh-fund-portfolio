import type { Account, Fund, Holding, HoldingView, Portfolio, Quote } from '../types.ts';
export declare function valueHolding(holding: Holding, account: Account, fund: Fund, quote: Quote, today: string): HoldingView;
export declare function summarize(date: string, accounts: Account[], holdings: HoldingView[], refreshIntervalMs: number): Portfolio;
