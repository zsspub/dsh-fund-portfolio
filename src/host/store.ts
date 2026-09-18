/** SQLite owns current holdings and dated market observations; no transaction ledger is inferred. */
import { DatabaseSync } from 'node:sqlite'
import { mkdirSync, chmodSync } from 'node:fs'
import { dirname, isAbsolute } from 'node:path'
import { createHash, randomUUID } from 'node:crypto'
import { RemoteError } from '@deepseek-ai/dsh-typert-protocol'
import type {
  Account, AccountEdit, AccountId, AccountRef, AllocationUpdateInput, BackupV2, Fund, Holding,
  HoldingEdit, HoldingId, HoldingInput, HoldingRef, ImportCommit, ImportPreview, Quote,
} from '../types.ts'
import {
  codeSchema, decimalText, nameSchema, parseAccount, parseBackup, parseFund, parseHolding,
  positiveText, signedDecimalText, targetRatioText,
} from './validation.ts'
import { z } from 'zod'
import { Decimal } from 'decimal.js'

const navSchema = z.object({ date: z.iso.date(), value: signedDecimalText, annualYield: signedDecimalText.nullable(), action: z.string().nullable() })
const quoteSchema = z.object({
  code: codeSchema, navs: z.array(navSchema),
  estimate: z.object({
    date: z.iso.date(), time: z.string(), value: positiveText, referenceValue: positiveText, referenceDate: z.iso.date().nullable(),
  }).nullable(),
  navFetchedAt: z.iso.datetime().nullable(), estimateFetchedAt: z.iso.datetime().nullable(), error: z.string().nullable(),
})

export class PortfolioStore {
  private readonly database: DatabaseSync

  constructor(path: string, busyTimeoutMs: number) {
    if (!isAbsolute(path)) throw new Error('databasePath must be absolute')
    mkdirSync(dirname(path), { recursive: true, mode: 0o700 })
    this.database = new DatabaseSync(path)
    try {
      if (process.platform !== 'win32') chmodSync(path, 0o600)
      this.database.exec(`PRAGMA busy_timeout=${Math.trunc(busyTimeoutMs)}; PRAGMA foreign_keys=ON;`)
      const version = Number(this.database.prepare('PRAGMA user_version').get()!.user_version)
      if (version > 2) throw new Error('Database schema is newer than this plugin')
      this.database.exec('PRAGMA journal_mode=WAL')
      if (version === 0) this.database.exec(`
        BEGIN IMMEDIATE;
        CREATE TABLE accounts (id TEXT PRIMARY KEY, name TEXT NOT NULL UNIQUE, version INTEGER NOT NULL);
        CREATE TABLE funds (code TEXT PRIMARY KEY, json TEXT NOT NULL);
        CREATE TABLE holdings (
          id TEXT PRIMARY KEY, account_id TEXT NOT NULL REFERENCES accounts(id),
          fund_code TEXT NOT NULL REFERENCES funds(code), shares TEXT NOT NULL, cost_price TEXT NOT NULL,
          target_ratio TEXT, version INTEGER NOT NULL, UNIQUE(account_id, fund_code)
        );
        CREATE TABLE quotes (code TEXT PRIMARY KEY, json TEXT NOT NULL);
        CREATE TABLE observations (code TEXT NOT NULL, date TEXT NOT NULL, kind TEXT NOT NULL, json TEXT NOT NULL, PRIMARY KEY(code,date,kind));
        PRAGMA user_version=2;
        COMMIT;
      `)
      if (version === 1) this.database.exec(`
        BEGIN IMMEDIATE;
        ALTER TABLE holdings ADD COLUMN target_ratio TEXT;
        PRAGMA user_version=2;
        COMMIT;
      `)
    } catch (error) {
      this.database.close()
      throw error
    }
  }

  close(): void { this.database.close() }

  accounts(): Account[] {
    return this.database.prepare('SELECT * FROM accounts ORDER BY name,id').all().map(parseAccount)
  }

  holdings(): Holding[] {
    return this.database.prepare(`
      SELECT id,account_id AS accountId,fund_code AS fundCode,shares,cost_price AS costPrice,
        target_ratio AS targetRatio,version
      FROM holdings ORDER BY account_id,fund_code
    `).all().map(parseHolding)
  }

  account(id: AccountId): Account {
    const found = this.accounts().find(item => item.id === id)
    if (!found) throw new Error('Account not found')
    return found
  }

  holding(id: HoldingId): Holding {
    const found = this.holdings().find(item => item.id === id)
    if (!found) throw new Error('Holding not found')
    return found
  }

  createAccount(name: string): Account {
    const account = { id: randomUUID() as AccountId, name: nameSchema.parse(name), version: 1 }
    this.database.prepare('INSERT INTO accounts VALUES (?,?,?)').run(account.id, account.name, account.version)
    return account
  }

  editAccount(input: AccountEdit): Account {
    const name = nameSchema.parse(input.name)
    const result = this.database.prepare('UPDATE accounts SET name=?,version=version+1 WHERE id=? AND version=?').run(name, input.id, input.version)
    if (result.changes !== 1) throw new Error('Account changed or no longer exists; refresh first')
    return this.account(input.id)
  }

  deleteAccount(input: AccountRef): void {
    if (this.holdings().some(item => item.accountId === input.id)) throw new Error('Remove account holdings before deleting the account')
    const result = this.database.prepare('DELETE FROM accounts WHERE id=? AND version=?').run(input.id, input.version)
    if (result.changes !== 1) throw new Error('Account changed or no longer exists; refresh first')
  }

  saveFund(fund: Fund): void {
    parseFund(fund)
    this.database.prepare('INSERT INTO funds VALUES (?,?) ON CONFLICT(code) DO UPDATE SET json=excluded.json').run(fund.code, JSON.stringify(fund))
  }

  fund(code: string): Fund | null {
    const row = this.database.prepare('SELECT json FROM funds WHERE code=?').get(code)
    return row ? parseFund(JSON.parse(String(row.json))) : null
  }

  private checkHolding(input: HoldingInput): void {
    this.account(input.accountId)
    codeSchema.parse(input.fundCode)
    positiveText.parse(input.shares)
    decimalText.parse(input.costPrice)
    const fund = this.fund(input.fundCode)
    if (!fund) throw new Error('Look up and confirm the fund before adding it')
    if (fund.kind === 'money' && input.costPrice !== '1' && !/^1\.0+$/.test(input.costPrice)) {
      throw new Error('Ordinary money funds use a unit cost of 1')
    }
  }

  addHolding(input: HoldingInput): Holding {
    this.checkHolding(input)
    const duplicate = this.database.prepare('SELECT 1 FROM holdings WHERE account_id=? AND fund_code=?')
      .get(input.accountId, input.fundCode)
    if (duplicate) {
      throw new RemoteError(
        'fund-portfolio/duplicate-holding',
        'This account already has the fund; edit the existing holding instead',
        { accountId: input.accountId, fundCode: input.fundCode },
      )
    }
    const holding = { ...input, id: randomUUID() as HoldingId, targetRatio: null, version: 1 }
    this.database.prepare(`
      INSERT INTO holdings (id,account_id,fund_code,shares,cost_price,target_ratio,version)
      VALUES (?,?,?,?,?,?,?)
    `)
      .run(holding.id, holding.accountId, holding.fundCode, holding.shares, holding.costPrice, holding.targetRatio, holding.version)
    return holding
  }

  editHolding(input: HoldingEdit): Holding {
    this.checkHolding(input)
    const previous = this.holding(input.id)
    const targetRatio = previous.accountId === input.accountId && previous.fundCode === input.fundCode
      ? previous.targetRatio : null
    const result = this.database.prepare(`
      UPDATE holdings SET account_id=?,fund_code=?,shares=?,cost_price=?,target_ratio=?,version=version+1
      WHERE id=? AND version=?
    `).run(input.accountId, input.fundCode, input.shares, input.costPrice, targetRatio, input.id, input.version)
    if (result.changes !== 1) throw new Error('Holding changed or no longer exists; refresh first')
    return this.holding(input.id)
  }

  deleteHolding(input: HoldingRef): void {
    const result = this.database.prepare('DELETE FROM holdings WHERE id=? AND version=?').run(input.id, input.version)
    if (result.changes !== 1) throw new Error('Holding changed or no longer exists; refresh first')
  }

  updateAllocation(input: AllocationUpdateInput): Holding[] {
    this.account(input.accountId)
    const current = this.holdings().filter(holding => holding.accountId === input.accountId)
    if (current.length === 0 || input.allocations.length !== current.length) {
      throw new Error('Allocation must include every holding in the account')
    }
    const currentIds = new Set(current.map(holding => holding.id))
    const inputIds = new Set(input.allocations.map(allocation => allocation.id))
    if (inputIds.size !== input.allocations.length
      || input.allocations.some(allocation => !currentIds.has(allocation.id))) {
      throw new Error('Allocation holdings do not match the account')
    }
    const total = input.allocations.reduce(
      (sum, allocation) => sum.add(targetRatioText.parse(allocation.targetRatio)),
      new Decimal(0),
    )
    if (!total.eq(100)) throw new Error('Target allocation must total exactly 100%')
    return this.transaction(() => {
      const update = this.database.prepare(`
        UPDATE holdings SET target_ratio=?,version=version+1
        WHERE id=? AND account_id=? AND version=?
      `)
      for (const allocation of input.allocations) {
        const result = update.run(allocation.targetRatio, allocation.id, input.accountId, allocation.version)
        if (result.changes !== 1) throw new Error('Holding changed or no longer exists; refresh first')
      }
      return this.holdings().filter(holding => holding.accountId === input.accountId)
    })
  }

  quote(code: string): Quote {
    const row = this.database.prepare('SELECT json FROM quotes WHERE code=?').get(code)
    return row ? quoteSchema.parse(JSON.parse(String(row.json))) : {
      code, navs: [], estimate: null, navFetchedAt: null, estimateFetchedAt: null, error: null,
    }
  }

  saveQuote(quote: Quote): void {
    const parsed = quoteSchema.parse(quote)
    this.transaction(() => {
      this.database.prepare('INSERT INTO quotes VALUES (?,?) ON CONFLICT(code) DO UPDATE SET json=excluded.json').run(quote.code, JSON.stringify(parsed))
      const write = this.database.prepare('INSERT INTO observations VALUES (?,?,?,?) ON CONFLICT(code,date,kind) DO UPDATE SET json=excluded.json')
      for (const nav of quote.navs) write.run(quote.code, nav.date, 'nav', JSON.stringify(nav))
      if (quote.estimate) write.run(quote.code, quote.estimate.date, 'estimate', JSON.stringify(quote.estimate))
    })
  }

  backup(): BackupV2 {
    return {
      format: 2, accounts: this.accounts(), holdings: this.holdings(),
      funds: this.database.prepare('SELECT json FROM funds ORDER BY code').all().map(row => parseFund(JSON.parse(String(row.json)))),
    }
  }

  private readBackup(json: string): BackupV2 {
    if (Buffer.byteLength(json, 'utf8') > 20 * 1024 * 1024) throw new Error('Backup exceeds 20 MiB')
    const backup = parseBackup(JSON.parse(json))
    const unique = (values: string[]): boolean => new Set(values).size === values.length
    if (!unique(backup.accounts.map(item => item.id)) || !unique(backup.accounts.map(item => item.name))
      || !unique(backup.holdings.map(item => item.id)) || !unique(backup.funds.map(item => item.code))
      || !unique(backup.holdings.map(item => `${item.accountId}/${item.fundCode}`))) throw new Error('Duplicate backup records')
    for (const holding of backup.holdings) {
      const fund = backup.funds.find(item => item.code === holding.fundCode)
      if (!backup.accounts.some(item => item.id === holding.accountId) || !fund) throw new Error('Backup has missing references')
      if (fund.kind === 'money' && !/^1(?:\.0+)?$/.test(holding.costPrice)) throw new Error('Invalid money fund unit cost')
    }
    return backup
  }

  preview(json: string): ImportPreview {
    const backup = this.readBackup(json)
    const current = this.backup()
    const conflicts = [
      ...backup.accounts.filter(item => current.accounts.some(existing => existing.id === item.id || existing.name === item.name)).map(item => `account:${item.name}`),
      ...backup.holdings.filter(item => current.holdings.some(existing => existing.id === item.id || (existing.accountId === item.accountId && existing.fundCode === item.fundCode))).map(item => `holding:${item.id}`),
    ]
    const previewToken = createHash('sha256').update(json).update(JSON.stringify(current)).digest('hex')
    return { previewToken, accounts: backup.accounts.length, holdings: backup.holdings.length, conflicts }
  }

  import(input: ImportCommit): void {
    this.transaction(() => {
      const preview = this.preview(input.json)
      if (preview.previewToken !== input.previewToken) throw new Error('Backup or holdings changed; preview again')
      if (input.mode === 'merge' && preview.conflicts.length) throw new Error('Merge has conflicts; use an explicitly confirmed replacement')
      const backup = this.readBackup(input.json)
      const oldAccounts = new Map(this.accounts().map(item => [item.id, item.version]))
      const oldHoldings = new Map(this.holdings().map(item => [item.id, item.version]))
      if (input.mode === 'replace') this.database.exec('DELETE FROM holdings; DELETE FROM accounts;')
      for (const fund of backup.funds) this.saveFund(fund)
      for (const account of backup.accounts) this.database.prepare('INSERT INTO accounts VALUES (?,?,?)')
        .run(account.id, account.name, Math.max(account.version, oldAccounts.get(account.id) ?? 0) + 1)
      for (const holding of backup.holdings) this.database.prepare(`
        INSERT INTO holdings (id,account_id,fund_code,shares,cost_price,target_ratio,version)
        VALUES (?,?,?,?,?,?,?)
      `)
        .run(
          holding.id, holding.accountId, holding.fundCode, holding.shares, holding.costPrice,
          holding.targetRatio, Math.max(holding.version, oldHoldings.get(holding.id) ?? 0) + 1,
        )
    })
  }

  private transaction<Result>(operation: () => Result): Result {
    this.database.exec('BEGIN IMMEDIATE')
    try {
      const result = operation()
      this.database.exec('COMMIT')
      return result
    } catch (error) {
      this.database.exec('ROLLBACK')
      throw error
    }
  }
}
