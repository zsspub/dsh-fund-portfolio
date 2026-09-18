import { afterEach, describe, expect, it } from 'vitest'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { DatabaseSync } from 'node:sqlite'
import { PortfolioStore } from '../src/host/store.ts'
import { fund, quote } from './fixtures.ts'

const cleanups: (() => void)[] = []
afterEach(() => { while (cleanups.length) cleanups.pop()!() })
function open() {
  const root = mkdtempSync(join(tmpdir(), 'fund-store-'))
  cleanups.push(() => rmSync(root, { recursive: true, force: true }))
  const path = join(root, 'portfolio.sqlite3')
  const store = new PortfolioStore(path, 1000)
  cleanups.push(() => store.close())
  return { store, path }
}

describe('portfolio store', () => {
  it('allows the same fund across accounts and rejects duplicate account holdings', () => {
    const { store } = open()
    store.saveFund(fund)
    const first = store.createAccount('First')
    const second = store.createAccount('Second')
    const input = { accountId: first.id, fundCode: fund.code, shares: '1000', costPrice: '1.2' }
    store.addHolding(input)
    expect(() => store.addHolding(input)).toThrow(expect.objectContaining({
      code: 'fund-portfolio/duplicate-holding',
      details: { accountId: first.id, fundCode: fund.code },
    }))
    store.addHolding({ ...input, accountId: second.id })
    expect(store.holdings()).toHaveLength(2)
    expect(() => store.deleteAccount(first)).toThrow(/holdings/)
  })

  it('rejects stale edits and invalid decimal inputs', () => {
    const { store } = open()
    store.saveFund(fund)
    const account = store.createAccount('Main')
    const holding = store.addHolding({ accountId: account.id, fundCode: fund.code, shares: '10', costPrice: '0' })
    expect(store.editHolding({ ...holding, shares: '20' }).version).toBe(2)
    expect(() => store.editHolding(holding)).toThrow(/changed/)
    expect(() => store.deleteHolding(holding)).toThrow(/changed/)
    for (const shares of ['0', '-1', 'NaN', 'Infinity', '1e3', '0.0000000000001']) {
      expect(() => store.addHolding({ ...holding, shares })).toThrow()
    }
  })

  it('requires verified metadata and fixed money-fund cost', () => {
    const { store } = open()
    const account = store.createAccount('Main')
    const input = { accountId: account.id, fundCode: fund.code, shares: '100', costPrice: '1.2' }
    expect(() => store.addHolding(input)).toThrow(/Look up/)
    store.saveFund({ ...fund, kind: 'money' })
    expect(() => store.addHolding(input)).toThrow(/unit cost/)
    expect(store.addHolding({ ...input, costPrice: '1.0000' }).shares).toBe('100')
  })

  it('survives reopening and retains dated quote observations', () => {
    const { store, path } = open()
    store.saveFund(fund)
    const account = store.createAccount('Main')
    store.addHolding({ accountId: account.id, fundCode: fund.code, shares: '10', costPrice: '1' })
    store.saveQuote(quote())
    const reader = new PortfolioStore(path, 1000)
    cleanups.push(() => reader.close())
    expect(reader.holdings()).toEqual(store.holdings())
    expect(reader.quote(fund.code)).toEqual(quote())
  })

  it('migrates schema v1 holdings with empty target allocations', () => {
    const root = mkdtempSync(join(tmpdir(), 'fund-v1-'))
    cleanups.push(() => rmSync(root, { recursive: true, force: true }))
    const path = join(root, 'portfolio.sqlite3')
    const database = new DatabaseSync(path)
    database.exec(`
      PRAGMA foreign_keys=ON;
      CREATE TABLE accounts (id TEXT PRIMARY KEY, name TEXT NOT NULL UNIQUE, version INTEGER NOT NULL);
      CREATE TABLE funds (code TEXT PRIMARY KEY, json TEXT NOT NULL);
      CREATE TABLE holdings (
        id TEXT PRIMARY KEY, account_id TEXT NOT NULL REFERENCES accounts(id),
        fund_code TEXT NOT NULL REFERENCES funds(code), shares TEXT NOT NULL, cost_price TEXT NOT NULL,
        version INTEGER NOT NULL, UNIQUE(account_id, fund_code)
      );
      CREATE TABLE quotes (code TEXT PRIMARY KEY, json TEXT NOT NULL);
      CREATE TABLE observations (code TEXT NOT NULL, date TEXT NOT NULL, kind TEXT NOT NULL, json TEXT NOT NULL, PRIMARY KEY(code,date,kind));
      INSERT INTO accounts VALUES ('11111111-1111-4111-8111-111111111111','Main',1);
      INSERT INTO funds VALUES ('005827','${JSON.stringify(fund).replaceAll("'", "''")}');
      INSERT INTO holdings VALUES ('22222222-2222-4222-8222-222222222222','11111111-1111-4111-8111-111111111111','005827','10','1',1);
      PRAGMA user_version=1;
    `)
    database.close()
    const store = new PortfolioStore(path, 1000)
    cleanups.push(() => store.close())
    expect(store.holdings()[0]?.targetRatio).toBeNull()
    const check = new DatabaseSync(path)
    expect(check.prepare('PRAGMA user_version').get()!.user_version).toBe(2)
    check.close()
  })

  it('updates a complete account allocation atomically and preserves it on ordinary edits', () => {
    const { store } = open()
    const secondFund = { ...fund, code: '005828', name: 'Second fund' }
    store.saveFund(fund)
    store.saveFund(secondFund)
    const account = store.createAccount('Main')
    const first = store.addHolding({ accountId: account.id, fundCode: fund.code, shares: '10', costPrice: '1' })
    const second = store.addHolding({ accountId: account.id, fundCode: secondFund.code, shares: '20', costPrice: '1' })
    const updated = store.updateAllocation({
      accountId: account.id,
      allocations: [
        { id: first.id, version: first.version, targetRatio: '60.00' },
        { id: second.id, version: second.version, targetRatio: '40' },
      ],
    })
    expect(updated.map(item => item.targetRatio)).toEqual(['60.00', '40'])
    const edited = store.editHolding({ ...updated[0]!, shares: '12' })
    expect(edited.targetRatio).toBe('60.00')
    expect(() => store.updateAllocation({
      accountId: account.id,
      allocations: [
        { id: edited.id, version: edited.version, targetRatio: '50' },
        { id: updated[1]!.id, version: second.version, targetRatio: '50' },
      ],
    })).toThrow(/changed/)
    expect(store.holdings().map(item => item.targetRatio)).toEqual(['60.00', '40'])
  })

  it('rejects incomplete, imprecise and non-100 target allocations', () => {
    const { store } = open()
    store.saveFund(fund)
    const account = store.createAccount('Main')
    const holding = store.addHolding({ accountId: account.id, fundCode: fund.code, shares: '10', costPrice: '1' })
    for (const targetRatio of ['99.99', '100.001', '-1', '101']) {
      expect(() => store.updateAllocation({
        accountId: account.id,
        allocations: [{ id: holding.id, version: holding.version, targetRatio }],
      })).toThrow()
    }
    expect(store.holding(holding.id).targetRatio).toBeNull()
  })

  it('round-trips backups and refuses conflicts without replacement', () => {
    const { store } = open()
    store.saveFund(fund)
    const account = store.createAccount('Main')
    const holding = store.addHolding({ accountId: account.id, fundCode: fund.code, shares: '10', costPrice: '1' })
    store.updateAllocation({
      accountId: account.id,
      allocations: [{ id: holding.id, version: holding.version, targetRatio: '100' }],
    })
    const json = JSON.stringify(store.backup())
    expect(JSON.parse(json).format).toBe(2)
    const other = open().store
    const preview = other.preview(json)
    expect(preview.conflicts).toEqual([])
    other.import({ json, previewToken: preview.previewToken, mode: 'merge' })
    expect(other.holdings()[0]?.shares).toBe('10')
    expect(other.holdings()[0]?.targetRatio).toBe('100')
    const conflict = other.preview(json)
    expect(conflict.conflicts).toHaveLength(2)
    expect(() => other.import({ json, previewToken: conflict.previewToken, mode: 'merge' })).toThrow(/conflicts/)
    const old = other.holdings()[0]!
    other.import({ json, previewToken: conflict.previewToken, mode: 'replace' })
    expect(other.holdings()[0]!.version).toBeGreaterThan(old.version)
    expect(() => other.editHolding(old)).toThrow(/changed/)
  })

  it('imports legacy format 1 backups with unconfigured targets', () => {
    const { store } = open()
    store.saveFund(fund)
    const account = store.createAccount('Main')
    store.addHolding({ accountId: account.id, fundCode: fund.code, shares: '10', costPrice: '1' })
    const current = store.backup()
    const legacy = JSON.stringify({
      ...current,
      format: 1,
      holdings: current.holdings.map(({ targetRatio: _targetRatio, ...holding }) => holding),
    })
    const other = open().store
    const preview = other.preview(legacy)
    other.import({ json: legacy, previewToken: preview.previewToken, mode: 'merge' })
    expect(other.holdings()[0]?.targetRatio).toBeNull()
  })

  it('binds import preview to both JSON and existing holdings', () => {
    const { store } = open()
    const json = JSON.stringify(store.backup())
    const preview = store.preview(json)
    store.createAccount('Concurrent account')
    expect(() => store.import({ json, previewToken: preview.previewToken, mode: 'replace' })).toThrow(/preview again/)
    expect(store.accounts()).toHaveLength(1)
    expect(() => store.preview('{"format":2}')).toThrow()
  })

  it('rejects missing references and duplicate backup records before mutation', () => {
    const { store } = open()
    const account = store.createAccount('Main')
    const backup = store.backup()
    expect(() => store.preview(JSON.stringify({ ...backup, accounts: [account, account] }))).toThrow(/Duplicate/)
    expect(() => store.preview(JSON.stringify({
      ...backup,
      holdings: [{
        id: account.id,
        accountId: account.id,
        fundCode: fund.code,
        shares: '1',
        costPrice: '1',
        targetRatio: null,
        version: 1,
      }],
    }))).toThrow(/references/)
    expect(store.accounts()).toHaveLength(1)
  })

  it('refuses a future schema without changing its version', () => {
    const root = mkdtempSync(join(tmpdir(), 'fund-future-'))
    cleanups.push(() => rmSync(root, { recursive: true, force: true }))
    const path = join(root, 'future.sqlite3')
    const database = new DatabaseSync(path)
    database.exec('PRAGMA user_version=3')
    database.close()
    expect(() => new PortfolioStore(path, 1000)).toThrow(/newer/)
    const check = new DatabaseSync(path)
    expect(check.prepare('PRAGMA user_version').get()!.user_version).toBe(3)
    check.close()
  })
})
