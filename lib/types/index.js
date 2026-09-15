var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
import Schema from '@deepseek-ai/schemastery';
import { Remote, TypertRemoteService } from '@deepseek-ai/dsh-typert-protocol';
import { PortfolioStore } from "./host/store.js";
import { PublicFundProvider } from "./host/providers.js";
import { Market } from "./host/market.js";
import { summarize, valueHolding } from "./host/profit.js";
import { todayAt } from "./host/validation.js";
import { remoteOperation } from "./host/errors.js";
let FundPortfolioService = (() => {
    let _classSuper = TypertRemoteService;
    let _instanceExtraInitializers = [];
    let _accountList_decorators;
    let _accountCreate_decorators;
    let _accountUpdate_decorators;
    let _accountDelete_decorators;
    let _lookup_decorators;
    let _holdingList_decorators;
    let _holdingAdd_decorators;
    let _holdingUpdate_decorators;
    let _holdingDelete_decorators;
    let _summary_decorators;
    let _exportData_decorators;
    let _previewImport_decorators;
    let _importData_decorators;
    return class FundPortfolioService extends _classSuper {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _accountList_decorators = [Remote];
            _accountCreate_decorators = [Remote];
            _accountUpdate_decorators = [Remote];
            _accountDelete_decorators = [Remote];
            _lookup_decorators = [Remote];
            _holdingList_decorators = [Remote];
            _holdingAdd_decorators = [Remote];
            _holdingUpdate_decorators = [Remote];
            _holdingDelete_decorators = [Remote];
            _summary_decorators = [Remote];
            _exportData_decorators = [Remote];
            _previewImport_decorators = [Remote];
            _importData_decorators = [Remote];
            __esDecorate(this, null, _accountList_decorators, { kind: "method", name: "accountList", static: false, private: false, access: { has: obj => "accountList" in obj, get: obj => obj.accountList }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _accountCreate_decorators, { kind: "method", name: "accountCreate", static: false, private: false, access: { has: obj => "accountCreate" in obj, get: obj => obj.accountCreate }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _accountUpdate_decorators, { kind: "method", name: "accountUpdate", static: false, private: false, access: { has: obj => "accountUpdate" in obj, get: obj => obj.accountUpdate }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _accountDelete_decorators, { kind: "method", name: "accountDelete", static: false, private: false, access: { has: obj => "accountDelete" in obj, get: obj => obj.accountDelete }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _lookup_decorators, { kind: "method", name: "lookup", static: false, private: false, access: { has: obj => "lookup" in obj, get: obj => obj.lookup }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _holdingList_decorators, { kind: "method", name: "holdingList", static: false, private: false, access: { has: obj => "holdingList" in obj, get: obj => obj.holdingList }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _holdingAdd_decorators, { kind: "method", name: "holdingAdd", static: false, private: false, access: { has: obj => "holdingAdd" in obj, get: obj => obj.holdingAdd }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _holdingUpdate_decorators, { kind: "method", name: "holdingUpdate", static: false, private: false, access: { has: obj => "holdingUpdate" in obj, get: obj => obj.holdingUpdate }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _holdingDelete_decorators, { kind: "method", name: "holdingDelete", static: false, private: false, access: { has: obj => "holdingDelete" in obj, get: obj => obj.holdingDelete }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _summary_decorators, { kind: "method", name: "summary", static: false, private: false, access: { has: obj => "summary" in obj, get: obj => obj.summary }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _exportData_decorators, { kind: "method", name: "exportData", static: false, private: false, access: { has: obj => "exportData" in obj, get: obj => obj.exportData }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _previewImport_decorators, { kind: "method", name: "previewImport", static: false, private: false, access: { has: obj => "previewImport" in obj, get: obj => obj.previewImport }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _importData_decorators, { kind: "method", name: "importData", static: false, private: false, access: { has: obj => "importData" in obj, get: obj => obj.importData }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        config = __runInitializers(this, _instanceExtraInitializers);
        static Config = Schema.object({
            databasePath: Schema.string().required(),
            busyTimeoutMs: Schema.number().min(1).step(1).default(5000),
            refreshIntervalMs: Schema.number().min(10000).step(1).default(60000),
            estimateCacheMs: Schema.number().min(1000).step(1).default(60000),
            navCacheMs: Schema.number().min(1000).step(1).default(300000),
            fundCacheMs: Schema.number().min(1000).step(1).default(86400000),
            minRefreshMs: Schema.number().min(1000).step(1).default(10000),
            timeoutMs: Schema.number().min(1).step(1).default(10000),
            concurrency: Schema.number().min(1).max(16).step(1).default(4),
        });
        store;
        market;
        constructor(ctx, config) {
            super(ctx, 'fundPortfolio');
            this.config = config;
            this.store = new PortfolioStore(config.databasePath, config.busyTimeoutMs);
            this.market = new Market(this.store, new PublicFundProvider({ timeoutMs: config.timeoutMs }), config);
            ctx.effect(() => async () => {
                await this.market.dispose();
                this.store.close();
            }, 'fund-portfolio: close market and store');
        }
        /** List all accounts. @param _request Empty request. @param signal Cancellation. @returns Current accounts. */
        async accountList(_request, signal) {
            return remoteOperation('account.list', signal, () => this.store.accounts());
        }
        /** Create an account. @param request Account name. @param signal Cancellation. @returns Persisted account. */
        async accountCreate(request, signal) {
            return remoteOperation('account.create', signal, () => this.store.createAccount(request.name));
        }
        /** Rename with optimistic concurrency. @param request Expected version and name. @param signal Cancellation. @returns Updated account. */
        async accountUpdate(request, signal) {
            return remoteOperation('account.update', signal, () => this.store.editAccount(request));
        }
        /** Delete an empty account. @param request Expected account version. @param signal Cancellation. @returns Successful deletion. */
        async accountDelete(request, signal) {
            return remoteOperation('account.delete', signal, () => {
                this.store.deleteAccount(request);
                return { ok: true };
            });
        }
        /** Verify a fund code with the public provider. @param request Six-digit fund code. @param signal Cancellation. @returns Verified metadata. */
        async lookup(request, signal) {
            return remoteOperation('fund.lookup', signal, () => this.market.lookup(request.code, signal), true);
        }
        /** List current holdings without refreshing market data. @param _request Empty request. @param signal Cancellation. @returns Holdings and record versions. */
        async holdingList(_request, signal) {
            return remoteOperation('holding.list', signal, () => this.store.holdings());
        }
        /** Add a previously verified fund. @param request Account, fund and decimal values. @param signal Cancellation. @returns Persisted holding. */
        async holdingAdd(request, signal) {
            return remoteOperation('holding.add', signal, () => this.store.addHolding(request));
        }
        /** Edit with optimistic concurrency. @param request Expected version and replacement values. @param signal Cancellation. @returns Updated holding. */
        async holdingUpdate(request, signal) {
            return remoteOperation('holding.update', signal, () => this.store.editHolding(request));
        }
        /** Delete a holding. @param request Expected holding version. @param signal Cancellation. @returns Successful deletion. */
        async holdingDelete(request, signal) {
            return remoteOperation('holding.delete', signal, () => {
                this.store.deleteHolding(request);
                return { ok: true };
            });
        }
        /** Calculate current-share returns, optionally refreshing quotes. @param request Account filter and refresh policy. @param signal Cancellation. @returns Dated results including coverage and missing values. */
        async summary(request, signal) {
            return remoteOperation('portfolio.summary', signal, async () => {
                if (request.accountId)
                    this.store.account(request.accountId);
                const before = this.store.holdings().filter(item => !request.accountId || item.accountId === request.accountId);
                if (request.refresh !== false) {
                    const funds = [...new Set(before.map(item => item.fundCode))]
                        .map(code => this.store.fund(code))
                        .filter((fund) => fund !== null);
                    await Promise.all(funds.map(fund => this.market.refresh(fund, request.force === true, signal)));
                }
                const accounts = this.store.accounts();
                const holdings = this.store.holdings().filter(item => !request.accountId || item.accountId === request.accountId);
                const date = todayAt(Date.now());
                const rows = holdings.map(holding => {
                    const fund = this.store.fund(holding.fundCode);
                    if (!fund)
                        throw new Error(`Missing metadata for ${holding.fundCode}`);
                    return valueHolding(holding, this.store.account(holding.accountId), fund, this.store.quote(holding.fundCode), date);
                });
                return summarize(date, accounts, rows, this.config.refreshIntervalMs);
            });
        }
        /** Export private portfolio data, without market caches. @param _request Empty request. @param signal Cancellation. @returns JSON backup and suggested filename. */
        async exportData(_request, signal) {
            return remoteOperation('portfolio.export', signal, () => ({
                filename: `fund-portfolio-${todayAt(Date.now())}.json`,
                json: JSON.stringify(this.store.backup(), null, 2),
            }));
        }
        /** Preview an import without mutation. @param request Backup JSON. @param signal Cancellation. @returns Conflict list and state-bound token. */
        async previewImport(request, signal) {
            return remoteOperation('portfolio.import-preview', signal, () => this.store.preview(request.json));
        }
        /** Apply an explicitly confirmed preview in one transaction. @param request Backup, mode and preview token. @param signal Cancellation. @returns Successful import. */
        async importData(request, signal) {
            return remoteOperation('portfolio.import', signal, () => {
                this.store.import(request);
                return { ok: true };
            });
        }
    };
})();
export { FundPortfolioService };
export default FundPortfolioService;
