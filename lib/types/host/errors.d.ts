export declare function remoteOperation<Result>(operation: string, signal: AbortSignal, execute: () => Promise<Result> | Result, unavailable?: boolean): Promise<Result>;
