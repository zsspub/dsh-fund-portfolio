/** Portfolio view with explicit dated coverage and user-confirmed mutations. */
import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import type { FormEvent } from 'react'
import { Decimal } from 'decimal.js'
import type { PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import type {
  Account, AccountId, Fund, Holding, HoldingView, ImportPreview,
} from '../types.ts'
import type { FundApi } from './index.ts'
import { PortfolioController } from './controller.ts'
import type { PortfolioKey } from './locales.ts'
import { styles } from './styles.ts'

type Translate = (key: PortfolioKey) => string
export interface PanelInjected { api: FundApi }
export interface TriggerInjected { openPanel: () => void }
type PanelProps = PropsLocale<'fundPortfolio'> & PropsRuntime<'sidebar.right.pane.tab'> & PanelInjected
type TriggerProps = PropsLocale<'fundPortfolio'> & PropsRuntime<'sidebar.footer.action'> & TriggerInjected

function errorMessage(error: unknown, t: Translate): string {
  if (typeof error === 'object' && error !== null && 'code' in error
    && error.code === 'fund-portfolio/duplicate-holding') return t('duplicateHolding')
  return error instanceof Error ? error.message : String(error)
}

function amount(value: string | null, signed = false): string {
  if (value === null) return '—'
  const decimal = new Decimal(value)
  return `${signed && decimal.gt(0) ? '+' : ''}${decimal.toFixed(2)}`
}

function tone(value: string | null): string {
  if (value === null || new Decimal(value).isZero()) return 'fp-number'
  return new Decimal(value).gt(0) ? 'fp-number fp-positive' : 'fp-number fp-negative'
}

export function PortfolioTrigger({ t, wide, openPanel }: TriggerProps) {
  return <button className="fp-trigger" aria-label={t('title')} onClick={openPanel}>
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M4 20h16M6 16V9m6 7V4m6 12v-6" /></svg>
    {wide && <span>{t('title')}</span>}
  </button>
}

function HoldingCard({ row, t, edit, remove }: { row: HoldingView; t: Translate; edit: () => void; remove: () => void }) {
  const money = row.fund.kind === 'money'
  const nav = row.quote.navs[0]
  const estimate = row.quote.estimate
  return <article className="fp-card">
    <header><div><h3>{row.fund.name}</h3><p className="fp-sub">{row.fund.code} · {row.accountName} · {t(money ? 'money' : row.fund.kind === 'qdii' ? 'qdii' : 'navFund')}</p></div>
      <div className="fp-line"><button aria-label={`${t('edit')} ${row.fund.name}`} onClick={edit}>{t('edit')}</button><button aria-label={`${t('delete')} ${row.fund.name}`} onClick={remove}>{t('delete')}</button></div></header>
    <div className="fp-pair">
      <div><span className="fp-muted">{t('today')} · {row.today ? t(row.today.kind) : t('pending')}</span><strong className={tone(row.today?.amount ?? null)}>{amount(row.today?.amount ?? null, true)}</strong></div>
      <div><span className="fp-muted">{t(money ? 'moneyYield' : 'nav')} · {nav?.date ?? t('noData')}</span><strong className="fp-number">{nav?.value ?? t('noData')}</strong></div>
      {!money && <><div><span className="fp-muted">{t('floating')}</span><strong className={tone(row.floatingProfit)}>{amount(row.floatingProfit, true)}</strong></div>
        <div><span className="fp-muted">{t('estimate')}</span><strong className="fp-number">{estimate?.value ?? t('noData')}</strong><span className="fp-muted">{estimate ? `${estimate.date} ${estimate.time}` : ''}</span></div></>}
    </div>
    {row.issue && <p className="fp-warning">{t(row.issue)}</p>}
    {row.quote.error && <p className="fp-warning">{t('stale')}: {row.quote.error}</p>}
    <details className="fp-details"><summary>{t('details')}</summary><dl>
      <dt>{t('shares')}</dt><dd>{row.holding.shares}</dd><dt>{t('costPrice')}</dt><dd>{row.holding.costPrice}</dd>
      <dt>{t('market')}</dt><dd>{amount(row.marketValue)}</dd><dt>{t('priceDate')}</dt><dd>{row.priceDate ?? t('noData')}</dd>
      <dt>{t('recent')}</dt><dd className={tone(row.confirmed?.amount ?? null)}>{amount(row.confirmed?.amount ?? null, true)} · {row.confirmed?.date ?? t('noData')}</dd>
      {!money && <><dt>{t('referenceDate')}</dt><dd>{estimate?.referenceDate ?? t('noData')}</dd>
        <dt>{t('reference')}</dt><dd>{amount(row.referenceChange, true)}</dd>
        <dt>{t('rate')}</dt><dd>{row.floatingRate === null ? t('zeroCost') : `${amount(row.floatingRate, true)}%`}</dd></>}
      {money && <><dt>{t('annual')}</dt><dd>{nav?.annualYield ?? t('noData')}%</dd></>}
      <dt>{t('fetched')}</dt><dd>{row.quote.navFetchedAt ?? t('noData')}</dd>
    </dl></details>
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
  const [section, setSection] = useState<'holdings' | 'accounts' | 'backup'>('holdings')
  const [form, setForm] = useState<{ holding?: Holding; accountId: string; code: string; shares: string; costPrice: string; fund: Fund | null } | null>(null)
  const [accountForm, setAccountForm] = useState<{ account?: Account; name: string }>({ name: '' })
  const [deleting, setDeleting] = useState<{ label: string; action: () => Promise<unknown> } | null>(null)
  const [json, setJson] = useState('')
  const [preview, setPreview] = useState<ImportPreview | null>(null)
  const [replace, setReplace] = useState(false)
  const confirmRef = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    const onVisibility = () => setDocumentVisible(document.visibilityState !== 'hidden')
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [])
  useEffect(() => { controller.setVisible(tab.visible && documentVisible) }, [controller, tab.visible, documentVisible])
  useEffect(() => () => { lifetime.current.abort(); controller.dispose() }, [controller])
  useEffect(() => { if (deleting) confirmRef.current?.focus() }, [deleting])
  const run = async (operation: () => Promise<unknown>, done?: () => void) => {
    setWorking(true)
    setLocalError(null)
    try {
      await operation()
      if (lifetime.current.signal.aborted) return
      done?.()
      await controller.refresh()
    } catch (failure) {
      if (!lifetime.current.signal.aborted) setLocalError(errorMessage(failure, t))
    } finally { if (!lifetime.current.signal.aborted) setWorking(false) }
  }
  const saveHolding = (event: FormEvent) => {
    event.preventDefault()
    if (!form?.fund) return
    const input = { accountId: form.accountId as AccountId, fundCode: form.fund.code, shares: form.shares, costPrice: form.costPrice }
    void run(() => form.holding
      ? api.holdingUpdate({ ...input, id: form.holding.id, version: form.holding.version }, lifetime.current.signal)
      : api.holdingAdd(input, lifetime.current.signal), () => setForm(null))
  }
  const exportBackup = () => void run(async () => {
    const file = await api.exportData({}, lifetime.current.signal)
    const url = URL.createObjectURL(new Blob([file.json], { type: 'application/json' }))
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = file.filename
    anchor.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  })
  return <section className="fp" aria-label={t('title')}>
    <style>{styles}</style>
    <header className="fp-header"><div><h2>{t('title')}</h2><p className="fp-sub">{t('subtitle')}</p></div>
      <button disabled={busy} onClick={() => void controller.refresh(true)}>{t(busy ? 'refreshing' : 'refresh')}</button></header>
    {(localError || error) && <p role="alert" className="fp-error">{t('error')}: {localError ?? error}</p>}
    {data && <>
      <div className="fp-hero"><span className="fp-muted">{t('today')} · {data.date}{data.missingCount > 0 && ` · ${t('partial')}`}</span>
        <div className={`fp-big ${tone(data.todayTotal)}`}>{amount(data.todayTotal, true)}</div>
        <div className="fp-split"><div>{t('confirmed')} · {data.confirmedCount}<strong>{amount(data.confirmedToday, true)}</strong></div>
          <div>{t('estimated')} · {data.estimatedCount}<strong>{amount(data.estimatedToday, true)}</strong></div>
          <div>{t('missing')}<strong>{data.missingCount}</strong></div></div></div>
      <div className="fp-metrics"><div><span className="fp-muted">{t('market')} · {data.marketCovered}/{data.holdings.length}</span><strong>{amount(data.marketValue)}</strong></div>
        <div><span className="fp-muted">{t('cost')}</span><strong>{amount(data.cost)}</strong></div>
        <div><span className="fp-muted">{t('floating')} · {data.floatingCovered}/{data.holdings.length}</span><strong className={tone(data.floatingProfit)}>{amount(data.floatingProfit, true)}</strong></div></div>
    </>}
    <div className="fp-toolbar"><select aria-label={t('account')} value={filter} onChange={event => {
      setFilter(event.target.value); controller.select(event.target.value ? { accountId: event.target.value as AccountId } : {})
    }}><option value="">{t('allAccounts')}</option>{data?.accounts.map(account => <option key={account.id} value={account.id}>{account.name}</option>)}</select>
      <div><button onClick={() => setSection(section === 'accounts' ? 'holdings' : 'accounts')}>{t('accounts')}</button><button onClick={() => setSection(section === 'backup' ? 'holdings' : 'backup')}>{t('backup')}</button>
        <button className="fp-primary" onClick={() => {
          setSection('holdings'); setForm({ accountId: filter || data?.accounts[0]?.id || '', code: '', shares: '', costPrice: '', fund: null })
        }}>{t('addHolding')}</button></div></div>
    {deleting && <div role="alertdialog" aria-modal="false" aria-label={t('deleteQuestion')} className="fp-form">
      <h3>{t('deleteQuestion')}</h3><p className="fp-note">{deleting.label}</p><div className="fp-actions">
        <button ref={confirmRef} onClick={() => setDeleting(null)}>{t('cancel')}</button>
        <button className="fp-danger" disabled={working} onClick={() => void run(deleting.action, () => setDeleting(null))}>{t('delete')}</button>
      </div></div>}
    {section === 'accounts' && <div className="fp-form">
      <h3>{t('accounts')}</h3>
      {data?.accounts.map(account => <div className="fp-line fp-account" key={account.id}><span>{account.name}</span><div className="fp-line">
        <button onClick={() => setAccountForm({ account, name: account.name })}>{t('rename')}</button>
        <button onClick={() => setDeleting({ label: account.name, action: () => api.accountDelete({ id: account.id, version: account.version }, lifetime.current.signal) })}>{t('delete')}</button>
      </div></div>)}
      <form onSubmit={event => { event.preventDefault(); void run(() => accountForm.account
        ? api.accountUpdate({ ...accountForm.account, name: accountForm.name }, lifetime.current.signal)
        : api.accountCreate({ name: accountForm.name }, lifetime.current.signal), () => setAccountForm({ name: '' })) }}>
        <label>{t('accountName')}<input required maxLength={100} value={accountForm.name} onChange={event => setAccountForm({ ...accountForm, name: event.target.value })} /></label>
        <div className="fp-actions"><button type="button" onClick={() => setAccountForm({ name: '' })}>{t('cancel')}</button><button className="fp-primary" disabled={working}>{t(accountForm.account ? 'save' : 'addAccount')}</button></div>
      </form></div>}
    {section === 'backup' && <div className="fp-form"><h3>{t('backup')}</h3><p className="fp-note">{t('privacy')}</p>
      <button onClick={exportBackup} disabled={working}>{t('export')}</button>
      <label>{t('import')}<textarea value={json} onChange={event => { setJson(event.target.value); setPreview(null); setReplace(false) }} /></label>
      <button disabled={working || !json} onClick={() => void run(async () => setPreview(await api.previewImport({ json }, lifetime.current.signal)))}>{t('preview')}</button>
      {preview && <><p className="fp-note">{t('importReady')}: {preview.accounts} {t('accounts')} · {preview.holdings} {t('holdings')}</p>
        <p className="fp-note">{t('conflict')}: {preview.conflicts.join(', ') || t('noConflicts')}</p>
        <label><input type="checkbox" style={{ width: 'auto' }} checked={replace} onChange={event => setReplace(event.target.checked)} /> {t('replace')}</label>
        {replace && <p className="fp-warning">{t('importWarning')}</p>}
        <div className="fp-actions"><button disabled={working || (!replace && preview.conflicts.length > 0)} className={replace ? 'fp-danger' : 'fp-primary'}
          onClick={() => void run(() => api.importData({ json, previewToken: preview.previewToken, mode: replace ? 'replace' : 'merge' }, lifetime.current.signal), () => { setJson(''); setPreview(null); setFilter(''); controller.select({}) })}>
          {t('confirm')} · {t(replace ? 'replace' : 'merge')}</button></div></>}
    </div>}
    {form && section === 'holdings' && <form className="fp-form" onSubmit={saveHolding}><h3>{t(form.holding ? 'edit' : 'addHolding')}</h3>
      {!data?.accounts.length && <p className="fp-warning">{t('chooseAccount')}</p>}
      <label>{t('account')}<select required value={form.accountId} onChange={event => setForm({ ...form, accountId: event.target.value })}><option value="">{t('account')}</option>{data?.accounts.map(account => <option key={account.id} value={account.id}>{account.name}</option>)}</select></label>
      <label>{t('code')}<input required pattern="[0-9]{6}" maxLength={6} value={form.code} onChange={event => setForm({ ...form, code: event.target.value, fund: null })} /></label>
      <button type="button" disabled={working || !/^\d{6}$/.test(form.code)} onClick={() => {
        const code = form.code
        void run(async () => {
          const fund = await api.lookup({ code }, lifetime.current.signal)
          setForm(current => current?.code === code ? { ...current, fund, costPrice: fund.kind === 'money' ? '1' : current.costPrice } : current)
        })
      }}>{t('lookup')}</button>
      {form.fund && <p className="fp-note">{t('validated')}: {form.fund.name} · {form.fund.code}</p>}
      <label>{t('shares')}<input required inputMode="decimal" value={form.shares} onChange={event => setForm({ ...form, shares: event.target.value })} /></label>
      <label>{t('costPrice')}<input required inputMode="decimal" readOnly={form.fund?.kind === 'money'} value={form.costPrice} onChange={event => setForm({ ...form, costPrice: event.target.value })} /></label>
      <div className="fp-actions"><button type="button" onClick={() => setForm(null)}>{t('cancel')}</button><button className="fp-primary" disabled={working || !form.fund || !form.accountId}>{t('confirmFund')}</button></div>
    </form>}
    {!data && <p className="fp-note">{t('loading')}</p>}
    {data?.holdings.length === 0 && <div className="fp-empty"><h3>{t('empty')}</h3><p>{t('emptyHint')}</p></div>}
    <div className="fp-list">{data?.holdings.map(row => <HoldingCard key={row.holding.id} row={row} t={t}
      edit={() => { setSection('holdings'); setForm({ holding: row.holding, accountId: row.holding.accountId, code: row.fund.code, shares: row.holding.shares, costPrice: row.holding.costPrice, fund: row.fund }) }}
      remove={() => setDeleting({ label: `${row.fund.name} · ${row.accountName} · ${row.holding.shares} · ${row.holding.costPrice}`, action: () => api.holdingDelete({ id: row.holding.id, version: row.holding.version }, lifetime.current.signal) })} />)}</div>
    <footer><p className="fp-note">{t('disclaimer')}</p><p className="fp-muted">{t('source')}</p></footer>
  </section>
}
