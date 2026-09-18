// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import type { ComponentType } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { PortfolioPanel, PortfolioTrigger } from '../src/client/Panel.tsx'
import type { FundApi } from '../src/client/index.ts'
import { zh, type PortfolioKey } from '../src/client/locales.ts'
import { styles } from '../src/client/styles.ts'
import { summarize, valueHolding } from '../src/host/profit.ts'
import type { HoldingView } from '../src/types.ts'
import { account, fund, holding, quote } from './fixtures.ts'

type TestPanelProps = {
  t: (key: PortfolioKey) => string
  api: FundApi
  useTabInfo: () => { tab: { visible: boolean } }
}

const TestPanel = PortfolioPanel as unknown as ComponentType<TestPanelProps>
const TestTrigger = PortfolioTrigger as unknown as ComponentType<{
  t: (key: PortfolioKey) => string
  wide: boolean
  openPanel: () => void
}>

function renderPortfolio(row: HoldingView, overrides: Partial<FundApi> = {}) {
  const portfolio = summarize('2026-09-15', [account], [row], 60000)
  const api: FundApi = {
    accountCreate: vi.fn(),
    accountUpdate: vi.fn(),
    accountDelete: vi.fn(),
    lookup: vi.fn(),
    holdingAdd: vi.fn(),
    holdingUpdate: vi.fn(),
    holdingDelete: vi.fn(),
    allocationUpdate: vi.fn(),
    summary: vi.fn(async () => portfolio),
    exportData: vi.fn(),
    previewImport: vi.fn(),
    importData: vi.fn(),
    ...overrides,
  }
  render(<TestPanel t={key => zh[key]} api={api} useTabInfo={() => ({ tab: { visible: true } })} />)
  return api
}

beforeEach(() => {
  Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', { configurable: true, value: vi.fn() })
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
    configurable: true,
    value: undefined,
  })
})

describe('portfolio panel holding form', () => {
  it('renders the Lucide portfolio icon with the concise sidebar label', () => {
    const view = render(<TestTrigger t={key => zh[key]} wide={false} openPanel={vi.fn()} />)

    const trigger = screen.getByRole('button', { name: zh.sidebarLabel })
    const icon = trigger.querySelector('svg')
    expect(icon?.classList.contains('lucide-chart-no-axes-column-increasing')).toBe(true)
    expect(trigger.dataset.wide).toBe('false')
    expect(trigger.title).toBe(zh.sidebarLabel)

    view.rerender(<TestTrigger t={key => zh[key]} wide openPanel={vi.fn()} />)
    const wideTrigger = screen.getByRole('button', { name: zh.sidebarLabel })
    expect(wideTrigger.textContent).toBe(zh.sidebarLabel)
    expect(getComputedStyle(wideTrigger).justifyContent).toBe('flex-start')
    expect(getComputedStyle(wideTrigger).width).toBe('100%')
  })

  it('opens editing in a modal, focuses shares, and saves the holding version', async () => {
    const row = valueHolding(holding, account, fund, quote(), '2026-09-15')
    const api = renderPortfolio(row)
    const user = userEvent.setup()
    const trigger = await screen.findByRole('button', { name: `${zh.edit} ${fund.name}` })
    await user.click(trigger)

    const dialog = screen.getByRole('dialog', { name: zh.editHolding })
    const shares = within(dialog).getByRole<HTMLInputElement>('textbox', { name: zh.shares })
    expect(dialog.getAttribute('aria-modal')).toBe('true')
    expect(shares.value).toBe(holding.shares)
    expect(HTMLElement.prototype.scrollIntoView).not.toHaveBeenCalled()
    expect(document.activeElement).toBe(shares)
    expect(styles).not.toContain(':is(button,input,select,summary):focus-visible')
    expect(styles).not.toContain('input:focus-visible')
    expect(styles).not.toContain('.fp-modal-content')
    expect(styles).not.toContain('.fp-percent-input input')
    expect(styles).not.toContain('button.fp-danger')
    expect(styles).not.toContain('.fp button.fp-tab')
    expect(styles).not.toContain('.fp-modal-body *')
    expect(shares.parentElement?.tagName).toBe('SPAN')
    expect(screen.getByRole('article').textContent).toContain(fund.name)
    await user.clear(shares)
    await user.type(shares, '1200')
    await user.click(within(dialog).getByRole('button', { name: zh.confirmFund }))
    expect(api.holdingUpdate).toHaveBeenCalledWith({
      id: holding.id, version: holding.version, accountId: account.id,
      fundCode: fund.code, shares: '1200', costPrice: holding.costPrice,
    }, expect.any(AbortSignal))
    expect(api.holdingAdd).not.toHaveBeenCalled()
    expect(screen.queryByRole('dialog')).toBeNull()
    expect(document.activeElement).toBe(trigger)
  })

  it('focuses the fund code in the add modal and verifies the fund before saving', async () => {
    const api = renderPortfolio(valueHolding(holding, account, fund, quote(), '2026-09-15'), {
      lookup: vi.fn(async () => fund),
    })
    const user = userEvent.setup()
    await screen.findByRole('article')
    const trigger = screen.getByRole('button', { name: zh.addHolding })
    await user.click(trigger)
    const dialog = screen.getByRole('dialog', { name: zh.addHolding })
    const code = within(dialog).getByRole('textbox', { name: zh.code })
    const save = within(dialog).getByRole<HTMLButtonElement>('button', { name: zh.confirmFund })
    expect(document.activeElement).toBe(code)
    expect(save.disabled).toBe(true)
    await user.type(code, fund.code)
    await user.click(within(dialog).getByRole('button', { name: zh.lookup }))
    expect(api.lookup).toHaveBeenCalledWith({ code: fund.code }, expect.any(AbortSignal))
    expect(within(dialog).getByText(`${zh.validated}: ${fund.name} · ${fund.code}`)).not.toBeNull()
    await user.type(within(dialog).getByRole('textbox', { name: zh.shares }), '250')
    await user.type(within(dialog).getByRole('textbox', { name: zh.costPrice }), '1.23')
    await user.click(save)
    expect(api.holdingAdd).toHaveBeenCalledWith({
      accountId: account.id, fundCode: fund.code, shares: '250', costPrice: '1.23',
    }, expect.any(AbortSignal))
    expect(api.holdingUpdate).not.toHaveBeenCalled()
    expect(screen.queryByRole('dialog')).toBeNull()
    expect(document.activeElement).toBe(trigger)
  })

  it.each(['cancel', 'close', 'escape'] as const)('discards holding edits on %s and restores trigger focus', async method => {
    const api = renderPortfolio(valueHolding(holding, account, fund, quote(), '2026-09-15'))
    const user = userEvent.setup()
    const trigger = await screen.findByRole('button', { name: `${zh.edit} ${fund.name}` })
    await user.click(trigger)
    const dialog = screen.getByRole('dialog', { name: zh.editHolding })
    await user.clear(within(dialog).getByRole('textbox', { name: zh.shares }))
    await user.type(within(dialog).getByRole('textbox', { name: zh.shares }), '500')
    if (method === 'escape') await user.keyboard('{Escape}')
    else await user.click(within(dialog).getByRole('button', { name: zh[method] }))
    expect(screen.queryByRole('dialog')).toBeNull()
    expect(document.activeElement).toBe(trigger)
    expect(api.holdingUpdate).not.toHaveBeenCalled()
    expect(api.holdingAdd).not.toHaveBeenCalled()
    await user.click(trigger)
    expect(screen.getByRole<HTMLInputElement>('textbox', { name: zh.shares }).value).toBe(holding.shares)
  })

  it('prevents dismissal and duplicate saves while writing, and retains edits on failure', async () => {
    let rejectSave: (error: Error) => void = () => {}
    const api = renderPortfolio(valueHolding(holding, account, fund, quote(), '2026-09-15'), {
      holdingUpdate: vi.fn(() => new Promise<typeof holding>((_resolve, reject) => { rejectSave = reject })),
    })
    const user = userEvent.setup()
    const trigger = await screen.findByRole('button', { name: `${zh.edit} ${fund.name}` })
    await user.click(trigger)
    const dialog = screen.getByRole('dialog', { name: zh.editHolding })
    const shares = within(dialog).getByRole<HTMLInputElement>('textbox', { name: zh.shares })
    await user.clear(shares)
    await user.type(shares, '500')
    await user.click(within(dialog).getByRole('button', { name: zh.confirmFund }))
    expect(shares.disabled).toBe(true)
    expect(within(dialog).getByRole<HTMLButtonElement>('button', { name: zh.close }).disabled).toBe(true)
    expect(within(dialog).getByRole<HTMLButtonElement>('button', { name: zh.cancel }).disabled).toBe(true)
    fireEvent.submit(dialog.querySelector('form')!)
    await user.keyboard('{Escape}')
    expect(api.holdingUpdate).toHaveBeenCalledTimes(1)
    expect(screen.getByRole('dialog')).toBe(dialog)
    rejectSave(new Error('Save failed'))
    expect((await within(dialog).findByRole('alert')).textContent).toContain('Save failed')
    expect(screen.getAllByRole('alert')).toHaveLength(1)
    expect(shares.value).toBe('500')
    expect(shares.disabled).toBe(false)
    await user.click(within(dialog).getByRole('button', { name: zh.cancel }))
    await user.click(trigger)
    expect(screen.queryByRole('alert')).toBeNull()
  })

  it('keeps lookup failures in the modal and invalidates verification when the code changes', async () => {
    const lookup = vi.fn<FundApi['lookup']>()
      .mockRejectedValueOnce(new Error('Lookup failed'))
      .mockResolvedValue({ ...fund, kind: 'money' })
    renderPortfolio(valueHolding(holding, account, fund, quote(), '2026-09-15'), { lookup })
    const user = userEvent.setup()
    await screen.findByRole('article')
    await user.click(screen.getByRole('button', { name: zh.addHolding }))
    const dialog = screen.getByRole('dialog', { name: zh.addHolding })
    const code = within(dialog).getByRole('textbox', { name: zh.code })
    await user.type(code, fund.code)
    const verify = within(dialog).getByRole('button', { name: zh.lookup })
    await user.click(verify)
    expect((await within(dialog).findByRole('alert')).textContent).toContain('Lookup failed')
    const save = within(dialog).getByRole<HTMLButtonElement>('button', { name: zh.confirmFund })
    expect(save.disabled).toBe(true)
    await user.click(verify)
    expect(screen.queryByRole('alert')).toBeNull()
    const costPrice = within(dialog).getByRole<HTMLInputElement>('textbox', { name: zh.costPrice })
    expect(costPrice.value).toBe('1')
    expect(costPrice.readOnly).toBe(true)
    expect(save.disabled).toBe(false)
    await user.clear(code)
    expect(save.disabled).toBe(true)
    expect(costPrice.readOnly).toBe(false)
  })

  it('opens account management in a modal while preserving the portfolio', async () => {
    const row = valueHolding(holding, account, fund, quote(), '2026-09-15')
    const portfolio = summarize('2026-09-15', [account], [row], 60000)
    const api: FundApi = {
      accountCreate: vi.fn(),
      accountUpdate: vi.fn(),
      accountDelete: vi.fn(),
      lookup: vi.fn(),
      holdingAdd: vi.fn(),
      holdingUpdate: vi.fn(),
      holdingDelete: vi.fn(),
      allocationUpdate: vi.fn(),
      summary: vi.fn(async () => portfolio),
      exportData: vi.fn(),
      previewImport: vi.fn(),
      importData: vi.fn(),
    }
    const user = userEvent.setup()
    render(<TestPanel t={key => zh[key]} api={api} useTabInfo={() => ({ tab: { visible: true } })} />)

    const allAccounts = await screen.findByRole('tab', { name: zh.allAccounts })
    expect(allAccounts.getAttribute('aria-selected')).toBe('true')
    expect(screen.getByText(fund.name)).not.toBeNull()

    await user.click(screen.getByRole('button', { name: zh.accounts }))

    const dialog = screen.getByRole('dialog', { name: zh.accounts })
    expect(dialog.getAttribute('aria-modal')).toBe('true')
    expect(screen.getByText(fund.name)).not.toBeNull()
    expect(within(dialog).getByRole('textbox', { name: zh.accountName })).not.toBeNull()
    await user.tab({ shift: true })
    expect(dialog.contains(document.activeElement)).toBe(true)
    await user.click(within(dialog).getByRole('button', { name: zh.close }))
    expect(screen.queryByRole('dialog')).toBeNull()
    expect(document.activeElement).toBe(screen.getByRole('button', { name: zh.accounts }))
  })
})

describe('portfolio presentation', () => {
  it('uses the host panel label and native pills without repeating a visible portfolio title', async () => {
    renderPortfolio(valueHolding(holding, account, fund, quote(), '2026-09-15'))

    const panel = await screen.findByRole('region', { name: zh.title })
    expect(within(panel).queryByRole('heading', { name: zh.title })).toBeNull()
    expect(panel.querySelector('.fp-header')).toBeNull()
    const globalActions = panel.querySelector('.fp-global-actions')
    const accountBar = panel.querySelector('.fp-accountbar')
    expect(globalActions?.nextElementSibling).toBe(accountBar)
    const activeTab = within(panel).getByRole('tab', { name: zh.allAccounts })
    expect(activeTab.getAttribute('aria-selected')).toBe('true')
    expect(activeTab.className).toMatch(/pill/i)
    expect(styles).not.toContain('.fp button.fp-tab')
  })

  it('groups monetary digits without losing decimal precision and preserves return signs', async () => {
    const row = valueHolding(holding, account, fund, quote(), '2026-09-15')
    row.marketValue = '9007199254740993.12'
    row.floatingProfit = '-24730.96'
    renderPortfolio(row)

    const card = await screen.findByRole('article')
    expect(within(card).getByText('9,007,199,254,740,993.12')).not.toBeNull()
    await userEvent.click(within(card).getByRole('button', { name: zh.details }))
    expect(within(card).getAllByText('9,007,199,254,740,993.12')).toHaveLength(2)
    expect(within(card).getByText('-24,730.96').classList.contains('fp-negative')).toBe(true)
    expect(within(card).getByText('+20.00', { selector: 'strong' }).classList.contains('fp-positive')).toBe(true)
  })

  it('keeps quote values and their full dates in expandable details', async () => {
    renderPortfolio(valueHolding(holding, account, fund, quote(), '2026-09-15'))
    const card = await screen.findByRole('article')
    const disclosure = within(card).getByRole('button', { name: zh.details })
    expect(disclosure.getAttribute('aria-expanded')).toBe('false')
    expect(within(card).queryByText('1.30 · 2026-09-14')).toBeNull()
    const user = userEvent.setup()
    await user.click(disclosure)
    expect(disclosure.getAttribute('aria-expanded')).toBe('true')
    expect(within(card).getByText('1.30 · 2026-09-14')).not.toBeNull()
    expect(within(card).getByText('1.32')).not.toBeNull()
    expect(within(card).getByText('2026-09-15 14:00:00')).not.toBeNull()
    await user.click(disclosure)
    expect(disclosure.getAttribute('aria-expanded')).toBe('false')
  })

  it('shows pending money-market returns once, without a warning banner or a fake yield', async () => {
    const row = valueHolding(holding, account, { ...fund, kind: 'money' }, { ...quote(), estimate: null }, '2026-09-15')
    renderPortfolio(row)

    const card = await screen.findByRole('article')
    expect(within(card).getAllByText(zh.pending)).toHaveLength(1)
    expect(card.querySelector('.fp-warning')).toBeNull()
    expect(card.textContent).not.toContain('—%')
    expect(card.textContent).not.toContain(zh.floating)
  })

  it('keeps real data-quality warnings visible and never turns missing returns into zero', async () => {
    const row = valueHolding(holding, account, fund, { ...quote(), estimate: null, navs: [], error: 'Network unavailable' }, '2026-09-15')
    row.issue = 'baseline'
    renderPortfolio(row)

    const card = await screen.findByRole('article')
    const notice = within(card).getByText(zh.baseline).closest('.fp-quote-note')
    expect(notice?.getAttribute('data-warning')).toBe('true')
    expect(card.querySelectorAll('.fp-quote-note')).toHaveLength(1)
    expect(within(card).queryByText('Network unavailable')).toBeNull()
    expect(within(card).queryByText('0.00')).toBeNull()
  })

  it('presents unavailable estimates as a neutral localized note instead of a cache warning', async () => {
    renderPortfolio(valueHolding(holding, account, fund, { ...quote(), estimate: null, error: 'Estimate unavailable' }, '2026-09-15'))

    const card = await screen.findByRole('article')
    const notice = within(card).getByText(zh.estimatePending).closest('.fp-quote-note')
    expect(notice?.getAttribute('data-warning')).toBe('false')
    expect(card.querySelector('.fp-warning')).toBeNull()
    expect(within(card).queryByText(zh.stale)).toBeNull()
    expect(card.textContent).not.toContain('Estimate unavailable')
    expect(within(card).queryByText(zh.estimateUnavailable)).toBeNull()
  })

  it.each(['Estimate: timed out', 'NAV: timed out; Estimate unavailable'])('keeps actual fetch failures visible for %s', async error => {
    renderPortfolio(valueHolding(holding, account, fund, { ...quote(), estimate: null, error }, '2026-09-15'))

    const card = await screen.findByRole('article')
    expect(within(card).getByText(zh.stale).closest('.fp-quote-note')?.getAttribute('data-warning')).toBe('true')
    expect(within(card).queryByText(error)).toBeNull()
    expect(within(card).queryByText(zh.estimatePending)).toBeNull()
  })

  it('still warns about cached estimates when the provider no longer returns one', async () => {
    renderPortfolio(valueHolding(holding, account, fund, { ...quote(), error: 'Estimate unavailable' }, '2026-09-15'))

    const card = await screen.findByRole('article')
    expect(within(card).getByText(zh.stale).closest('.fp-quote-note')?.getAttribute('data-warning')).toBe('true')
    expect(within(card).queryByText('Estimate unavailable')).toBeNull()
  })

  it('does not say awaiting disclosure when today’s NAV is already disclosed', async () => {
    const currentQuote = quote()
    currentQuote.navs[0]!.date = '2026-09-15'
    renderPortfolio(valueHolding(holding, account, fund, { ...currentQuote, estimate: null, error: 'Estimate unavailable' }, '2026-09-15'))

    const card = await screen.findByRole('article')
    expect(card.querySelector('.fp-quote-note')?.textContent).toContain(zh.estimateUnavailable)
    expect(within(card).queryByText(zh.estimatePending)).toBeNull()
    expect(within(card).getByText(zh.confirmed)).not.toBeNull()
  })

  it('keeps account filtering and delete confirmation functional in the compact layout', async () => {
    const api = renderPortfolio(valueHolding(holding, account, fund, quote(), '2026-09-15'))
    const user = userEvent.setup()
    await screen.findByRole('article')
    await user.click(screen.getByRole('tab', { name: account.name }))
    expect(api.summary).toHaveBeenLastCalledWith({ accountId: account.id, refresh: true, force: false }, expect.any(AbortSignal))
    await user.click(screen.getByRole('button', { name: `${zh.delete} ${fund.name}` }))
    expect(screen.getByRole('alertdialog', { name: zh.deleteQuestion })).not.toBeNull()
    expect(api.holdingDelete).not.toHaveBeenCalled()
    await user.click(screen.getByRole('button', { name: zh.cancel }))
    expect(screen.queryByRole('alertdialog')).toBeNull()
  })
})

describe('account tabs and JSON files', () => {
  const row = () => valueHolding(holding, account, fund, quote(), '2026-09-15')
  const preview = { accounts: 1, holdings: 1, conflicts: [], previewToken: 'verified-file' }
  const json = '{"format":1,"accounts":[],"holdings":[],"funds":[]}'

  async function upload(file = new File([json], 'portfolio.json', { type: 'application/json' })) {
    const user = userEvent.setup()
    await screen.findByRole('article')
    await user.click(screen.getByRole('button', { name: zh.transfer }))
    await user.click(screen.getByRole('menuitem', { name: zh.import }))
    await user.upload(screen.getByLabelText(zh.import), file)
    return user
  }

  it('navigates account tabs with arrow keys and defaults new holdings to the selected account', async () => {
    const api = renderPortfolio(row())
    const user = userEvent.setup()
    const tab = await screen.findByRole('tab', { name: account.name })
    screen.getByRole('tab', { name: zh.allAccounts }).focus()
    await user.keyboard('{ArrowRight}')
    expect(document.activeElement).toBe(tab)
    expect(tab.getAttribute('aria-selected')).toBe('true')
    expect(screen.getByRole('tabpanel', { name: account.name })).not.toBeNull()
    expect(api.summary).toHaveBeenLastCalledWith({ accountId: account.id, refresh: true, force: false }, expect.any(AbortSignal))
    await user.click(screen.getByRole('button', { name: zh.addHolding }))
    expect(screen.getByRole<HTMLSelectElement>('combobox', { name: zh.account }).value).toBe(account.id)
  })

  it('creates and renames accounts in the dialog', async () => {
    const api = renderPortfolio(row())
    const user = userEvent.setup()
    await screen.findByRole('article')
    await user.click(screen.getByRole('button', { name: zh.accounts }))
    const dialog = screen.getByRole('dialog', { name: zh.accounts })
    await user.type(within(dialog).getByRole('textbox', { name: zh.accountName }), 'Bank')
    await user.click(within(dialog).getByRole('button', { name: zh.addAccount }))
    expect(api.accountCreate).toHaveBeenCalledWith({ name: 'Bank' }, expect.any(AbortSignal))
    await user.click(within(dialog).getByRole('button', { name: `${zh.rename} ${account.name}` }))
    const input = within(dialog).getByRole('textbox', { name: zh.accountName })
    expect(document.activeElement).toBe(input)
    await user.clear(input)
    await user.type(input, 'Renamed')
    await user.click(within(dialog).getByRole('button', { name: zh.save }))
    expect(api.accountUpdate).toHaveBeenCalledWith({ ...account, name: 'Renamed' }, expect.any(AbortSignal))
  })

  it('confirms account deletion and resets a removed account filter', async () => {
    const api = renderPortfolio(row())
    const user = userEvent.setup()
    await user.click(await screen.findByRole('tab', { name: account.name }))
    await user.click(screen.getByRole('button', { name: zh.accounts }))
    await user.click(screen.getByRole('button', { name: `${zh.delete} ${account.name}` }))
    expect(api.accountDelete).not.toHaveBeenCalled()
    const confirm = screen.getByRole('alertdialog')
    expect(document.activeElement).toBe(within(confirm).getByRole('button', { name: zh.cancel }))
    await user.click(within(confirm).getByRole('button', { name: zh.delete }))
    expect(api.accountDelete).toHaveBeenCalledWith({ id: account.id, version: account.version }, expect.any(AbortSignal))
    expect(screen.getByRole('tab', { name: zh.allAccounts }).getAttribute('aria-selected')).toBe('true')
    expect(screen.getByRole('dialog', { name: zh.accounts })).not.toBeNull()
  })

  it('supports menu keyboard navigation and Escape focus restoration', async () => {
    renderPortfolio(row())
    const user = userEvent.setup()
    const button = screen.getByRole('button', { name: zh.transfer })
    button.focus()
    await user.keyboard('{ArrowDown}')
    expect(document.activeElement).toBe(screen.getByRole('menuitem', { name: zh.import }))
    await user.keyboard('{ArrowDown}')
    expect(document.activeElement).toBe(screen.getByRole('menuitem', { name: zh.export }))
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('menu')).toBeNull()
    expect(document.activeElement).toBe(button)
    expect(button.getAttribute('aria-expanded')).toBe('false')
  })

  it('previews an uploaded JSON file and imports only after confirmation', async () => {
    const api = renderPortfolio(row(), { previewImport: vi.fn(async () => preview) })
    const user = await upload()
    await screen.findByText(`${zh.conflict}: ${zh.noConflicts}`)
    expect(api.previewImport).toHaveBeenCalledWith({ json }, expect.any(AbortSignal))
    expect(api.importData).not.toHaveBeenCalled()
    expect(screen.queryByRole('textbox')).toBeNull()
    expect(screen.getByText('portfolio.json')).not.toBeNull()
    await user.click(screen.getByRole('button', { name: `${zh.confirm} · ${zh.merge}` }))
    expect(api.importData).toHaveBeenCalledWith({ json, previewToken: preview.previewToken, mode: 'merge' }, expect.any(AbortSignal))
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('blocks conflicting merges until replacement is explicitly selected', async () => {
    const api = renderPortfolio(row(), { previewImport: vi.fn(async () => ({ ...preview, conflicts: ['Existing account'] })) })
    const user = await upload()
    const merge = await screen.findByRole<HTMLButtonElement>('button', { name: `${zh.confirm} · ${zh.merge}` })
    expect(merge.disabled).toBe(true)
    const replace = screen.getByRole('switch', { name: zh.replace })
    expect(replace.getAttribute('aria-checked')).toBe('false')
    await user.click(replace)
    expect(replace.getAttribute('aria-checked')).toBe('true')
    expect(screen.getByText(zh.importWarning)).not.toBeNull()
    expect(api.importData).not.toHaveBeenCalled()
    await user.click(screen.getByRole('button', { name: `${zh.confirm} · ${zh.replace}` }))
    expect(api.importData).toHaveBeenCalledWith({ json, previewToken: preview.previewToken, mode: 'replace' }, expect.any(AbortSignal))
  })

  it('reports malformed JSON inside the modal and allows choosing the same file again', async () => {
    const api = renderPortfolio(row(), { previewImport: vi.fn(async () => preview) })
    const file = new File(['not JSON'], 'portfolio.json', { type: 'application/json' })
    const user = await upload(file)
    expect((await screen.findByRole('alert')).textContent).toContain(zh.invalidJson)
    expect(api.previewImport).not.toHaveBeenCalled()
    expect(screen.getByLabelText<HTMLInputElement>(zh.import).value).toBe('')
    await user.click(screen.getByRole('button', { name: zh.cancel }))
    await user.click(screen.getByRole('button', { name: zh.transfer }))
    await user.click(screen.getByRole('menuitem', { name: zh.import }))
    await user.upload(screen.getByLabelText(zh.import), new File([json], 'portfolio.json', { type: 'application/json' }))
    await screen.findByRole('button', { name: `${zh.confirm} · ${zh.merge}` })
    expect(api.previewImport).toHaveBeenCalledTimes(1)
  })

  it('rejects files over the server size limit before previewing', async () => {
    const api = renderPortfolio(row())
    const file = new File([json], 'portfolio.json')
    Object.defineProperty(file, 'size', { value: 20 * 1024 * 1024 + 1 })
    await upload(file)
    expect((await screen.findByRole('alert')).textContent).toContain(zh.fileTooLarge)
    expect(api.previewImport).not.toHaveBeenCalled()
  })

  it('retains a failed import preview without allowing dismissal during the write', async () => {
    let rejectImport: (error: Error) => void = () => {}
    renderPortfolio(row(), {
      previewImport: vi.fn(async () => preview),
      importData: vi.fn(() => new Promise<{ ok: boolean }>((_resolve, reject) => { rejectImport = reject })),
    })
    const user = await upload()
    await user.click(await screen.findByRole('button', { name: `${zh.confirm} · ${zh.merge}` }))
    const dialog = screen.getByRole('dialog', { name: zh.importReady })
    expect(within(dialog).getByRole<HTMLButtonElement>('button', { name: zh.close }).disabled).toBe(true)
    await user.keyboard('{Escape}')
    expect(screen.getByRole('dialog', { name: zh.importReady })).toBe(dialog)
    rejectImport(new Error('Import failed'))
    expect((await within(dialog).findByRole('alert')).textContent).toContain('Import failed')
    expect(within(dialog).getByText('portfolio.json')).not.toBeNull()
    await waitFor(() => expect(within(dialog).getByRole<HTMLButtonElement>('button', { name: zh.cancel }).disabled).toBe(false))
  })

  it('keeps API errors inside the account modal and closes on Escape', async () => {
    renderPortfolio(row(), { accountCreate: vi.fn(async () => { throw new Error('Account failed') }) })
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: zh.accounts }))
    await user.type(screen.getByRole('textbox', { name: zh.accountName }), 'Bank')
    await user.click(screen.getByRole('button', { name: zh.addAccount }))
    const dialog = screen.getByRole('dialog', { name: zh.accounts })
    expect((await within(dialog).findByRole('alert')).textContent).toContain('Account failed')
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('downloads a JSON file from the export menu', async () => {
    const api = renderPortfolio(row(), { exportData: vi.fn(async () => ({ json, filename: 'portfolio-backup.json' })) })
    const createObjectURL = vi.fn((_blob: Blob) => 'blob:backup')
    Object.defineProperty(URL, 'createObjectURL', { configurable: true, value: createObjectURL })
    Object.defineProperty(URL, 'revokeObjectURL', { configurable: true, value: vi.fn() })
    const downloads: { name: string; href: string }[] = []
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (this: HTMLAnchorElement) {
      downloads.push({ name: this.download, href: this.href })
    })
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: zh.transfer }))
    await user.click(screen.getByRole('menuitem', { name: zh.export }))
    await waitFor(() => expect(downloads).toEqual([{ name: 'portfolio-backup.json', href: 'blob:backup' }]))
    expect(api.exportData).toHaveBeenCalledWith({}, expect.any(AbortSignal))
    expect(createObjectURL.mock.calls[0]?.[0]).toBeInstanceOf(Blob)
    expect((createObjectURL.mock.calls[0]?.[0] as Blob).type).toBe('application/json')
  })
})

describe('account target allocation', () => {
  it('shows the entry only for one account and saves a complete 100% allocation', async () => {
    const row = valueHolding(holding, account, fund, quote(), '2026-09-15')
    const api = renderPortfolio(row)
    const user = userEvent.setup()
    await screen.findByRole('article')
    expect(screen.queryByRole('button', { name: zh.allocation })).toBeNull()

    await user.click(screen.getByRole('tab', { name: account.name }))
    const trigger = await screen.findByRole('button', { name: zh.allocation })
    await user.click(trigger)
    const dialog = screen.getByRole('dialog', { name: zh.allocation })
    const target = within(dialog).getByRole<HTMLInputElement>('spinbutton', {
      name: `${fund.name} ${zh.targetRatio}`,
    })
    const save = within(dialog).getByRole<HTMLButtonElement>('button', { name: zh.save })
    expect(document.activeElement).toBe(target)
    expect(target.value).toBe('')
    expect(save.disabled).toBe(true)
    expect(within(dialog).getByText(zh.allocationUnconfigured)).not.toBeNull()

    await user.type(target, '99.99')
    expect(within(dialog).getByText(zh.allocationInvalid)).not.toBeNull()
    expect(save.disabled).toBe(true)
    await user.clear(target)
    await user.type(target, '100')
    expect(within(dialog).getByText(zh.targetTotal).textContent).toContain('100.00%')
    await user.click(save)
    expect(api.allocationUpdate).toHaveBeenCalledWith({
      accountId: account.id,
      allocations: [{ id: holding.id, version: holding.version, targetRatio: '100' }],
    }, expect.any(AbortSignal))
    expect(screen.queryByRole('dialog')).toBeNull()
    expect(document.activeElement).toBe(trigger)
  })

  it('renders allocation readiness and theoretical hold details only in an account view', async () => {
    const configured = { ...holding, targetRatio: '100' }
    const row = valueHolding(configured, account, fund, quote(), '2026-09-15')
    const all = summarize('2026-09-15', [account], [row], 60000)
    const selected = summarize('2026-09-15', [account], [row], 60000, account.id)
    const api: FundApi = {
      accountCreate: vi.fn(),
      accountUpdate: vi.fn(),
      accountDelete: vi.fn(),
      lookup: vi.fn(),
      holdingAdd: vi.fn(),
      holdingUpdate: vi.fn(),
      holdingDelete: vi.fn(),
      allocationUpdate: vi.fn(),
      summary: vi.fn(async input => input.accountId ? selected : all),
      exportData: vi.fn(),
      previewImport: vi.fn(),
      importData: vi.fn(),
    }
    const user = userEvent.setup()
    render(<TestPanel t={key => zh[key]} api={api} useTabInfo={() => ({ tab: { visible: true } })} />)
    await screen.findByRole('article')
    expect(screen.queryByText(zh.allocationReady)).toBeNull()

    await user.click(screen.getByRole('tab', { name: account.name }))
    expect(await screen.findByText(zh.allocationReady)).not.toBeNull()
    const card = screen.getByRole('article')
    expect(within(card).getByText(zh.currentRatio).textContent).toContain('100.00%')
    expect(within(card).getByText(zh.targetRatio).textContent).toContain('100.00%')
    expect(within(card).getByText(zh.theoreticalHold)).not.toBeNull()
    expect(screen.getByText(zh.allocationDisclaimer)).not.toBeNull()
  })

  it('keeps failed allocation edits in the modal for correction', async () => {
    const api = renderPortfolio(valueHolding(holding, account, fund, quote(), '2026-09-15'), {
      allocationUpdate: vi.fn(async () => { throw new Error('Allocation changed') }),
    })
    const user = userEvent.setup()
    await user.click(await screen.findByRole('tab', { name: account.name }))
    await user.click(screen.getByRole('button', { name: zh.allocation }))
    const dialog = screen.getByRole('dialog', { name: zh.allocation })
    const target = within(dialog).getByRole<HTMLInputElement>('spinbutton', {
      name: `${fund.name} ${zh.targetRatio}`,
    })
    await user.type(target, '100')
    await user.click(within(dialog).getByRole('button', { name: zh.save }))
    expect((await within(dialog).findByRole('alert')).textContent).toContain('Allocation changed')
    expect(target.value).toBe('100')
    expect(screen.getByRole('dialog', { name: zh.allocation })).toBe(dialog)
    expect(api.allocationUpdate).toHaveBeenCalledTimes(1)
  })

  it('shows theoretical buy and sell amounts, shares, and nonzero sub-cent values', async () => {
    const secondFund = { ...fund, code: '005828', name: 'Second fund', kind: 'money' as const }
    const first = valueHolding(
      { ...holding, shares: '50.004', costPrice: '1', targetRatio: '50' },
      account, { ...fund, kind: 'money' }, quote(), '2026-09-15',
    )
    const second = valueHolding(
      {
        ...holding,
        id: '33333333-3333-4333-8333-333333333333' as typeof holding.id,
        fundCode: secondFund.code,
        shares: '49.996',
        costPrice: '1',
        targetRatio: '50',
      },
      account, secondFund, { ...quote(), code: secondFund.code }, '2026-09-15',
    )
    const portfolio = summarize('2026-09-15', [account], [first, second], 60000, account.id)
    const api = {
      ...renderPortfolio(first),
      summary: vi.fn(async () => portfolio),
    }
    cleanup()
    render(<TestPanel t={key => zh[key]} api={api} useTabInfo={() => ({ tab: { visible: true } })} />)

    const cards = await screen.findAllByRole('article')
    expect(within(cards[0]!).getByText(zh.theoreticalSell)).not.toBeNull()
    expect(within(cards[0]!).getByText(`<0.01 CNY · ${zh.estimatedShares} <0.01`)).not.toBeNull()
    expect(within(cards[1]!).getByText(zh.theoreticalBuy)).not.toBeNull()
    expect(within(cards[1]!).getByText(`<0.01 CNY · ${zh.estimatedShares} <0.01`)).not.toBeNull()
  })
})
