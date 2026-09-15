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

  it('round-trips backups and refuses conflicts without replacement', () => {
    const { store } = open()
    store.saveFund(fund)
    const account = store.createAccount('Main')
    store.addHolding({ accountId: account.id, fundCode: fund.code, shares: '10', costPrice: '1' })
    const json = JSON.stringify(store.backup())
    const other = open().store
    const preview = other.preview(json)
    expect(preview.conflicts).toEqual([])
    other.import({ json, previewToken: preview.previewToken, mode: 'merge' })
    expect(other.holdings()[0]?.shares).toBe('10')
    const conflict = other.preview(json)
    expect(conflict.conflicts).toHaveLength(2)
    expect(() => other.import({ json, previewToken: conflict.previewToken, mode: 'merge' })).toThrow(/conflicts/)
    const old = other.holdings()[0]!
    other.import({ json, previewToken: conflict.previewToken, mode: 'replace' })
    expect(other.holdings()[0]!.version).toBeGreaterThan(old.version)
    expect(() => other.editHolding(old)).toThrow(/changed/)
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
    expect(() => store.preview(JSON.stringify({ ...backup, holdings: [{ id: account.id, accountId: account.id, fundCode: fund.code, shares: '1', costPrice: '1', version: 1 }] }))).toThrow(/references/)
    expect(store.accounts()).toHaveLength(1)
  })

  it('refuses a future schema without changing its version', () => {
    const root = mkdtempSync(join(tmpdir(), 'fund-future-'))
    cleanups.push(() => rmSync(root, { recursive: true, force: true }))
    const path = join(root, 'future.sqlite3')
    const database = new DatabaseSync(path)
    database.exec('PRAGMA user_version=2')
    database.close()
    expect(() => new PortfolioStore(path, 1000)).toThrow(/newer/)
    const check = new DatabaseSync(path)
    expect(check.prepare('PRAGMA user_version').get()!.user_version).toBe(2)
    check.close()
  })
})
