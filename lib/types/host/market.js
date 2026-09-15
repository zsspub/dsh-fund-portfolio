/** Instance-local deduplication and bounded, cancellable refresh of anonymous market data. */
import { Decimal } from 'decimal.js';
export class Market {
    store;
    provider;
    config;
    now;
    controller = new AbortController();
    pending = new Map();
    lookups = new Map();
    attempts = new Map();
    active = 0;
    queue = [];
    constructor(store, provider, config, now = Date.now) {
        this.store = store;
        this.provider = provider;
        this.config = config;
        this.now = now;
    }
    async limited(operation) {
        if (this.active >= this.config.concurrency)
            await new Promise(resolve => this.queue.push(resolve));
        else
            this.active++;
        try {
            this.controller.signal.throwIfAborted();
            return await operation();
        }
        finally {
            const next = this.queue.shift();
            if (next)
                next();
            else
                this.active--;
        }
    }
    async waitForCaller(pending, signal) {
        signal.throwIfAborted();
        let rejectAbort;
        const aborted = new Promise((_resolve, reject) => {
            rejectAbort = reject;
        });
        const onAbort = () => rejectAbort?.(signal.reason);
        signal.addEventListener('abort', onAbort, { once: true });
        try {
            return await Promise.race([pending, aborted]);
        }
        finally {
            signal.removeEventListener('abort', onAbort);
        }
    }
    async lookup(code, signal) {
        signal.throwIfAborted();
        this.controller.signal.throwIfAborted();
        const cached = this.store.fund(code);
        if (cached && this.now() - Date.parse(cached.fetchedAt) < this.config.fundCacheMs)
            return cached;
        let pending = this.lookups.get(code);
        if (!pending) {
            pending = this.limited(async () => {
                const fund = await this.provider.fund(code, this.controller.signal);
                this.controller.signal.throwIfAborted();
                this.store.saveFund(fund);
                return fund;
            }).finally(() => this.lookups.delete(code));
            this.lookups.set(code, pending);
        }
        const result = await this.waitForCaller(pending, signal);
        signal.throwIfAborted();
        return result;
    }
    async refresh(fund, force, signal) {
        signal.throwIfAborted();
        this.controller.signal.throwIfAborted();
        let pending = this.pending.get(fund.code);
        if (!pending) {
            pending = this.limited(() => this.refreshOne(fund, force)).finally(() => this.pending.delete(fund.code));
            this.pending.set(fund.code, pending);
        }
        const result = await this.waitForCaller(pending, signal);
        signal.throwIfAborted();
        return result;
    }
    async refreshOne(fund, force) {
        const quote = this.store.quote(fund.code);
        const timestamp = this.now();
        const lastAttempt = this.attempts.get(fund.code);
        if (lastAttempt !== undefined && timestamp - lastAttempt < this.config.minRefreshMs)
            return quote;
        const expired = (value, ttl) => value === null || timestamp - Date.parse(value) >= ttl;
        const fetchNav = force || expired(quote.navFetchedAt, this.config.navCacheMs);
        const fetchEstimate = fund.kind !== 'money' && (force || expired(quote.estimateFetchedAt, this.config.estimateCacheMs));
        if (!fetchNav && !fetchEstimate)
            return quote;
        this.attempts.set(fund.code, timestamp);
        const failures = [];
        const fetchedAt = new Date(timestamp).toISOString();
        if (fetchNav) {
            try {
                const navs = await this.provider.nav(fund, this.controller.signal);
                if (!quote.navs[0] || navs[0].date >= quote.navs[0].date)
                    quote.navs = navs;
                quote.navFetchedAt = fetchedAt;
            }
            catch (error) {
                failures.push(`NAV: ${error instanceof Error ? error.message : String(error)}`);
            }
        }
        if (fetchEstimate) {
            try {
                const estimate = await this.provider.estimate(fund.code, this.controller.signal);
                if (estimate && (!quote.estimate || `${estimate.date} ${estimate.time}` >= `${quote.estimate.date} ${quote.estimate.time}`)) {
                    const basis = quote.navs.find(nav => nav.date < estimate.date && new Decimal(nav.value).eq(estimate.referenceValue));
                    estimate.referenceDate = basis?.date ?? null;
                    quote.estimate = estimate;
                }
                quote.estimateFetchedAt = fetchedAt;
                if (!estimate)
                    failures.push('Estimate unavailable');
            }
            catch (error) {
                failures.push(`Estimate: ${error instanceof Error ? error.message : String(error)}`);
            }
        }
        this.controller.signal.throwIfAborted();
        quote.error = failures.length ? failures.join('; ') : null;
        this.store.saveQuote(quote);
        return quote;
    }
    async dispose() {
        this.controller.abort();
        await Promise.allSettled([...this.pending.values(), ...this.lookups.values()]);
    }
}
