import { c as parseFund, d as priorCalendarDate, f as signedDecimalText, i as decimalText, l as parseHolding, n as codeSchema, o as nameSchema, p as todayAt, r as dateString, s as parseAccount, t as backupSchema, u as positiveText } from "./validation-mR4ok74W.js";
import Schema from "@deepseek-ai/schemastery";
import { Remote, RemoteError, TypertRemoteService, remoteErrorOf } from "@deepseek-ai/dsh-typert-protocol";
import { DatabaseSync } from "node:sqlite";
import { chmodSync, mkdirSync } from "node:fs";
import { dirname, isAbsolute } from "node:path";
import { createHash, randomUUID } from "node:crypto";
import { z } from "zod";
import { Decimal } from "decimal.js";
//#region lib/types/host/store.js
/** SQLite owns current holdings and dated market observations; no transaction ledger is inferred. */
const navSchema = z.object({
	date: z.iso.date(),
	value: signedDecimalText,
	annualYield: signedDecimalText.nullable(),
	action: z.string().nullable()
});
const quoteSchema = z.object({
	code: codeSchema,
	navs: z.array(navSchema),
	estimate: z.object({
		date: z.iso.date(),
		time: z.string(),
		value: positiveText,
		referenceValue: positiveText,
		referenceDate: z.iso.date().nullable()
	}).nullable(),
	navFetchedAt: z.iso.datetime().nullable(),
	estimateFetchedAt: z.iso.datetime().nullable(),
	error: z.string().nullable()
});
var PortfolioStore = class {
	database;
	constructor(path, busyTimeoutMs) {
		if (!isAbsolute(path)) throw new Error("databasePath must be absolute");
		mkdirSync(dirname(path), {
			recursive: true,
			mode: 448
		});
		this.database = new DatabaseSync(path);
		try {
			if (process.platform !== "win32") chmodSync(path, 384);
			this.database.exec(`PRAGMA busy_timeout=${Math.trunc(busyTimeoutMs)}; PRAGMA foreign_keys=ON;`);
			const version = Number(this.database.prepare("PRAGMA user_version").get().user_version);
			if (version > 1) throw new Error("Database schema is newer than this plugin");
			this.database.exec("PRAGMA journal_mode=WAL");
			if (version === 0) this.database.exec(`
        BEGIN IMMEDIATE;
        CREATE TABLE accounts (id TEXT PRIMARY KEY, name TEXT NOT NULL UNIQUE, version INTEGER NOT NULL);
        CREATE TABLE funds (code TEXT PRIMARY KEY, json TEXT NOT NULL);
        CREATE TABLE holdings (
          id TEXT PRIMARY KEY, account_id TEXT NOT NULL REFERENCES accounts(id),
          fund_code TEXT NOT NULL REFERENCES funds(code), shares TEXT NOT NULL, cost_price TEXT NOT NULL,
          version INTEGER NOT NULL, UNIQUE(account_id, fund_code)
        );
        CREATE TABLE quotes (code TEXT PRIMARY KEY, json TEXT NOT NULL);
        CREATE TABLE observations (code TEXT NOT NULL, date TEXT NOT NULL, kind TEXT NOT NULL, json TEXT NOT NULL, PRIMARY KEY(code,date,kind));
        PRAGMA user_version=1;
        COMMIT;
      `);
		} catch (error) {
			this.database.close();
			throw error;
		}
	}
	close() {
		this.database.close();
	}
	accounts() {
		return this.database.prepare("SELECT * FROM accounts ORDER BY name,id").all().map(parseAccount);
	}
	holdings() {
		return this.database.prepare("SELECT id,account_id AS accountId,fund_code AS fundCode,shares,cost_price AS costPrice,version FROM holdings ORDER BY account_id,fund_code").all().map(parseHolding);
	}
	account(id) {
		const found = this.accounts().find((item) => item.id === id);
		if (!found) throw new Error("Account not found");
		return found;
	}
	holding(id) {
		const found = this.holdings().find((item) => item.id === id);
		if (!found) throw new Error("Holding not found");
		return found;
	}
	createAccount(name) {
		const account = {
			id: randomUUID(),
			name: nameSchema.parse(name),
			version: 1
		};
		this.database.prepare("INSERT INTO accounts VALUES (?,?,?)").run(account.id, account.name, account.version);
		return account;
	}
	editAccount(input) {
		const name = nameSchema.parse(input.name);
		if (this.database.prepare("UPDATE accounts SET name=?,version=version+1 WHERE id=? AND version=?").run(name, input.id, input.version).changes !== 1) throw new Error("Account changed or no longer exists; refresh first");
		return this.account(input.id);
	}
	deleteAccount(input) {
		if (this.holdings().some((item) => item.accountId === input.id)) throw new Error("Remove account holdings before deleting the account");
		if (this.database.prepare("DELETE FROM accounts WHERE id=? AND version=?").run(input.id, input.version).changes !== 1) throw new Error("Account changed or no longer exists; refresh first");
	}
	saveFund(fund) {
		parseFund(fund);
		this.database.prepare("INSERT INTO funds VALUES (?,?) ON CONFLICT(code) DO UPDATE SET json=excluded.json").run(fund.code, JSON.stringify(fund));
	}
	fund(code) {
		const row = this.database.prepare("SELECT json FROM funds WHERE code=?").get(code);
		return row ? parseFund(JSON.parse(String(row.json))) : null;
	}
	checkHolding(input) {
		this.account(input.accountId);
		codeSchema.parse(input.fundCode);
		positiveText.parse(input.shares);
		decimalText.parse(input.costPrice);
		const fund = this.fund(input.fundCode);
		if (!fund) throw new Error("Look up and confirm the fund before adding it");
		if (fund.kind === "money" && input.costPrice !== "1" && !/^1\.0+$/.test(input.costPrice)) throw new Error("Ordinary money funds use a unit cost of 1");
	}
	addHolding(input) {
		this.checkHolding(input);
		if (this.database.prepare("SELECT 1 FROM holdings WHERE account_id=? AND fund_code=?").get(input.accountId, input.fundCode)) throw new RemoteError("fund-portfolio/duplicate-holding", "This account already has the fund; edit the existing holding instead", {
			accountId: input.accountId,
			fundCode: input.fundCode
		});
		const holding = {
			...input,
			id: randomUUID(),
			version: 1
		};
		this.database.prepare("INSERT INTO holdings VALUES (?,?,?,?,?,?)").run(holding.id, holding.accountId, holding.fundCode, holding.shares, holding.costPrice, holding.version);
		return holding;
	}
	editHolding(input) {
		this.checkHolding(input);
		if (this.database.prepare("UPDATE holdings SET account_id=?,fund_code=?,shares=?,cost_price=?,version=version+1 WHERE id=? AND version=?").run(input.accountId, input.fundCode, input.shares, input.costPrice, input.id, input.version).changes !== 1) throw new Error("Holding changed or no longer exists; refresh first");
		return this.holding(input.id);
	}
	deleteHolding(input) {
		if (this.database.prepare("DELETE FROM holdings WHERE id=? AND version=?").run(input.id, input.version).changes !== 1) throw new Error("Holding changed or no longer exists; refresh first");
	}
	quote(code) {
		const row = this.database.prepare("SELECT json FROM quotes WHERE code=?").get(code);
		return row ? quoteSchema.parse(JSON.parse(String(row.json))) : {
			code,
			navs: [],
			estimate: null,
			navFetchedAt: null,
			estimateFetchedAt: null,
			error: null
		};
	}
	saveQuote(quote) {
		const parsed = quoteSchema.parse(quote);
		this.transaction(() => {
			this.database.prepare("INSERT INTO quotes VALUES (?,?) ON CONFLICT(code) DO UPDATE SET json=excluded.json").run(quote.code, JSON.stringify(parsed));
			const write = this.database.prepare("INSERT INTO observations VALUES (?,?,?,?) ON CONFLICT(code,date,kind) DO UPDATE SET json=excluded.json");
			for (const nav of quote.navs) write.run(quote.code, nav.date, "nav", JSON.stringify(nav));
			if (quote.estimate) write.run(quote.code, quote.estimate.date, "estimate", JSON.stringify(quote.estimate));
		});
	}
	backup() {
		return {
			format: 1,
			accounts: this.accounts(),
			holdings: this.holdings(),
			funds: this.database.prepare("SELECT json FROM funds ORDER BY code").all().map((row) => parseFund(JSON.parse(String(row.json))))
		};
	}
	readBackup(json) {
		if (Buffer.byteLength(json, "utf8") > 20 * 1024 * 1024) throw new Error("Backup exceeds 20 MiB");
		const backup = backupSchema.parse(JSON.parse(json));
		const unique = (values) => new Set(values).size === values.length;
		if (!unique(backup.accounts.map((item) => item.id)) || !unique(backup.accounts.map((item) => item.name)) || !unique(backup.holdings.map((item) => item.id)) || !unique(backup.funds.map((item) => item.code)) || !unique(backup.holdings.map((item) => `${item.accountId}/${item.fundCode}`))) throw new Error("Duplicate backup records");
		for (const holding of backup.holdings) {
			const fund = backup.funds.find((item) => item.code === holding.fundCode);
			if (!backup.accounts.some((item) => item.id === holding.accountId) || !fund) throw new Error("Backup has missing references");
			if (fund.kind === "money" && !/^1(?:\.0+)?$/.test(holding.costPrice)) throw new Error("Invalid money fund unit cost");
		}
		return backup;
	}
	preview(json) {
		const backup = this.readBackup(json);
		const current = this.backup();
		const conflicts = [...backup.accounts.filter((item) => current.accounts.some((existing) => existing.id === item.id || existing.name === item.name)).map((item) => `account:${item.name}`), ...backup.holdings.filter((item) => current.holdings.some((existing) => existing.id === item.id || existing.accountId === item.accountId && existing.fundCode === item.fundCode)).map((item) => `holding:${item.id}`)];
		return {
			previewToken: createHash("sha256").update(json).update(JSON.stringify(current)).digest("hex"),
			accounts: backup.accounts.length,
			holdings: backup.holdings.length,
			conflicts
		};
	}
	import(input) {
		this.transaction(() => {
			const preview = this.preview(input.json);
			if (preview.previewToken !== input.previewToken) throw new Error("Backup or holdings changed; preview again");
			if (input.mode === "merge" && preview.conflicts.length) throw new Error("Merge has conflicts; use an explicitly confirmed replacement");
			const backup = this.readBackup(input.json);
			const oldAccounts = new Map(this.accounts().map((item) => [item.id, item.version]));
			const oldHoldings = new Map(this.holdings().map((item) => [item.id, item.version]));
			if (input.mode === "replace") this.database.exec("DELETE FROM holdings; DELETE FROM accounts;");
			for (const fund of backup.funds) this.saveFund(fund);
			for (const account of backup.accounts) this.database.prepare("INSERT INTO accounts VALUES (?,?,?)").run(account.id, account.name, Math.max(account.version, oldAccounts.get(account.id) ?? 0) + 1);
			for (const holding of backup.holdings) this.database.prepare("INSERT INTO holdings VALUES (?,?,?,?,?,?)").run(holding.id, holding.accountId, holding.fundCode, holding.shares, holding.costPrice, Math.max(holding.version, oldHoldings.get(holding.id) ?? 0) + 1);
		});
	}
	transaction(operation) {
		this.database.exec("BEGIN IMMEDIATE");
		try {
			const result = operation();
			this.database.exec("COMMIT");
			return result;
		} catch (error) {
			this.database.exec("ROLLBACK");
			throw error;
		}
	}
};
//#endregion
//#region lib/types/host/providers.js
/** Anonymous public-page adapters. Remote scripts are parsed as data, never evaluated. */
const record = z.record(z.string(), z.unknown());
function parseFundResponse(value, code, fetchedAt) {
	const found = z.object({
		ErrCode: z.literal(0),
		Datas: z.array(record)
	}).parse(value).Datas.find((item) => item.CODE === code && item.CATEGORY === 700);
	if (!found) throw new Error("Fund code not found");
	const info = record.parse(found.FundBaseInfo);
	const name = z.string().min(1).parse(found.NAME);
	const type = z.string().parse(info.FUNDTYPE);
	const description = String(info.FTYPE ?? "");
	if (/美元|欧元|港币|港元|英镑|日元|澳元|外币|ETF(?!联接|连接)/i.test(name) || /场内|浮动净值/.test(description)) throw new Error("Only CNY off-exchange funds are supported");
	const money = type === "005";
	if (money && !/普通货币/.test(description)) throw new Error("Unsupported money fund unit convention");
	return {
		code,
		name,
		kind: money ? "money" : /QDII/i.test(name) || type === "007" ? "qdii" : "nav",
		currency: "CNY",
		fetchedAt
	};
}
function parseNavResponse(value, fund, today) {
	const response = z.object({
		ErrCode: z.literal(0),
		Data: z.object({
			LSJZList: z.array(record),
			SYType: z.string().nullable().optional()
		})
	}).parse(value);
	if (response.Data.SYType === "每万份收益" !== (fund.kind === "money")) throw new Error("Fund NAV unit mismatch");
	const rows = response.Data.LSJZList.map((item) => {
		const date = dateString(item.FSRQ);
		if (date > today) throw new Error("Provider returned a future NAV date");
		const valueText = (fund.kind === "money" ? signedDecimalText : positiveText).parse(item.DWJZ);
		const actions = [
			item.FHFCZ,
			item.FHFCZ10,
			item.FHFCBZ,
			item.FHSP
		].filter((value) => value !== null && value !== void 0 && value !== "" && value !== "0");
		return {
			date,
			value: valueText,
			annualYield: fund.kind === "money" ? signedDecimalText.parse(item.LJJZ) : null,
			action: actions.length ? actions.map(String).join("; ") : null,
			publishedRate: item.JZZZL
		};
	}).sort((left, right) => right.date.localeCompare(left.date));
	if (!rows.length || new Set(rows.map((item) => item.date)).size !== rows.length) throw new Error("Empty or duplicate NAV history");
	return rows.map((row, index) => {
		let action = row.action;
		const previous = rows[index + 1];
		if (fund.kind !== "money" && previous && typeof row.publishedRate === "string" && /^-?\d+(\.\d+)?$/.test(row.publishedRate)) {
			if (new Decimal(row.value).div(previous.value).sub(1).mul(100).sub(row.publishedRate).abs().gt("0.03")) action ??= "Published return differs from NAV change";
		}
		return {
			date: row.date,
			value: row.value,
			annualYield: row.annualYield,
			action
		};
	});
}
function parseEstimateResponse(text, code, today) {
	codeSchema.parse(code);
	const match = new RegExp(`^\\s*var hq_str_fu_${code}="([^"\\r\\n]*)";\\s*$`).exec(text);
	if (!match) throw new Error("Invalid estimate response");
	if (!match[1]) return null;
	const fields = match[1].split(",");
	if (fields.length < 8) throw new Error("Incomplete estimate response");
	const date = dateString(fields[7]);
	const time = z.string().regex(/^(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d$/).parse(fields[1]);
	if (date > today) throw new Error("Provider returned a future estimate date");
	return {
		date,
		time,
		value: positiveText.parse(fields[2]),
		referenceValue: positiveText.parse(fields[3]),
		referenceDate: null
	};
}
var PublicFundProvider = class {
	options;
	fetcher;
	now;
	constructor(options) {
		this.options = options;
		this.fetcher = options.fetch ?? fetch;
		this.now = options.now ?? Date.now;
	}
	async request(url, signal, referer) {
		signal.throwIfAborted();
		const response = await this.fetcher(url, {
			signal: AbortSignal.any([signal, AbortSignal.timeout(this.options.timeoutMs)]),
			redirect: "error",
			credentials: "omit",
			headers: referer ? { Referer: referer } : {}
		});
		if (!response.ok) throw new Error(`Market data HTTP ${response.status}`);
		return response;
	}
	async fund(code, signal) {
		codeSchema.parse(code);
		return parseFundResponse(await (await this.request(`https://fundsuggest.eastmoney.com/FundSearch/api/FundSearchAPI.ashx?m=1&key=${code}`, signal)).json(), code, new Date(this.now()).toISOString());
	}
	async nav(fund, signal) {
		codeSchema.parse(fund.code);
		return parseNavResponse(await (await this.request(`https://api.fund.eastmoney.com/f10/lsjz?fundCode=${fund.code}&pageIndex=1&pageSize=10`, signal, "https://fundf10.eastmoney.com/")).json(), fund, todayAt(this.now()));
	}
	async estimate(code, signal) {
		codeSchema.parse(code);
		const response = await this.request(`https://hq.sinajs.cn/list=fu_${code}`, signal, "https://finance.sina.com.cn/");
		return parseEstimateResponse(new TextDecoder("gb18030").decode(await response.arrayBuffer()), code, todayAt(this.now()));
	}
};
//#endregion
//#region lib/types/host/market.js
/** Instance-local deduplication and bounded, cancellable refresh of anonymous market data. */
var Market = class {
	store;
	provider;
	config;
	now;
	controller = new AbortController();
	pending = /* @__PURE__ */ new Map();
	lookups = /* @__PURE__ */ new Map();
	attempts = /* @__PURE__ */ new Map();
	active = 0;
	queue = [];
	constructor(store, provider, config, now = Date.now) {
		this.store = store;
		this.provider = provider;
		this.config = config;
		this.now = now;
	}
	async limited(operation) {
		if (this.active >= this.config.concurrency) await new Promise((resolve) => this.queue.push(resolve));
		else this.active++;
		try {
			this.controller.signal.throwIfAborted();
			return await operation();
		} finally {
			const next = this.queue.shift();
			if (next) next();
			else this.active--;
		}
	}
	async waitForCaller(pending, signal) {
		signal.throwIfAborted();
		let rejectAbort;
		const aborted = new Promise((_resolve, reject) => {
			rejectAbort = reject;
		});
		const onAbort = () => rejectAbort?.(signal.reason);
		signal.addEventListener("abort", onAbort, { once: true });
		try {
			return await Promise.race([pending, aborted]);
		} finally {
			signal.removeEventListener("abort", onAbort);
		}
	}
	async lookup(code, signal) {
		signal.throwIfAborted();
		this.controller.signal.throwIfAborted();
		const cached = this.store.fund(code);
		if (cached && this.now() - Date.parse(cached.fetchedAt) < this.config.fundCacheMs) return cached;
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
		if (lastAttempt !== void 0 && timestamp - lastAttempt < this.config.minRefreshMs) return quote;
		const expired = (value, ttl) => value === null || timestamp - Date.parse(value) >= ttl;
		const fetchNav = force || expired(quote.navFetchedAt, this.config.navCacheMs);
		const fetchEstimate = fund.kind !== "money" && (force || expired(quote.estimateFetchedAt, this.config.estimateCacheMs));
		if (!fetchNav && !fetchEstimate) return quote;
		this.attempts.set(fund.code, timestamp);
		const failures = [];
		const fetchedAt = new Date(timestamp).toISOString();
		if (fetchNav) try {
			const navs = await this.provider.nav(fund, this.controller.signal);
			if (!quote.navs[0] || navs[0].date >= quote.navs[0].date) quote.navs = navs;
			quote.navFetchedAt = fetchedAt;
		} catch (error) {
			failures.push(`NAV: ${error instanceof Error ? error.message : String(error)}`);
		}
		if (fetchEstimate) try {
			const estimate = await this.provider.estimate(fund.code, this.controller.signal);
			if (estimate && (!quote.estimate || `${estimate.date} ${estimate.time}` >= `${quote.estimate.date} ${quote.estimate.time}`)) {
				estimate.referenceDate = quote.navs.find((nav) => nav.date < estimate.date && new Decimal(nav.value).eq(estimate.referenceValue))?.date ?? null;
				quote.estimate = estimate;
			}
			quote.estimateFetchedAt = fetchedAt;
			if (!estimate) failures.push("Estimate unavailable");
		} catch (error) {
			failures.push(`Estimate: ${error instanceof Error ? error.message : String(error)}`);
		}
		this.controller.signal.throwIfAborted();
		quote.error = failures.length ? failures.join("; ") : null;
		this.store.saveQuote(quote);
		return quote;
	}
	async dispose() {
		this.controller.abort();
		await Promise.allSettled([...this.pending.values(), ...this.lookups.values()]);
	}
};
//#endregion
//#region lib/types/host/profit.js
/** Date-aware current-share valuations, not a transaction or settlement ledger. */
const Money = Decimal.clone({ precision: 64 });
function valueHolding(holding, account, fund, quote, today) {
	const shares = new Money(holding.shares);
	const cost = shares.mul(holding.costPrice);
	const nav = quote.navs[0];
	const previous = quote.navs[1];
	const estimate = quote.estimate;
	const result = {
		holding,
		accountName: account.name,
		fund,
		quote,
		cost: cost.toFixed(),
		marketValue: null,
		priceKind: null,
		priceDate: null,
		floatingProfit: null,
		floatingRate: null,
		confirmed: null,
		estimated: null,
		today: null,
		referenceChange: null,
		issue: "pending"
	};
	if (fund.kind === "money") {
		result.marketValue = shares.toFixed();
		result.priceKind = "money";
		if (nav) {
			result.confirmed = {
				amount: shares.div(1e4).mul(nav.value).toFixed(),
				date: nav.date,
				basisDate: null,
				kind: "confirmed"
			};
			result.priceDate = nav.date;
			if (nav.action) {
				result.confirmed = null;
				result.issue = "review";
			}
		}
	} else {
		const action = Boolean(nav?.action);
		if (nav && previous && !action) result.confirmed = {
			amount: shares.mul(new Money(nav.value).sub(previous.value)).toFixed(),
			date: nav.date,
			basisDate: previous.date,
			kind: "confirmed"
		};
		if (estimate && nav) {
			const referenceMatches = new Money(estimate.referenceValue).eq(nav.value);
			const referenceDateMatches = estimate.referenceDate === nav.date;
			const oneCalendarDay = priorCalendarDate(estimate.date) === nav.date;
			const mondayAfterFriday = (/* @__PURE__ */ new Date(`${estimate.date}T00:00:00Z`)).getUTCDay() === 1 && Date.parse(`${estimate.date}T00:00:00Z`) - Date.parse(`${nav.date}T00:00:00Z`) === 3 * 864e5;
			const weekday = (/* @__PURE__ */ new Date(`${estimate.date}T00:00:00Z`)).getUTCDay();
			const validInterval = fund.kind === "nav" && (oneCalendarDay || mondayAfterFriday) && weekday > 0 && weekday < 6;
			result.referenceChange = shares.mul(new Money(estimate.value).sub(estimate.referenceValue)).toFixed();
			if (referenceMatches && referenceDateMatches && validInterval && !action) result.estimated = {
				amount: shares.mul(new Money(estimate.value).sub(estimate.referenceValue)).toFixed(),
				date: estimate.date,
				basisDate: nav.date,
				kind: "estimated"
			};
			else if (estimate.date === today && nav.date !== today) result.issue = "baseline";
		}
		const useEstimate = estimate !== null && estimate.date === today && (!nav || nav.date < estimate.date);
		const price = useEstimate ? estimate.value : nav?.value;
		if (price !== void 0) {
			const market = shares.mul(price);
			result.marketValue = market.toFixed();
			result.floatingProfit = market.sub(cost).toFixed();
			result.floatingRate = cost.isZero() ? null : market.sub(cost).div(cost).mul(100).toFixed();
			result.priceKind = useEstimate ? "estimate" : "nav";
			result.priceDate = useEstimate ? estimate.date : nav.date;
		}
		if (action) result.issue = "review";
	}
	if (result.confirmed?.date === today) result.today = result.confirmed;
	else if (result.estimated?.date === today) result.today = result.estimated;
	if (result.today) result.issue = null;
	if (!nav && !estimate) result.issue = "unavailable";
	return result;
}
function summarize(date, accounts, holdings, refreshIntervalMs) {
	const sum = (values) => {
		const present = values.filter((value) => value !== null);
		return present.length ? present.reduce((total, value) => total.add(value), new Money(0)).toFixed() : null;
	};
	const incomes = holdings.map((row) => row.today).filter((income) => income !== null);
	const confirmed = incomes.filter((income) => income.kind === "confirmed");
	const estimated = incomes.filter((income) => income.kind === "estimated");
	return {
		date,
		accounts,
		holdings,
		refreshIntervalMs,
		cost: sum(holdings.map((row) => row.cost)) ?? "0",
		marketValue: sum(holdings.map((row) => row.marketValue)),
		marketCovered: holdings.filter((row) => row.marketValue !== null).length,
		floatingProfit: sum(holdings.map((row) => row.floatingProfit)),
		floatingCovered: holdings.filter((row) => row.floatingProfit !== null).length,
		confirmedToday: sum(confirmed.map((income) => income.amount)),
		estimatedToday: sum(estimated.map((income) => income.amount)),
		todayTotal: sum(incomes.map((income) => income.amount)),
		confirmedCount: confirmed.length,
		estimatedCount: estimated.length,
		missingCount: holdings.length - incomes.length
	};
}
//#endregion
//#region lib/types/host/errors.js
/** Stable Remote failures for user-correctable portfolio requests and public-data outages. */
async function remoteOperation(operation, signal, execute, unavailable = false) {
	try {
		signal.throwIfAborted();
		const result = await execute();
		signal.throwIfAborted();
		return result;
	} catch (error) {
		if (remoteErrorOf(error)) throw error;
		if (signal.aborted || error instanceof Error && error.name === "AbortError") throw new RemoteError("gateway/cancelled", `${operation} was cancelled`, {}, { cause: error });
		const message = error instanceof Error ? error.message : String(error);
		throw new RemoteError(unavailable ? "fund-portfolio/unavailable" : "fund-portfolio/rejected", message, { operation }, { cause: error });
	}
}
//#endregion
//#region lib/types/index.js
var __runInitializers = function(thisArg, initializers, value) {
	var useValue = arguments.length > 2;
	for (var i = 0; i < initializers.length; i++) value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
	return useValue ? value : void 0;
};
var __esDecorate = function(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
	function accept(f) {
		if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected");
		return f;
	}
	var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
	var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
	var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
	var _, done = false;
	for (var i = decorators.length - 1; i >= 0; i--) {
		var context = {};
		for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
		for (var p in contextIn.access) context.access[p] = contextIn.access[p];
		context.addInitializer = function(f) {
			if (done) throw new TypeError("Cannot add initializers after decoration has completed");
			extraInitializers.push(accept(f || null));
		};
		var result = (0, decorators[i])(kind === "accessor" ? {
			get: descriptor.get,
			set: descriptor.set
		} : descriptor[key], context);
		if (kind === "accessor") {
			if (result === void 0) continue;
			if (result === null || typeof result !== "object") throw new TypeError("Object expected");
			if (_ = accept(result.get)) descriptor.get = _;
			if (_ = accept(result.set)) descriptor.set = _;
			if (_ = accept(result.init)) initializers.unshift(_);
		} else if (_ = accept(result)) if (kind === "field") initializers.unshift(_);
		else descriptor[key] = _;
	}
	if (target) Object.defineProperty(target, contextIn.name, descriptor);
	done = true;
};
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
			__esDecorate(this, null, _accountList_decorators, {
				kind: "method",
				name: "accountList",
				static: false,
				private: false,
				access: {
					has: (obj) => "accountList" in obj,
					get: (obj) => obj.accountList
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _accountCreate_decorators, {
				kind: "method",
				name: "accountCreate",
				static: false,
				private: false,
				access: {
					has: (obj) => "accountCreate" in obj,
					get: (obj) => obj.accountCreate
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _accountUpdate_decorators, {
				kind: "method",
				name: "accountUpdate",
				static: false,
				private: false,
				access: {
					has: (obj) => "accountUpdate" in obj,
					get: (obj) => obj.accountUpdate
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _accountDelete_decorators, {
				kind: "method",
				name: "accountDelete",
				static: false,
				private: false,
				access: {
					has: (obj) => "accountDelete" in obj,
					get: (obj) => obj.accountDelete
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _lookup_decorators, {
				kind: "method",
				name: "lookup",
				static: false,
				private: false,
				access: {
					has: (obj) => "lookup" in obj,
					get: (obj) => obj.lookup
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _holdingList_decorators, {
				kind: "method",
				name: "holdingList",
				static: false,
				private: false,
				access: {
					has: (obj) => "holdingList" in obj,
					get: (obj) => obj.holdingList
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _holdingAdd_decorators, {
				kind: "method",
				name: "holdingAdd",
				static: false,
				private: false,
				access: {
					has: (obj) => "holdingAdd" in obj,
					get: (obj) => obj.holdingAdd
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _holdingUpdate_decorators, {
				kind: "method",
				name: "holdingUpdate",
				static: false,
				private: false,
				access: {
					has: (obj) => "holdingUpdate" in obj,
					get: (obj) => obj.holdingUpdate
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _holdingDelete_decorators, {
				kind: "method",
				name: "holdingDelete",
				static: false,
				private: false,
				access: {
					has: (obj) => "holdingDelete" in obj,
					get: (obj) => obj.holdingDelete
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _summary_decorators, {
				kind: "method",
				name: "summary",
				static: false,
				private: false,
				access: {
					has: (obj) => "summary" in obj,
					get: (obj) => obj.summary
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _exportData_decorators, {
				kind: "method",
				name: "exportData",
				static: false,
				private: false,
				access: {
					has: (obj) => "exportData" in obj,
					get: (obj) => obj.exportData
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _previewImport_decorators, {
				kind: "method",
				name: "previewImport",
				static: false,
				private: false,
				access: {
					has: (obj) => "previewImport" in obj,
					get: (obj) => obj.previewImport
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _importData_decorators, {
				kind: "method",
				name: "importData",
				static: false,
				private: false,
				access: {
					has: (obj) => "importData" in obj,
					get: (obj) => obj.importData
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			if (_metadata) Object.defineProperty(this, Symbol.metadata, {
				enumerable: true,
				configurable: true,
				writable: true,
				value: _metadata
			});
		}
		config = __runInitializers(this, _instanceExtraInitializers);
		static Config = Schema.object({
			databasePath: Schema.string().required(),
			busyTimeoutMs: Schema.number().min(1).step(1).default(5e3),
			refreshIntervalMs: Schema.number().min(1e4).step(1).default(6e4),
			estimateCacheMs: Schema.number().min(1e3).step(1).default(6e4),
			navCacheMs: Schema.number().min(1e3).step(1).default(3e5),
			fundCacheMs: Schema.number().min(1e3).step(1).default(864e5),
			minRefreshMs: Schema.number().min(1e3).step(1).default(1e4),
			timeoutMs: Schema.number().min(1).step(1).default(1e4),
			concurrency: Schema.number().min(1).max(16).step(1).default(4)
		});
		store;
		market;
		constructor(ctx, config) {
			super(ctx, "fundPortfolio");
			this.config = config;
			this.store = new PortfolioStore(config.databasePath, config.busyTimeoutMs);
			this.market = new Market(this.store, new PublicFundProvider({ timeoutMs: config.timeoutMs }), config);
			ctx.effect(() => async () => {
				await this.market.dispose();
				this.store.close();
			}, "fund-portfolio: close market and store");
		}
		/** List all accounts. @param _request Empty request. @param signal Cancellation. @returns Current accounts. */
		async accountList(_request, signal) {
			return remoteOperation("account.list", signal, () => this.store.accounts());
		}
		/** Create an account. @param request Account name. @param signal Cancellation. @returns Persisted account. */
		async accountCreate(request, signal) {
			return remoteOperation("account.create", signal, () => this.store.createAccount(request.name));
		}
		/** Rename with optimistic concurrency. @param request Expected version and name. @param signal Cancellation. @returns Updated account. */
		async accountUpdate(request, signal) {
			return remoteOperation("account.update", signal, () => this.store.editAccount(request));
		}
		/** Delete an empty account. @param request Expected account version. @param signal Cancellation. @returns Successful deletion. */
		async accountDelete(request, signal) {
			return remoteOperation("account.delete", signal, () => {
				this.store.deleteAccount(request);
				return { ok: true };
			});
		}
		/** Verify a fund code with the public provider. @param request Six-digit fund code. @param signal Cancellation. @returns Verified metadata. */
		async lookup(request, signal) {
			return remoteOperation("fund.lookup", signal, () => this.market.lookup(request.code, signal), true);
		}
		/** List current holdings without refreshing market data. @param _request Empty request. @param signal Cancellation. @returns Holdings and record versions. */
		async holdingList(_request, signal) {
			return remoteOperation("holding.list", signal, () => this.store.holdings());
		}
		/** Add a previously verified fund. @param request Account, fund and decimal values. @param signal Cancellation. @returns Persisted holding. */
		async holdingAdd(request, signal) {
			return remoteOperation("holding.add", signal, () => this.store.addHolding(request));
		}
		/** Edit with optimistic concurrency. @param request Expected version and replacement values. @param signal Cancellation. @returns Updated holding. */
		async holdingUpdate(request, signal) {
			return remoteOperation("holding.update", signal, () => this.store.editHolding(request));
		}
		/** Delete a holding. @param request Expected holding version. @param signal Cancellation. @returns Successful deletion. */
		async holdingDelete(request, signal) {
			return remoteOperation("holding.delete", signal, () => {
				this.store.deleteHolding(request);
				return { ok: true };
			});
		}
		/** Calculate current-share returns, optionally refreshing quotes. @param request Account filter and refresh policy. @param signal Cancellation. @returns Dated results including coverage and missing values. */
		async summary(request, signal) {
			return remoteOperation("portfolio.summary", signal, async () => {
				if (request.accountId) this.store.account(request.accountId);
				const before = this.store.holdings().filter((item) => !request.accountId || item.accountId === request.accountId);
				if (request.refresh !== false) {
					const funds = [...new Set(before.map((item) => item.fundCode))].map((code) => this.store.fund(code)).filter((fund) => fund !== null);
					await Promise.all(funds.map((fund) => this.market.refresh(fund, request.force === true, signal)));
				}
				const accounts = this.store.accounts();
				const holdings = this.store.holdings().filter((item) => !request.accountId || item.accountId === request.accountId);
				const date = todayAt(Date.now());
				return summarize(date, accounts, holdings.map((holding) => {
					const fund = this.store.fund(holding.fundCode);
					if (!fund) throw new Error(`Missing metadata for ${holding.fundCode}`);
					return valueHolding(holding, this.store.account(holding.accountId), fund, this.store.quote(holding.fundCode), date);
				}), this.config.refreshIntervalMs);
			});
		}
		/** Export private portfolio data, without market caches. @param _request Empty request. @param signal Cancellation. @returns JSON backup and suggested filename. */
		async exportData(_request, signal) {
			return remoteOperation("portfolio.export", signal, () => ({
				filename: `fund-portfolio-${todayAt(Date.now())}.json`,
				json: JSON.stringify(this.store.backup(), null, 2)
			}));
		}
		/** Preview an import without mutation. @param request Backup JSON. @param signal Cancellation. @returns Conflict list and state-bound token. */
		async previewImport(request, signal) {
			return remoteOperation("portfolio.import-preview", signal, () => this.store.preview(request.json));
		}
		/** Apply an explicitly confirmed preview in one transaction. @param request Backup, mode and preview token. @param signal Cancellation. @returns Successful import. */
		async importData(request, signal) {
			return remoteOperation("portfolio.import", signal, () => {
				this.store.import(request);
				return { ok: true };
			});
		}
	};
})();
//#endregion
export { FundPortfolioService, FundPortfolioService as default };
