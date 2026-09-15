/** Per-tab refresh lifetime; mutations and poll responses never overwrite newer state. */
import type { Portfolio, PortfolioInput } from '../types.ts';
export interface PortfolioReader {
    summary(request: PortfolioInput, signal: AbortSignal): Promise<Portfolio>;
}
export interface ViewState {
    data: Portfolio | null;
    busy: boolean;
    error: string | null;
}
export declare class PortfolioController {
    private readonly api;
    private state;
    private readonly listeners;
    private request;
    private timer;
    private visible;
    private disposed;
    private generation;
    private filter;
    constructor(api: PortfolioReader);
    getSnapshot: () => ViewState;
    subscribe: (listener: () => void) => (() => void);
    private publish;
    setVisible(visible: boolean): void;
    select(filter: PortfolioInput): void;
    refresh(force?: boolean): Promise<void>;
    dispose(): void;
}
