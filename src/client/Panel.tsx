/** Portfolio view with explicit dated coverage and user-confirmed mutations. */
import { useEffect, useId, useRef, useState, useSyncExternalStore } from 'react'
import type { FormEvent } from 'react'
import { Decimal } from 'decimal.js'
import ChartNoAxesColumnIncreasing from 'lucide-react/dist/esm/icons/chart-no-axes-column-increasing.mjs'
import {
  Button, DisclosureRow, IconChevronRightOutline14, IconPlusOutline16, IconRefreshOutline16,
  Input, Modal, Pill, Switch, Tag,
} from '@deepseek-ai/dsh-client-ui-primitives'
import type { PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import type {
  Account, AccountId, AllocationSummary, Fund, Holding, HoldingView, ImportPreview,
} from '../types.ts'
import type { FundApi } from './index.ts'
import { PortfolioController } from './controller.ts'
import type { PortfolioKey } from './locales.ts'
import { BackupMenu, ModalFocusScope } from './overlays.tsx'
import { styles, triggerStyles } from './styles.ts'

type Translate = (key: PortfolioKey) => string
export interface PanelInjected { api: FundApi }
export interface TriggerInjected { openPanel: () => void }
type PanelProps = PropsLocale<'fundPortfolio'> & PropsRuntime<'sidebar.right.pane.tab'> & PanelInjected
type TriggerProps = PropsLocale<'fundPortfolio'> & PropsRuntime<'sidebar.footer.action'> & TriggerInjected
type HoldingForm = { holding?: Holding; accountId: string; code: string; shares: string; costPrice: string; fund: Fund | null }
type AllocationForm = {
  accountId: AccountId
  items: { holding: Holding; fund: Fund; targetRatio: string }[]
}

function errorMessage(error: unknown, t: Translate): string {
  if (typeof error === 'object' && error !== null && 'code' in error
    && error.code === 'fund-portfolio/duplicate-holding') return t('duplicateHolding')
  return error instanceof Error ? error.message : String(error)
}

function amount(value: string | null, signed = false): string {
  if (value === null) return '—'
  const decimal = new Decimal(value)
  const [integer, fraction] = decimal.toFixed(2).split('.')
  return `${signed && decimal.gt(0) ? '+' : ''}${integer.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}.${fraction}`
}

function tone(value: string | null): string {
  if (value === null || new Decimal(value).isZero()) return 'fp-number'
  return new Decimal(value).gt(0) ? 'fp-number fp-positive' : 'fp-number fp-negative'
}

function compact(value: string): string {
  const decimal = new Decimal(value)
  if (!decimal.isZero() && decimal.abs().lt(0.01)) return '<0.01'
  return amount(decimal.abs().toFixed())
}

function percentage(value: string | null): string {
  return value === null ? '—' : `${new Decimal(value).toFixed(2)}%`
}

export function PortfolioTrigger({ t, wide, openPanel }: TriggerProps) {
  return <>
    <style>{triggerStyles}</style>
    <button type="button" className="fp-trigger" aria-label={t('sidebarLabel')} title={t('sidebarLabel')} data-wide={wide} onClick={openPanel}>
      <ChartNoAxesColumnIncreasing size={wide ? 16 : 18} strokeWidth={1.6} aria-hidden="true" />
      {wide && <span>{t('sidebarLabel')}</span>}
    </button>
  </>
}

function allocationStatusText(status: AllocationSummary['status'], t: Translate): string {
  if (status === 'ready') return t('allocationReady')
  if (status === 'market-incomplete') return t('allocationMarketIncomplete')
  if (status === 'invalid-target-total') return t('allocationInvalid')
  return t('allocationUnconfigured')
}

function HoldingCard({ row, allocation, t, edit, remove }: {
  row: HoldingView
  allocation: AllocationSummary | null
  t: Translate
  edit: () => void
  remove: () => void
}) {
  const [detailsOpen, setDetailsOpen] = useState(false)
  const money = row.fund.kind === 'money'
  const nav = row.quote.navs[0]
  const estimate = row.quote.estimate
  const estimateUnavailable = !money && !estimate && row.quote.error === 'Estimate unavailable'
  const issue = row.issue && row.issue !== 'pending' ? row.issue : null
  const quoteNotice = issue ? t(issue)
    : estimateUnavailable ? t(row.today ? 'estimateUnavailable' : 'estimatePending')
      : row.quote.error ? t(nav || estimate ? 'stale' : 'unavailable') : null
  return <article className="fp-card">
    <div className="fp-card-main">
      <header className="fp-card-heading"><h3>{row.fund.name}</h3><p className="fp-sub fp-card-meta"><span>{row.fund.code} · {row.accountName}</span><Tag tone="quiet">{t(money ? 'money' : row.fund.kind === 'qdii' ? 'qdii' : 'navFund')}</Tag></p></header>
      <div className="fp-pair">
        <div><span className="fp-muted">{t('today')}</span><strong className={tone(row.today?.amount ?? null)}>{amount(row.today?.amount ?? null, true)}</strong>
          <Tag tone={row.today?.kind === 'confirmed' ? 'success' : row.today?.kind === 'estimated' ? 'info' : 'neutral'}>
            {row.today ? t(row.today.kind) : t('pending')}
          </Tag></div>
        <div><span className="fp-muted">{t(money ? 'annual' : 'floating')}</span>
          <strong className={money ? 'fp-number' : tone(row.floatingProfit)}>{money ? (nav?.annualYield ? `${nav.annualYield}%` : t('noData')) : amount(row.floatingProfit, true)}</strong>
          {!money && <span className={`fp-caption ${tone(row.floatingRate)}`}>{row.floatingRate === null ? t('zeroCost') : `${amount(row.floatingRate, true)}%`}</span>}</div>
        <div><span className="fp-muted">{t('market')}</span><strong className="fp-number">{amount(row.marketValue)}</strong><span className="fp-caption" title={t('priceDate')}>{row.priceDate ?? t('noData')}</span></div>
      </div>
    </div>
    {quoteNotice && <p className="fp-quote-note" data-warning={Boolean(issue || (row.quote.error && !estimateUnavailable))}>
      <span className="fp-note-label">{t('quoteStatus')}</span><span>{quoteNotice}</span>
    </p>}
    {allocation && <div className="fp-rebalance" data-status={allocation.status}>
      <div className="fp-rebalance-ratio">
        <span>{t('currentRatio')} <strong>{percentage(row.currentRatio)}</strong></span>
        <IconChevronRightOutline14 aria-hidden="true" />
        <span>{t('targetRatio')} <strong>{percentage(row.holding.targetRatio)}</strong></span>
      </div>
      {row.rebalance ? <div className="fp-rebalance-action" data-action={row.rebalance.action}>
        <strong>{t(row.rebalance.action === 'buy' ? 'theoreticalBuy' : row.rebalance.action === 'sell' ? 'theoreticalSell' : 'theoreticalHold')}</strong>
        {row.rebalance.action !== 'hold' && <span>{compact(row.rebalance.amount)} CNY · {t('estimatedShares')} {compact(row.rebalance.shares)}</span>}
      </div> : <p>{allocationStatusText(allocation.status, t)}</p>}
    </div>}
    <div className="fp-card-footer"><div className="fp-details"><DisclosureRow
      title={t('details')} icon={<IconChevronRightOutline14 />} open={detailsOpen} expandable expandOnRowClick
      onToggle={() => setDetailsOpen(open => !open)}>
      <dl className="fp-details-body">
        {row.quote.error && <><dt>{t('quoteDetails')}</dt><dd>{estimateUnavailable ? t('estimateUnavailable') : row.quote.error}</dd></>}
        <dt>{t(money ? 'moneyYield' : 'nav')}</dt><dd>{nav?.value ?? t('noData')} · {nav?.date ?? t('noData')}</dd>
        {!money && <><dt>{t('estimate')}</dt><dd>{estimate?.value ?? t('noData')}</dd>
          <dt>{t('estimateTime')}</dt><dd>{estimate ? `${estimate.date} ${estimate.time}` : t('noData')}</dd></>}
        <dt>{t('shares')}</dt><dd>{row.holding.shares}</dd><dt>{t('costPrice')}</dt><dd>{row.holding.costPrice}</dd>
        <dt>{t('market')}</dt><dd>{amount(row.marketValue)}</dd><dt>{t('priceDate')}</dt><dd>{row.priceDate ?? t('noData')}</dd>
        <dt>{t('recent')}</dt><dd className={tone(row.confirmed?.amount ?? null)}>{amount(row.confirmed?.amount ?? null, true)} · {row.confirmed?.date ?? t('noData')}</dd>
        {!money && <><dt>{t('referenceDate')}</dt><dd>{estimate?.referenceDate ?? t('noData')}</dd>
          <dt>{t('reference')}</dt><dd>{amount(row.referenceChange, true)}</dd>
          <dt>{t('rate')}</dt><dd>{row.floatingRate === null ? t('zeroCost') : `${amount(row.floatingRate, true)}%`}</dd></>}
        {money && <><dt>{t('annual')}</dt><dd>{nav?.annualYield ? `${nav.annualYield}%` : t('noData')}</dd></>}
        <dt>{t('fetched')}</dt><dd>{row.quote.navFetchedAt ?? t('noData')}</dd>
      </dl>
    </DisclosureRow></div>
      <div className="fp-card-actions"><Button size="sm" aria-label={`${t('edit')} ${row.fund.name}`} onClick={edit}>{t('edit')}</Button><Button size="sm" aria-label={`${t('delete')} ${row.fund.name}`} onClick={remove}>{t('delete')}</Button></div>
    </div>
  </article>
}

export function PortfolioPanel({ t, api, useTabInfo }: PanelProps) {
  const [controller] = useState(() => new PortfolioController(api))
  const { data, busy, error } = useSyncExternalStore(controller.subscribe, controller.getSnapshot)
  const { tab } = useTabInfo()
  const lifetime = useRef(new AbortController())
  const [documentVisible, setDocumentVisible] = useState(document.visibilityState !== 'hidden')
  const [filter, setFilter] = useState('')
  const [localError, setLocalError] = useState<string | null>(null)
  const [working, setWorking] = useState(false)
  const [modal, setModal] = useState<'accounts' | 'allocation' | 'import' | null>(null)
  const [form, setForm] = useState<HoldingForm | null>(null)
  const [allocationForm, setAllocationForm] = useState<AllocationForm | null>(null)
  const [accountForm, setAccountForm] = useState<{ account?: Account; name: string }>({ name: '' })
  const [deleting, setDeleting] = useState<{ label: string; action: () => Promise<unknown> } | null>(null)
  const [importFile, setImportFile] = useState<{ name: string; json: string } | null>(null)
  const [preview, setPreview] = useState<ImportPreview | null>(null)
  const [replace, setReplace] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const accountNameId = useId()
  const tabsId = useId()
  const holdingFormFocusId = useId()
  const allocationFocusId = useId()
  const accountFormId = `${accountNameId}-form`
  const holdingFormId = `${holdingFormFocusId}-form`
  const allocationFormId = `${allocationFocusId}-form`
  useEffect(() => {
    const onVisibility = () => setDocumentVisible(document.visibilityState !== 'hidden')
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [])
  useEffect(() => { controller.setVisible(tab.visible && documentVisible) }, [controller, tab.visible, documentVisible])
  useEffect(() => () => { lifetime.current.abort(); controller.dispose() }, [controller])
  useEffect(() => {
    if (data && filter && !data.accounts.some(account => account.id === filter)) {
      setFilter('')
      controller.select({})
    }
  }, [data, filter, controller])
  const openHoldingForm = (next: HoldingForm) => {
    setLocalError(null)
    setForm(next)
  }
  const closeHoldingForm = () => {
    setForm(null)
    setLocalError(null)
  }
  const run = async (operation: () => Promise<unknown>, done?: () => void) => {
    setWorking(true)
    setLocalError(null)
    let succeeded = false
    try {
      await operation()
      if (lifetime.current.signal.aborted) return
      await controller.refresh()
      if (lifetime.current.signal.aborted) return
      succeeded = true
    } catch (failure) {
      if (!lifetime.current.signal.aborted) setLocalError(errorMessage(failure, t))
    } finally {
      if (!lifetime.current.signal.aborted) {
        setWorking(false)
        if (succeeded) done?.()
      }
    }
  }
  const saveHolding = (event: FormEvent) => {
    event.preventDefault()
    if (working || !form?.fund || !form.accountId) return
    const input = { accountId: form.accountId as AccountId, fundCode: form.fund.code, shares: form.shares, costPrice: form.costPrice }
    void run(() => form.holding
      ? api.holdingUpdate({ ...input, id: form.holding.id, version: form.holding.version }, lifetime.current.signal)
      : api.holdingAdd(input, lifetime.current.signal), closeHoldingForm)
  }
  const exportBackup = () => void run(async () => {
    const file = await api.exportData({}, lifetime.current.signal)
    if (lifetime.current.signal.aborted) return
    const url = URL.createObjectURL(new Blob([file.json], { type: 'application/json' }))
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = file.filename
    anchor.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  })
  const closeModal = () => {
    setModal(null)
    setLocalError(null)
    setPreview(null)
    setImportFile(null)
    setReplace(false)
    setAccountForm({ name: '' })
    setAllocationForm(null)
  }
  const importBackup = (file: File) => {
    setModal('import')
    setImportFile({ name: file.name, json: '' })
    setPreview(null)
    setReplace(false)
    void run(async () => {
      if (!/\.json$/i.test(file.name)) throw new Error(t('jsonFileOnly'))
      if (file.size > 20 * 1024 * 1024) throw new Error(t('fileTooLarge'))
      const json = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(String(reader.result).replace(/^\uFEFF/, ''))
        reader.onerror = () => reject(new Error(t('fileReadError')))
        reader.readAsText(file)
      })
      try { JSON.parse(json) } catch { throw new Error(t('invalidJson')) }
      if (lifetime.current.signal.aborted) return
      const result = await api.previewImport({ json }, lifetime.current.signal)
      if (lifetime.current.signal.aborted) return
      setImportFile({ name: file.name, json })
      setPreview(result)
    })
  }
  const accounts = [{ id: '', name: t('allAccounts') }, ...(data?.accounts ?? [])]
  const allocationTotal = allocationForm?.items.reduce((total, item) => {
    try { return total.add(item.targetRatio || 0) } catch { return total }
  }, new Decimal(0)) ?? new Decimal(0)
  const allocationValuesValid = allocationForm?.items.every(item =>
    /^(?:0|[1-9]\d?|100)(?:\.\d{1,2})?$/.test(item.targetRatio)
      && new Decimal(item.targetRatio).lte(100)) ?? false
  const allocationCanSave = Boolean(allocationForm?.items.length)
    && allocationValuesValid && allocationTotal.eq(100)
  const openAllocation = () => {
    if (!filter || !data?.holdings.length) return
    setLocalError(null)
    setAllocationForm({
      accountId: filter as AccountId,
      items: data.holdings.map(row => ({
        holding: row.holding,
        fund: row.fund,
        targetRatio: row.holding.targetRatio ?? '',
      })),
    })
    setModal('allocation')
  }
  const selectAccount = (id: string) => {
    setFilter(id)
    controller.select(id ? { accountId: id as AccountId } : {})
  }
  const modalError = localError && <p role="alert" className="fp-error">{t('error')}: {localError}</p>
  const backgroundBusy = working && !form && !modal && !deleting
  return <section className="fp" aria-label={t('title')}>
    <style>{styles}</style>
    <div className="fp-body">
      {(error || (localError && !modal && !deleting && !form)) && <p role="alert" className="fp-error">{t('error')}: {error ?? localError}</p>}
      <div className="fp-controls">
        <div className="fp-global-actions">
          <div className="fp-secondary-actions">
            <Button variant="outline" disabled={backgroundBusy} onClick={() => { setLocalError(null); setModal('accounts') }}>{t('accounts')}</Button>
            <BackupMenu t={t} disabled={backgroundBusy} onImport={() => fileInputRef.current?.click()} onExport={exportBackup} />
          </div>
          <div className="fp-primary-actions">
            <Button variant="outline" icon={<IconRefreshOutline16 />}
              aria-busy={busy} disabled={busy} onClick={() => void controller.refresh(true)}>{t(busy ? 'refreshing' : 'refresh')}</Button>
            <Button variant="primary" disabled={backgroundBusy} onClick={() => {
              openHoldingForm({ accountId: filter || data?.accounts[0]?.id || '', code: '', shares: '', costPrice: '', fund: null })
            }} icon={<IconPlusOutline16 />}>{t('addHolding')}</Button>
          </div>
        </div>
        <div className="fp-accountbar">
          <div className="fp-tabs" role="tablist" aria-label={t('account')}>
            {accounts.map((account, index) => <Pill role="tab" key={account.id}
              id={`${tabsId}-tab-${account.id || 'all'}`} aria-controls={`${tabsId}-panel`}
              aria-selected={filter === account.id} tabIndex={filter === account.id ? 0 : -1}
              active={filter === account.id} onClick={() => selectAccount(account.id)}
              onKeyDown={event => {
                if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return
                event.preventDefault()
                const next = event.key === 'Home' ? 0 : event.key === 'End' ? accounts.length - 1
                  : (index + (event.key === 'ArrowRight' ? 1 : -1) + accounts.length) % accounts.length
                const buttons = event.currentTarget.parentElement!.querySelectorAll<HTMLButtonElement>('[role=tab]')
                buttons[next]?.focus()
                buttons[next]?.scrollIntoView({ block: 'nearest', inline: 'nearest' })
                selectAccount(accounts[next]!.id)
              }}>{account.name}</Pill>)}
          </div>
          {filter && <div className="fp-account-actions"><Button variant="outline" size="sm"
            disabled={backgroundBusy || busy || !data?.holdings.length}
            onClick={openAllocation}>{t('allocation')}</Button></div>}
        </div>
      </div>
      <input ref={fileInputRef} type="file" hidden accept=".json,application/json" aria-label={t('import')}
        onChange={event => {
          const file = event.currentTarget.files?.[0]
          event.currentTarget.value = ''
          if (file) importBackup(file)
        }} />
      <div className="fp-content" role="tabpanel" id={`${tabsId}-panel`} aria-labelledby={`${tabsId}-tab-${filter || 'all'}`} aria-busy={busy} tabIndex={0}>
      {data && <div className="fp-overview">
        <div className="fp-hero"><div className="fp-total"><div className="fp-total-label"><span>{t('today')}</span><time className="fp-muted">{data.date}</time>{data.missingCount > 0 && <Tag tone="warning">{t('partial')}</Tag>}</div>
          <div className={`fp-big ${tone(data.todayTotal)}`}>{amount(data.todayTotal, true)}<span className="fp-currency">CNY</span></div></div>
          <div className="fp-split"><div><span>{t('confirmed')} · {data.confirmedCount}</span><strong className={tone(data.confirmedToday)}>{amount(data.confirmedToday, true)}</strong></div>
            <div><span>{t('estimated')} · {data.estimatedCount}</span><strong className={tone(data.estimatedToday)}>{amount(data.estimatedToday, true)}</strong></div>
            <div>{t('missing')}<strong>{data.missingCount}</strong></div></div></div>
        <div className="fp-metrics"><div><span className="fp-muted">{t('market')} <Tag tone="neutral">{data.marketCovered}/{data.holdings.length}</Tag></span><strong>{amount(data.marketValue)}</strong></div>
          <div><span className="fp-muted">{t('cost')}</span><strong>{amount(data.cost)}</strong></div>
          <div><span className="fp-muted">{t('floating')} <Tag tone="neutral">{data.floatingCovered}/{data.holdings.length}</Tag></span><strong className={tone(data.floatingProfit)}>{amount(data.floatingProfit, true)}</strong></div></div>
        {data.allocation && <div className="fp-allocation-summary" data-status={data.allocation.status}>
          <div><span>{t('allocation')}</span><strong>{allocationStatusText(data.allocation.status, t)}</strong>
            <small>{t('configured')} {data.allocation.configured}/{data.allocation.holdings} · {t('targetTotal')} {percentage(data.allocation.targetTotal)}</small></div>
          {data.allocation.status === 'ready' && <div className="fp-allocation-totals">
            <span>{t('theoreticalBuy')} <strong>{amount(data.allocation.buyAmount)}</strong></span>
            <span>{t('theoreticalSell')} <strong>{amount(data.allocation.sellAmount)}</strong></span>
          </div>}
        </div>}
      </div>}
      {!data && <p className="fp-note">{t('loading')}</p>}
      {data?.holdings.length === 0 && <div className="fp-empty"><span className="fp-empty-icon"><ChartNoAxesColumnIncreasing size={28} strokeWidth={1.5} aria-hidden="true" /></span><h3>{t('empty')}</h3><p>{t('emptyHint')}</p></div>}
      <div className="fp-list">{data?.holdings.map(row => <HoldingCard key={row.holding.id} row={row} allocation={data.allocation} t={t}
        edit={() => openHoldingForm({ holding: row.holding, accountId: row.holding.accountId, code: row.fund.code, shares: row.holding.shares, costPrice: row.holding.costPrice, fund: row.fund })}
        remove={() => { setLocalError(null); setDeleting({ label: `${row.fund.name} · ${row.accountName} · ${row.holding.shares} · ${row.holding.costPrice}`, action: () => api.holdingDelete({ id: row.holding.id, version: row.holding.version }, lifetime.current.signal) }) }} />)}</div>
      <footer className="fp-footer"><p className="fp-note">{t('disclaimer')}</p>
        {data?.allocation && <p className="fp-note">{t('allocationDisclaimer')}</p>}
        <p className="fp-muted">{t('source')}</p></footer>
      </div>
    </div>
    {form && <Modal open title={t(form.holding ? 'editHolding' : 'addHolding')} closeLabel={t('close')}
      onClose={() => { if (!working) closeHoldingForm() }}
      footer={<><Button variant="outline" disabled={working} onClick={closeHoldingForm}>{t('cancel')}</Button>
        <Button type="submit" form={holdingFormId} variant="primary" disabled={working || !form.fund || !form.accountId}>{t('confirmFund')}</Button></>}>
      <ModalFocusScope busy={working} initialFocusId={holdingFormFocusId}>
        {modalError}
        <form id={holdingFormId} className="fp-modal-form" onSubmit={saveHolding}>
          {!data?.accounts.length && <p className="fp-warning">{t('chooseAccount')}</p>}
          <label>{t('account')}<select required disabled={working} value={form.accountId} onChange={event => setForm({ ...form, accountId: event.target.value })}><option value="">{t('account')}</option>{data?.accounts.map(account => <option key={account.id} value={account.id}>{account.name}</option>)}</select></label>
          <label>{t('code')}<Input id={form.holding ? undefined : holdingFormFocusId} required disabled={working} pattern="[0-9]{6}" maxLength={6} inputMode="numeric" value={form.code} onChange={event => setForm({ ...form, code: event.target.value, fund: null })} /></label>
          <Button variant="outline" disabled={working || !/^\d{6}$/.test(form.code)} onClick={() => {
            const code = form.code
            void run(async () => {
              const fund = await api.lookup({ code }, lifetime.current.signal)
              if (lifetime.current.signal.aborted) return
              setForm(current => current?.code === code ? { ...current, fund, costPrice: fund.kind === 'money' ? '1' : current.costPrice } : current)
            })
          }}>{t('lookup')}</Button>
          {form.fund && <p className="fp-note">{t('validated')}: {form.fund.name} · {form.fund.code}</p>}
          <label>{t('shares')}<Input id={form.holding ? holdingFormFocusId : undefined} required disabled={working} inputMode="decimal" value={form.shares} onChange={event => setForm({ ...form, shares: event.target.value })} /></label>
          <label>{t('costPrice')}<Input required disabled={working} inputMode="decimal" readOnly={form.fund?.kind === 'money'} value={form.costPrice} onChange={event => setForm({ ...form, costPrice: event.target.value })} /></label>
        </form>
      </ModalFocusScope>
    </Modal>}
    {modal === 'accounts' && <Modal open title={t('accounts')} closeLabel={t('close')}
      onClose={() => { if (!working) closeModal() }}
      footer={<>{accountForm.account && <Button variant="outline" disabled={working} onClick={() => setAccountForm({ name: '' })}>{t('cancel')}</Button>}
        <Button type="submit" form={accountFormId} variant="primary" disabled={working || !accountForm.name.trim()}>{t(accountForm.account ? 'save' : 'addAccount')}</Button></>}>
      <ModalFocusScope busy={working}>
        {!deleting && modalError}
        <p className="fp-note">{t('accountHelp')}</p>
        <div className="fp-account-list">{data?.accounts.map(account => <div className="fp-line fp-account" key={account.id}>
          <span>{account.name}</span><div className="fp-line">
            <Button size="sm" disabled={working} aria-label={`${t('rename')} ${account.name}`} onClick={() => { setAccountForm({ account, name: account.name }); document.getElementById(accountNameId)?.focus() }}>{t('rename')}</Button>
            <Button size="sm" disabled={working} aria-label={`${t('delete')} ${account.name}`} onClick={() => {
              setLocalError(null)
              setDeleting({ label: account.name, action: async () => {
                await api.accountDelete({ id: account.id, version: account.version }, lifetime.current.signal)
                if (filter === account.id) selectAccount('')
                if (accountForm.account?.id === account.id) setAccountForm({ name: '' })
              } })
            }}>{t('delete')}</Button>
          </div></div>)}</div>
        <form id={accountFormId} className="fp-account-form" onSubmit={event => { event.preventDefault(); void run(() => accountForm.account
          ? api.accountUpdate({ ...accountForm.account, name: accountForm.name }, lifetime.current.signal)
          : api.accountCreate({ name: accountForm.name }, lifetime.current.signal), () => setAccountForm({ name: '' })) }}>
          <h3>{t(accountForm.account ? 'rename' : 'addAccount')}</h3>
          <label>{t('accountName')}<Input id={accountNameId} required maxLength={100} disabled={working} value={accountForm.name} onChange={event => setAccountForm({ ...accountForm, name: event.target.value })} /></label>
        </form>
      </ModalFocusScope>
    </Modal>}
    {modal === 'allocation' && allocationForm && <Modal open title={t('allocation')} closeLabel={t('close')}
      onClose={() => { if (!working) closeModal() }}
      footer={<><Button variant="outline" disabled={working} onClick={closeModal}>{t('cancel')}</Button>
        <Button type="submit" form={allocationFormId} variant="primary" disabled={working || !allocationCanSave}>{t('save')}</Button></>}>
      <ModalFocusScope busy={working} initialFocusId={allocationFocusId}>
        {modalError}
        <p className="fp-note">{t('allocationHelp')}</p>
        <form id={allocationFormId} className="fp-modal-form" onSubmit={event => {
          event.preventDefault()
          if (!allocationCanSave || working) return
          void run(() => api.allocationUpdate({
            accountId: allocationForm.accountId,
            allocations: allocationForm.items.map(item => ({
              id: item.holding.id,
              version: item.holding.version,
              targetRatio: item.targetRatio,
            })),
          }, lifetime.current.signal), closeModal)
        }}>
          <div className="fp-allocation-editor">{allocationForm.items.map((item, index) => {
            const inputId = index === 0 ? allocationFocusId : `${allocationFocusId}-${index}`
            return <label className="fp-allocation-row" key={item.holding.id} htmlFor={inputId}>
              <span><strong>{item.fund.name}</strong><small>{item.fund.code}</small></span>
              <span className="fp-percent-input"><Input id={inputId} type="number" min="0" max="100" step="0.01"
                required disabled={working} inputMode="decimal" aria-label={`${item.fund.name} ${t('targetRatio')}`}
                value={item.targetRatio} onChange={event => setAllocationForm(current => current ? {
                  ...current,
                  items: current.items.map((entry, itemIndex) => itemIndex === index
                    ? { ...entry, targetRatio: event.target.value } : entry),
                } : current)} /><span aria-hidden="true">%</span></span>
            </label>
          })}</div>
          <div className="fp-allocation-progress" aria-live="polite">
            <span>{t('configured')} <strong>{allocationForm.items.filter(item => item.targetRatio !== '').length}/{allocationForm.items.length}</strong></span>
            <span>{t('targetTotal')} <strong>{allocationTotal.toFixed(2)}%</strong></span>
            <span>{t('remaining')} <strong>{new Decimal(100).sub(allocationTotal).toFixed(2)}%</strong></span>
          </div>
          {!allocationCanSave && <p className="fp-warning">{t(allocationValuesValid ? 'allocationInvalid' : 'allocationUnconfigured')}</p>}
          <p className="fp-note">{t('allocationDisclaimer')}</p>
        </form>
      </ModalFocusScope>
    </Modal>}
    {modal === 'import' && <Modal open title={t('importReady')} closeLabel={t('close')}
      onClose={() => { if (!working) closeModal() }}
      footer={<><Button variant="outline" disabled={working} onClick={closeModal}>{t('cancel')}</Button>
        {!preview && <Button variant="outline" disabled={working} onClick={() => fileInputRef.current?.click()}>{t('chooseFile')}</Button>}
        {preview && <Button disabled={working || (!replace && preview.conflicts.length > 0)} variant="primary"
          onClick={() => void run(() => api.importData({ json: importFile!.json, previewToken: preview.previewToken, mode: replace ? 'replace' : 'merge' }, lifetime.current.signal),
            () => { closeModal(); setForm(null); selectAccount('') })}>
          {t('confirm')} · {t(replace ? 'replace' : 'merge')}</Button>}</>}>
      <ModalFocusScope busy={working}>
        {modalError}
        <p className="fp-filename">{importFile?.name}</p><p className="fp-note">{t('privacy')}</p>
        {!preview && working && <p role="status" className="fp-note">{t('readingFile')}</p>}
        {preview && <>
          <div className="fp-import-summary"><div><span>{t('accounts')}</span><strong>{preview.accounts}</strong></div><div><span>{t('holdings')}</span><strong>{preview.holdings}</strong></div></div>
          <div className="fp-switch-row"><span>{t('replace')}</span>
            <Switch checked={replace} disabled={working} label={t('replace')} onChange={setReplace} />
          </div>
          <p className="fp-note">{t('conflict')}: {preview.conflicts.join(', ') || t('noConflicts')}</p>
          {replace && <p className="fp-warning">{t('importWarning')}</p>}
        </>}
      </ModalFocusScope>
    </Modal>}
    {deleting && <Modal open title={t('deleteQuestion')} closeLabel={t('cancel')}
      onClose={() => { if (!working) { setDeleting(null); setLocalError(null) } }}
      description={deleting.label} footer={<Button variant="primary" disabled={working}
        onClick={() => void run(deleting.action, () => setDeleting(null))}>{t('delete')}</Button>}>
      <ModalFocusScope alert busy={working}>{modalError}</ModalFocusScope>
    </Modal>}
  </section>
}
