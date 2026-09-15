import type { Estimate, Fund, Nav } from '../types.ts';
export declare function parseFundResponse(value: unknown, code: string, fetchedAt: string): Fund;
export declare function parseNavResponse(value: unknown, fund: Fund, today: string): Nav[];
export declare function parseEstimateResponse(text: string, code: string, today: string): Estimate | null;
export interface ProviderOptions {
    timeoutMs: number;
    fetch?: typeof fetch;
    now?: () => number;
}
export declare class PublicFundProvider {
    private readonly options;
    private readonly fetcher;
    private readonly now;
    constructor(options: ProviderOptions);
    private request;
    fund(code: string, signal: AbortSignal): Promise<Fund>;
    nav(fund: Fund, signal: AbortSignal): Promise<Nav[]>;
    estimate(code: string, signal: AbortSignal): Promise<Estimate | null>;
}
