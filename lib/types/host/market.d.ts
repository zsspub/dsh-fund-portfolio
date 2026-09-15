import type { Fund, Quote } from '../types.ts';
import { PortfolioStore } from './store.ts';
import { PublicFundProvider } from './providers.ts';
export interface MarketConfig {
    estimateCacheMs: number;
    navCacheMs: number;
    fundCacheMs: number;
    minRefreshMs: number;
    concurrency: number;
}
export declare class Market {
    private readonly store;
    private readonly provider;
    private readonly config;
    private readonly now;
    private readonly controller;
    private readonly pending;
    private readonly lookups;
    private readonly attempts;
    private active;
    private readonly queue;
    constructor(store: PortfolioStore, provider: PublicFundProvider, config: MarketConfig, now?: () => number);
    private limited;
    private waitForCaller;
    lookup(code: string, signal: AbortSignal): Promise<Fund>;
    refresh(fund: Fund, force: boolean, signal: AbortSignal): Promise<Quote>;
    private refreshOne;
    dispose(): Promise<void>;
}
