import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/** Portfolio view with explicit dated coverage and user-confirmed mutations. */
import { useEffect, useId, useRef, useState, useSyncExternalStore } from 'react';
import { Decimal } from 'decimal.js';
import ChartNoAxesColumnIncreasing from 'lucide-react/dist/esm/icons/chart-no-axes-column-increasing.mjs';
import { Button, IconChevronRightOutline14, Input } from '@deepseek-ai/dsh-client-ui-primitives';
import { PortfolioController } from "./controller.js";
import { BackupMenu, PortfolioModal } from "./overlays.js";
import { styles, triggerStyles } from "./styles.js";
function errorMessage(error, t) {
    if (typeof error === 'object' && error !== null && 'code' in error
        && error.code === 'fund-portfolio/duplicate-holding')
        return t('duplicateHolding');
    return error instanceof Error ? error.message : String(error);
}
function amount(value, signed = false) {
    if (value === null)
        return '—';
    const decimal = new Decimal(value);
    const [integer, fraction] = decimal.toFixed(2).split('.');
    return `${signed && decimal.gt(0) ? '+' : ''}${integer.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}.${fraction}`;
}
function tone(value) {
    if (value === null || new Decimal(value).isZero())
        return 'fp-number';
    return new Decimal(value).gt(0) ? 'fp-number fp-positive' : 'fp-number fp-negative';
}
export function PortfolioTrigger({ t, wide, openPanel }) {
    return _jsxs(_Fragment, { children: [_jsx("style", { children: triggerStyles }), _jsxs(Button, { className: "fp-trigger", "aria-label": t('sidebarLabel'), title: t('sidebarLabel'), "data-wide": wide, onClick: openPanel, children: [_jsx(ChartNoAxesColumnIncreasing, { size: wide ? 16 : 18, strokeWidth: 1.6, "aria-hidden": "true" }), wide && _jsx("span", { children: t('sidebarLabel') })] })] });
}
function HoldingCard({ row, t, edit, remove }) {
    const money = row.fund.kind === 'money';
    const nav = row.quote.navs[0];
    const estimate = row.quote.estimate;
    const estimateUnavailable = !money && !estimate && row.quote.error === 'Estimate unavailable';
    const issue = row.issue && row.issue !== 'pending' ? row.issue : null;
    const quoteNotice = issue ? t(issue)
        : estimateUnavailable ? t(row.today ? 'estimateUnavailable' : 'estimatePending')
            : row.quote.error ? t(nav || estimate ? 'stale' : 'unavailable') : null;
    return _jsxs("article", { className: "fp-card", children: [_jsxs("div", { className: "fp-card-main", children: [_jsxs("header", { className: "fp-card-heading", children: [_jsx("h3", { children: row.fund.name }), _jsxs("p", { className: "fp-sub fp-card-meta", children: [_jsxs("span", { children: [row.fund.code, " \u00B7 ", row.accountName] }), _jsx("span", { className: "fp-fund-kind", children: t(money ? 'money' : row.fund.kind === 'qdii' ? 'qdii' : 'navFund') })] })] }), _jsxs("div", { className: "fp-pair", children: [_jsxs("div", { children: [_jsx("span", { className: "fp-muted", children: t('today') }), _jsx("strong", { className: tone(row.today?.amount ?? null), children: amount(row.today?.amount ?? null, true) }), _jsx("span", { className: "fp-status", "data-kind": row.today?.kind ?? 'pending', children: row.today ? t(row.today.kind) : t('pending') })] }), _jsxs("div", { children: [_jsx("span", { className: "fp-muted", children: t(money ? 'annual' : 'floating') }), _jsx("strong", { className: money ? 'fp-number' : tone(row.floatingProfit), children: money ? (nav?.annualYield ? `${nav.annualYield}%` : t('noData')) : amount(row.floatingProfit, true) }), !money && _jsx("span", { className: `fp-caption ${tone(row.floatingRate)}`, children: row.floatingRate === null ? t('zeroCost') : `${amount(row.floatingRate, true)}%` })] }), _jsxs("div", { children: [_jsx("span", { className: "fp-muted", children: t('market') }), _jsx("strong", { className: "fp-number", children: amount(row.marketValue) }), _jsx("span", { className: "fp-caption", title: t('priceDate'), children: row.priceDate ?? t('noData') })] })] })] }), quoteNotice && _jsxs("p", { className: "fp-quote-note", "data-warning": Boolean(issue || (row.quote.error && !estimateUnavailable)), children: [_jsx("span", { className: "fp-note-label", children: t('quoteStatus') }), _jsx("span", { children: quoteNotice })] }), _jsxs("div", { className: "fp-card-footer", children: [_jsxs("details", { className: "fp-details", children: [_jsxs("summary", { children: [_jsx("span", { className: "fp-details-icon", "aria-hidden": "true", children: _jsx(IconChevronRightOutline14, {}) }), _jsx("span", { children: t('details') })] }), _jsxs("dl", { children: [row.quote.error && _jsxs(_Fragment, { children: [_jsx("dt", { children: t('quoteDetails') }), _jsx("dd", { children: estimateUnavailable ? t('estimateUnavailable') : row.quote.error })] }), _jsx("dt", { children: t(money ? 'moneyYield' : 'nav') }), _jsxs("dd", { children: [nav?.value ?? t('noData'), " \u00B7 ", nav?.date ?? t('noData')] }), !money && _jsxs(_Fragment, { children: [_jsx("dt", { children: t('estimate') }), _jsx("dd", { children: estimate?.value ?? t('noData') }), _jsx("dt", { children: t('estimateTime') }), _jsx("dd", { children: estimate ? `${estimate.date} ${estimate.time}` : t('noData') })] }), _jsx("dt", { children: t('shares') }), _jsx("dd", { children: row.holding.shares }), _jsx("dt", { children: t('costPrice') }), _jsx("dd", { children: row.holding.costPrice }), _jsx("dt", { children: t('market') }), _jsx("dd", { children: amount(row.marketValue) }), _jsx("dt", { children: t('priceDate') }), _jsx("dd", { children: row.priceDate ?? t('noData') }), _jsx("dt", { children: t('recent') }), _jsxs("dd", { className: tone(row.confirmed?.amount ?? null), children: [amount(row.confirmed?.amount ?? null, true), " \u00B7 ", row.confirmed?.date ?? t('noData')] }), !money && _jsxs(_Fragment, { children: [_jsx("dt", { children: t('referenceDate') }), _jsx("dd", { children: estimate?.referenceDate ?? t('noData') }), _jsx("dt", { children: t('reference') }), _jsx("dd", { children: amount(row.referenceChange, true) }), _jsx("dt", { children: t('rate') }), _jsx("dd", { children: row.floatingRate === null ? t('zeroCost') : `${amount(row.floatingRate, true)}%` })] }), money && _jsxs(_Fragment, { children: [_jsx("dt", { children: t('annual') }), _jsx("dd", { children: nav?.annualYield ? `${nav.annualYield}%` : t('noData') })] }), _jsx("dt", { children: t('fetched') }), _jsx("dd", { children: row.quote.navFetchedAt ?? t('noData') })] })] }), _jsxs("div", { className: "fp-card-actions", children: [_jsx(Button, { size: "sm", "aria-label": `${t('edit')} ${row.fund.name}`, onClick: edit, children: t('edit') }), _jsx(Button, { size: "sm", className: "fp-delete", "aria-label": `${t('delete')} ${row.fund.name}`, onClick: remove, children: t('delete') })] })] })] });
}
export function PortfolioPanel({ t, api, useTabInfo }) {
    const [controller] = useState(() => new PortfolioController(api));
    const { data, busy, error } = useSyncExternalStore(controller.subscribe, controller.getSnapshot);
    const { tab } = useTabInfo();
    const lifetime = useRef(new AbortController());
    const [documentVisible, setDocumentVisible] = useState(document.visibilityState !== 'hidden');
    const [filter, setFilter] = useState('');
    const [localError, setLocalError] = useState(null);
    const [working, setWorking] = useState(false);
    const [modal, setModal] = useState(null);
    const [form, setForm] = useState(null);
    const [accountForm, setAccountForm] = useState({ name: '' });
    const [deleting, setDeleting] = useState(null);
    const [importFile, setImportFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [replace, setReplace] = useState(false);
    const fileInputRef = useRef(null);
    const accountNameId = useId();
    const tabsId = useId();
    const holdingFormFocusId = useId();
    useEffect(() => {
        const onVisibility = () => setDocumentVisible(document.visibilityState !== 'hidden');
        document.addEventListener('visibilitychange', onVisibility);
        return () => document.removeEventListener('visibilitychange', onVisibility);
    }, []);
    useEffect(() => { controller.setVisible(tab.visible && documentVisible); }, [controller, tab.visible, documentVisible]);
    useEffect(() => () => { lifetime.current.abort(); controller.dispose(); }, [controller]);
    useEffect(() => {
        if (data && filter && !data.accounts.some(account => account.id === filter)) {
            setFilter('');
            controller.select({});
        }
    }, [data, filter, controller]);
    const openHoldingForm = (next) => {
        setLocalError(null);
        setForm(next);
    };
    const closeHoldingForm = () => {
        setForm(null);
        setLocalError(null);
    };
    const run = async (operation, done) => {
        setWorking(true);
        setLocalError(null);
        try {
            await operation();
            if (lifetime.current.signal.aborted)
                return;
            done?.();
            await controller.refresh();
        }
        catch (failure) {
            if (!lifetime.current.signal.aborted)
                setLocalError(errorMessage(failure, t));
        }
        finally {
            if (!lifetime.current.signal.aborted)
                setWorking(false);
        }
    };
    const saveHolding = (event) => {
        event.preventDefault();
        if (working || !form?.fund || !form.accountId)
            return;
        const input = { accountId: form.accountId, fundCode: form.fund.code, shares: form.shares, costPrice: form.costPrice };
        void run(() => form.holding
            ? api.holdingUpdate({ ...input, id: form.holding.id, version: form.holding.version }, lifetime.current.signal)
            : api.holdingAdd(input, lifetime.current.signal), closeHoldingForm);
    };
    const exportBackup = () => void run(async () => {
        const file = await api.exportData({}, lifetime.current.signal);
        if (lifetime.current.signal.aborted)
            return;
        const url = URL.createObjectURL(new Blob([file.json], { type: 'application/json' }));
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = file.filename;
        anchor.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
    });
    const closeModal = () => {
        setModal(null);
        setLocalError(null);
        setPreview(null);
        setImportFile(null);
        setReplace(false);
        setAccountForm({ name: '' });
    };
    const importBackup = (file) => {
        setModal('import');
        setImportFile({ name: file.name, json: '' });
        setPreview(null);
        setReplace(false);
        void run(async () => {
            if (!/\.json$/i.test(file.name))
                throw new Error(t('jsonFileOnly'));
            if (file.size > 20 * 1024 * 1024)
                throw new Error(t('fileTooLarge'));
            const json = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(String(reader.result).replace(/^\uFEFF/, ''));
                reader.onerror = () => reject(new Error(t('fileReadError')));
                reader.readAsText(file);
            });
            try {
                JSON.parse(json);
            }
            catch {
                throw new Error(t('invalidJson'));
            }
            if (lifetime.current.signal.aborted)
                return;
            const result = await api.previewImport({ json }, lifetime.current.signal);
            if (lifetime.current.signal.aborted)
                return;
            setImportFile({ name: file.name, json });
            setPreview(result);
        });
    };
    const accounts = [{ id: '', name: t('allAccounts') }, ...(data?.accounts ?? [])];
    const selectAccount = (id) => {
        setFilter(id);
        controller.select(id ? { accountId: id } : {});
    };
    const modalError = localError && _jsxs("p", { role: "alert", className: "fp-error", children: [t('error'), ": ", localError] });
    return _jsxs("section", { className: "fp", "aria-label": t('title'), children: [_jsx("style", { children: styles }), _jsxs("header", { className: "fp-header", children: [_jsxs("div", { className: "fp-heading", children: [_jsx("h2", { children: t('title') }), _jsx("p", { className: "fp-sub", children: t('subtitle') })] }), _jsx(Button, { variant: "outline", className: "fp-refresh", "aria-busy": busy, disabled: busy, onClick: () => void controller.refresh(true), children: t(busy ? 'refreshing' : 'refresh') })] }), _jsxs("div", { className: "fp-body", children: [(error || (localError && !modal && !deleting && !form)) && _jsxs("p", { role: "alert", className: "fp-error", children: [t('error'), ": ", error ?? localError] }), _jsx("div", { className: "fp-controls", children: _jsxs("div", { className: "fp-toolbar", children: [_jsx("div", { className: "fp-tabs", role: "tablist", "aria-label": t('account'), children: accounts.map((account, index) => _jsx(Button, { role: "tab", className: "fp-tab", id: `${tabsId}-tab-${account.id || 'all'}`, "aria-controls": `${tabsId}-panel`, "aria-selected": filter === account.id, tabIndex: filter === account.id ? 0 : -1, "data-active": filter === account.id, onClick: () => selectAccount(account.id), onKeyDown: event => {
                                            if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key))
                                                return;
                                            event.preventDefault();
                                            const next = event.key === 'Home' ? 0 : event.key === 'End' ? accounts.length - 1
                                                : (index + (event.key === 'ArrowRight' ? 1 : -1) + accounts.length) % accounts.length;
                                            const buttons = event.currentTarget.parentElement.querySelectorAll('[role=tab]');
                                            buttons[next]?.focus();
                                            buttons[next]?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
                                            selectAccount(accounts[next].id);
                                        }, children: account.name }, account.id)) }), _jsxs("div", { className: "fp-toolbar-actions", children: [_jsx(Button, { variant: "outline", disabled: working, onClick: () => { setLocalError(null); setModal('accounts'); }, children: t('accounts') }), _jsx(BackupMenu, { t: t, disabled: working, onImport: () => fileInputRef.current?.click(), onExport: exportBackup }), _jsx(Button, { variant: "primary", className: "fp-add-holding", "aria-disabled": working, onClick: () => {
                                                if (working)
                                                    return;
                                                openHoldingForm({ accountId: filter || data?.accounts[0]?.id || '', code: '', shares: '', costPrice: '', fund: null });
                                            }, children: t('addHolding') })] })] }) }), _jsx("input", { ref: fileInputRef, type: "file", hidden: true, accept: ".json,application/json", "aria-label": t('import'), onChange: event => {
                            const file = event.currentTarget.files?.[0];
                            event.currentTarget.value = '';
                            if (file)
                                importBackup(file);
                        } }), _jsxs("div", { className: "fp-content", role: "tabpanel", id: `${tabsId}-panel`, "aria-labelledby": `${tabsId}-tab-${filter || 'all'}`, "aria-busy": busy, tabIndex: 0, children: [data && _jsxs("div", { className: "fp-overview", children: [_jsxs("div", { className: "fp-hero", children: [_jsxs("div", { className: "fp-total", children: [_jsxs("div", { className: "fp-total-label", children: [_jsx("span", { children: t('today') }), _jsx("time", { className: "fp-muted", children: data.date }), data.missingCount > 0 && _jsx("span", { className: "fp-badge", children: t('partial') })] }), _jsxs("div", { className: `fp-big ${tone(data.todayTotal)}`, children: [amount(data.todayTotal, true), _jsx("span", { className: "fp-currency", children: "CNY" })] })] }), _jsxs("div", { className: "fp-split", children: [_jsxs("div", { children: [_jsxs("span", { children: [t('confirmed'), " \u00B7 ", data.confirmedCount] }), _jsx("strong", { className: tone(data.confirmedToday), children: amount(data.confirmedToday, true) })] }), _jsxs("div", { children: [_jsxs("span", { children: [t('estimated'), " \u00B7 ", data.estimatedCount] }), _jsx("strong", { className: tone(data.estimatedToday), children: amount(data.estimatedToday, true) })] }), _jsxs("div", { children: [t('missing'), _jsx("strong", { children: data.missingCount })] })] })] }), _jsxs("div", { className: "fp-metrics", children: [_jsxs("div", { children: [_jsxs("span", { className: "fp-muted", children: [t('market'), " ", _jsxs("span", { className: "fp-coverage", children: [data.marketCovered, "/", data.holdings.length] })] }), _jsx("strong", { children: amount(data.marketValue) })] }), _jsxs("div", { children: [_jsx("span", { className: "fp-muted", children: t('cost') }), _jsx("strong", { children: amount(data.cost) })] }), _jsxs("div", { children: [_jsxs("span", { className: "fp-muted", children: [t('floating'), " ", _jsxs("span", { className: "fp-coverage", children: [data.floatingCovered, "/", data.holdings.length] })] }), _jsx("strong", { className: tone(data.floatingProfit), children: amount(data.floatingProfit, true) })] })] })] }), !data && _jsx("p", { className: "fp-note", children: t('loading') }), data?.holdings.length === 0 && _jsxs("div", { className: "fp-empty", children: [_jsx("span", { className: "fp-empty-icon", children: _jsx(ChartNoAxesColumnIncreasing, { size: 28, strokeWidth: 1.5, "aria-hidden": "true" }) }), _jsx("h3", { children: t('empty') }), _jsx("p", { children: t('emptyHint') })] }), _jsx("div", { className: "fp-list", children: data?.holdings.map(row => _jsx(HoldingCard, { row: row, t: t, edit: () => openHoldingForm({ holding: row.holding, accountId: row.holding.accountId, code: row.fund.code, shares: row.holding.shares, costPrice: row.holding.costPrice, fund: row.fund }), remove: () => { setLocalError(null); setDeleting({ label: `${row.fund.name} · ${row.accountName} · ${row.holding.shares} · ${row.holding.costPrice}`, action: () => api.holdingDelete({ id: row.holding.id, version: row.holding.version }, lifetime.current.signal) }); } }, row.holding.id)) }), _jsxs("footer", { className: "fp-footer", children: [_jsx("p", { className: "fp-note", children: t('disclaimer') }), _jsx("p", { className: "fp-muted", children: t('source') })] })] })] }), form && _jsxs(PortfolioModal, { title: t(form.holding ? 'editHolding' : 'addHolding'), closeLabel: t('close'), busy: working, onClose: closeHoldingForm, initialFocusId: holdingFormFocusId, children: [modalError, _jsxs("form", { onSubmit: saveHolding, children: [!data?.accounts.length && _jsx("p", { className: "fp-warning", children: t('chooseAccount') }), _jsxs("label", { children: [t('account'), _jsxs("select", { required: true, disabled: working, value: form.accountId, onChange: event => setForm({ ...form, accountId: event.target.value }), children: [_jsx("option", { value: "", children: t('account') }), data?.accounts.map(account => _jsx("option", { value: account.id, children: account.name }, account.id))] })] }), _jsxs("label", { children: [t('code'), _jsx(Input, { id: form.holding ? undefined : holdingFormFocusId, required: true, disabled: working, pattern: "[0-9]{6}", maxLength: 6, inputMode: "numeric", value: form.code, onChange: event => setForm({ ...form, code: event.target.value, fund: null }) })] }), _jsx(Button, { variant: "outline", disabled: working || !/^\d{6}$/.test(form.code), onClick: () => {
                                    const code = form.code;
                                    void run(async () => {
                                        const fund = await api.lookup({ code }, lifetime.current.signal);
                                        if (lifetime.current.signal.aborted)
                                            return;
                                        setForm(current => current?.code === code ? { ...current, fund, costPrice: fund.kind === 'money' ? '1' : current.costPrice } : current);
                                    });
                                }, children: t('lookup') }), form.fund && _jsxs("p", { className: "fp-note", children: [t('validated'), ": ", form.fund.name, " \u00B7 ", form.fund.code] }), _jsxs("label", { children: [t('shares'), _jsx(Input, { id: form.holding ? holdingFormFocusId : undefined, required: true, disabled: working, inputMode: "decimal", value: form.shares, onChange: event => setForm({ ...form, shares: event.target.value }) })] }), _jsxs("label", { children: [t('costPrice'), _jsx(Input, { required: true, disabled: working, inputMode: "decimal", readOnly: form.fund?.kind === 'money', value: form.costPrice, onChange: event => setForm({ ...form, costPrice: event.target.value }) })] }), _jsxs("div", { className: "fp-actions", children: [_jsx(Button, { variant: "outline", disabled: working, onClick: closeHoldingForm, children: t('cancel') }), _jsx(Button, { type: "submit", variant: "primary", disabled: working || !form.fund || !form.accountId, children: t('confirmFund') })] })] })] }), modal === 'accounts' && _jsxs(PortfolioModal, { title: t('accounts'), closeLabel: t('close'), busy: working, onClose: closeModal, children: [!deleting && modalError, _jsx("p", { className: "fp-note", children: t('accountHelp') }), _jsx("div", { className: "fp-account-list", children: data?.accounts.map(account => _jsxs("div", { className: "fp-line fp-account", children: [_jsx("span", { children: account.name }), _jsxs("div", { className: "fp-line", children: [_jsx(Button, { size: "sm", disabled: working, "aria-label": `${t('rename')} ${account.name}`, onClick: () => { setAccountForm({ account, name: account.name }); document.getElementById(accountNameId)?.focus(); }, children: t('rename') }), _jsx(Button, { size: "sm", className: "fp-delete", disabled: working, "aria-label": `${t('delete')} ${account.name}`, onClick: () => {
                                                setLocalError(null);
                                                setDeleting({ label: account.name, action: async () => {
                                                        await api.accountDelete({ id: account.id, version: account.version }, lifetime.current.signal);
                                                        if (filter === account.id)
                                                            selectAccount('');
                                                        if (accountForm.account?.id === account.id)
                                                            setAccountForm({ name: '' });
                                                    } });
                                            }, children: t('delete') })] })] }, account.id)) }), _jsxs("form", { className: "fp-account-form", onSubmit: event => {
                            event.preventDefault();
                            void run(() => accountForm.account
                                ? api.accountUpdate({ ...accountForm.account, name: accountForm.name }, lifetime.current.signal)
                                : api.accountCreate({ name: accountForm.name }, lifetime.current.signal), () => setAccountForm({ name: '' }));
                        }, children: [_jsx("h3", { children: t(accountForm.account ? 'rename' : 'addAccount') }), _jsxs("label", { children: [t('accountName'), _jsx(Input, { id: accountNameId, required: true, maxLength: 100, disabled: working, value: accountForm.name, onChange: event => setAccountForm({ ...accountForm, name: event.target.value }) })] }), _jsxs("div", { className: "fp-actions", children: [accountForm.account && _jsx(Button, { variant: "outline", disabled: working, onClick: () => setAccountForm({ name: '' }), children: t('cancel') }), _jsx(Button, { type: "submit", variant: "primary", disabled: working || !accountForm.name.trim(), children: t(accountForm.account ? 'save' : 'addAccount') })] })] })] }), modal === 'import' && _jsxs(PortfolioModal, { title: t('importReady'), closeLabel: t('close'), busy: working, onClose: closeModal, children: [modalError, _jsx("p", { className: "fp-filename", children: importFile?.name }), _jsx("p", { className: "fp-note", children: t('privacy') }), !preview && working && _jsx("p", { role: "status", className: "fp-note", children: t('readingFile') }), preview && _jsxs(_Fragment, { children: [_jsxs("div", { className: "fp-import-summary", children: [_jsxs("div", { children: [_jsx("span", { children: t('accounts') }), _jsx("strong", { children: preview.accounts })] }), _jsxs("div", { children: [_jsx("span", { children: t('holdings') }), _jsx("strong", { children: preview.holdings })] })] }), _jsxs("p", { className: "fp-note", children: [t('conflict'), ": ", preview.conflicts.join(', ') || t('noConflicts')] }), _jsxs("label", { children: [_jsx("input", { type: "checkbox", disabled: working, checked: replace, onChange: event => setReplace(event.target.checked) }), " ", t('replace')] }), replace && _jsx("p", { className: "fp-warning", children: t('importWarning') })] }), _jsxs("div", { className: "fp-actions", children: [_jsx(Button, { variant: "outline", disabled: working, onClick: closeModal, children: t('cancel') }), !preview && _jsx(Button, { variant: "outline", disabled: working, onClick: () => fileInputRef.current?.click(), children: t('chooseFile') }), preview && _jsxs(Button, { disabled: working || (!replace && preview.conflicts.length > 0), variant: "primary", className: replace ? 'fp-danger' : undefined, onClick: () => void run(() => api.importData({ json: importFile.json, previewToken: preview.previewToken, mode: replace ? 'replace' : 'merge' }, lifetime.current.signal), () => { closeModal(); setForm(null); selectAccount(''); }), children: [t('confirm'), " \u00B7 ", t(replace ? 'replace' : 'merge')] })] })] }), deleting && _jsxs(PortfolioModal, { alert: true, title: t('deleteQuestion'), closeLabel: t('cancel'), busy: working, onClose: () => { setDeleting(null); setLocalError(null); }, children: [modalError, _jsx("p", { className: "fp-note", children: deleting.label }), _jsx("div", { className: "fp-actions", children: _jsx(Button, { variant: "primary", className: "fp-danger", disabled: working, onClick: () => void run(deleting.action, () => setDeleting(null)), children: t('delete') }) })] })] });
}
