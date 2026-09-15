import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/** Portfolio view with explicit dated coverage and user-confirmed mutations. */
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { Decimal } from 'decimal.js';
import { PortfolioController } from "./controller.js";
import { styles } from "./styles.js";
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
    return `${signed && decimal.gt(0) ? '+' : ''}${decimal.toFixed(2)}`;
}
function tone(value) {
    if (value === null || new Decimal(value).isZero())
        return 'fp-number';
    return new Decimal(value).gt(0) ? 'fp-number fp-positive' : 'fp-number fp-negative';
}
export function PortfolioTrigger({ t, wide, openPanel }) {
    return _jsxs("button", { className: "fp-trigger", "aria-label": t('title'), onClick: openPanel, children: [_jsx("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.6", "aria-hidden": "true", children: _jsx("path", { d: "M4 20h16M6 16V9m6 7V4m6 12v-6" }) }), wide && _jsx("span", { children: t('title') })] });
}
function HoldingCard({ row, t, edit, remove }) {
    const money = row.fund.kind === 'money';
    const nav = row.quote.navs[0];
    const estimate = row.quote.estimate;
    return _jsxs("article", { className: "fp-card", children: [_jsxs("header", { children: [_jsxs("div", { children: [_jsx("h3", { children: row.fund.name }), _jsxs("p", { className: "fp-sub", children: [row.fund.code, " \u00B7 ", row.accountName, " \u00B7 ", t(money ? 'money' : row.fund.kind === 'qdii' ? 'qdii' : 'navFund')] })] }), _jsxs("div", { className: "fp-line", children: [_jsx("button", { "aria-label": `${t('edit')} ${row.fund.name}`, onClick: edit, children: t('edit') }), _jsx("button", { "aria-label": `${t('delete')} ${row.fund.name}`, onClick: remove, children: t('delete') })] })] }), _jsxs("div", { className: "fp-pair", children: [_jsxs("div", { children: [_jsxs("span", { className: "fp-muted", children: [t('today'), " \u00B7 ", row.today ? t(row.today.kind) : t('pending')] }), _jsx("strong", { className: tone(row.today?.amount ?? null), children: amount(row.today?.amount ?? null, true) })] }), _jsxs("div", { children: [_jsxs("span", { className: "fp-muted", children: [t(money ? 'moneyYield' : 'nav'), " \u00B7 ", nav?.date ?? t('noData')] }), _jsx("strong", { className: "fp-number", children: nav?.value ?? t('noData') })] }), !money && _jsxs(_Fragment, { children: [_jsxs("div", { children: [_jsx("span", { className: "fp-muted", children: t('floating') }), _jsx("strong", { className: tone(row.floatingProfit), children: amount(row.floatingProfit, true) })] }), _jsxs("div", { children: [_jsx("span", { className: "fp-muted", children: t('estimate') }), _jsx("strong", { className: "fp-number", children: estimate?.value ?? t('noData') }), _jsx("span", { className: "fp-muted", children: estimate ? `${estimate.date} ${estimate.time}` : '' })] })] })] }), row.issue && _jsx("p", { className: "fp-warning", children: t(row.issue) }), row.quote.error && _jsxs("p", { className: "fp-warning", children: [t('stale'), ": ", row.quote.error] }), _jsxs("details", { className: "fp-details", children: [_jsx("summary", { children: t('details') }), _jsxs("dl", { children: [_jsx("dt", { children: t('shares') }), _jsx("dd", { children: row.holding.shares }), _jsx("dt", { children: t('costPrice') }), _jsx("dd", { children: row.holding.costPrice }), _jsx("dt", { children: t('market') }), _jsx("dd", { children: amount(row.marketValue) }), _jsx("dt", { children: t('priceDate') }), _jsx("dd", { children: row.priceDate ?? t('noData') }), _jsx("dt", { children: t('recent') }), _jsxs("dd", { className: tone(row.confirmed?.amount ?? null), children: [amount(row.confirmed?.amount ?? null, true), " \u00B7 ", row.confirmed?.date ?? t('noData')] }), !money && _jsxs(_Fragment, { children: [_jsx("dt", { children: t('referenceDate') }), _jsx("dd", { children: estimate?.referenceDate ?? t('noData') }), _jsx("dt", { children: t('reference') }), _jsx("dd", { children: amount(row.referenceChange, true) }), _jsx("dt", { children: t('rate') }), _jsx("dd", { children: row.floatingRate === null ? t('zeroCost') : `${amount(row.floatingRate, true)}%` })] }), money && _jsxs(_Fragment, { children: [_jsx("dt", { children: t('annual') }), _jsxs("dd", { children: [nav?.annualYield ?? t('noData'), "%"] })] }), _jsx("dt", { children: t('fetched') }), _jsx("dd", { children: row.quote.navFetchedAt ?? t('noData') })] })] })] });
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
    const [section, setSection] = useState('holdings');
    const [form, setForm] = useState(null);
    const [accountForm, setAccountForm] = useState({ name: '' });
    const [deleting, setDeleting] = useState(null);
    const [json, setJson] = useState('');
    const [preview, setPreview] = useState(null);
    const [replace, setReplace] = useState(false);
    const confirmRef = useRef(null);
    useEffect(() => {
        const onVisibility = () => setDocumentVisible(document.visibilityState !== 'hidden');
        document.addEventListener('visibilitychange', onVisibility);
        return () => document.removeEventListener('visibilitychange', onVisibility);
    }, []);
    useEffect(() => { controller.setVisible(tab.visible && documentVisible); }, [controller, tab.visible, documentVisible]);
    useEffect(() => () => { lifetime.current.abort(); controller.dispose(); }, [controller]);
    useEffect(() => { if (deleting)
        confirmRef.current?.focus(); }, [deleting]);
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
        if (!form?.fund)
            return;
        const input = { accountId: form.accountId, fundCode: form.fund.code, shares: form.shares, costPrice: form.costPrice };
        void run(() => form.holding
            ? api.holdingUpdate({ ...input, id: form.holding.id, version: form.holding.version }, lifetime.current.signal)
            : api.holdingAdd(input, lifetime.current.signal), () => setForm(null));
    };
    const exportBackup = () => void run(async () => {
        const file = await api.exportData({}, lifetime.current.signal);
        const url = URL.createObjectURL(new Blob([file.json], { type: 'application/json' }));
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = file.filename;
        anchor.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
    });
    return _jsxs("section", { className: "fp", "aria-label": t('title'), children: [_jsx("style", { children: styles }), _jsxs("header", { className: "fp-header", children: [_jsxs("div", { children: [_jsx("h2", { children: t('title') }), _jsx("p", { className: "fp-sub", children: t('subtitle') })] }), _jsx("button", { disabled: busy, onClick: () => void controller.refresh(true), children: t(busy ? 'refreshing' : 'refresh') })] }), (localError || error) && _jsxs("p", { role: "alert", className: "fp-error", children: [t('error'), ": ", localError ?? error] }), data && _jsxs(_Fragment, { children: [_jsxs("div", { className: "fp-hero", children: [_jsxs("span", { className: "fp-muted", children: [t('today'), " \u00B7 ", data.date, data.missingCount > 0 && ` · ${t('partial')}`] }), _jsx("div", { className: `fp-big ${tone(data.todayTotal)}`, children: amount(data.todayTotal, true) }), _jsxs("div", { className: "fp-split", children: [_jsxs("div", { children: [t('confirmed'), " \u00B7 ", data.confirmedCount, _jsx("strong", { children: amount(data.confirmedToday, true) })] }), _jsxs("div", { children: [t('estimated'), " \u00B7 ", data.estimatedCount, _jsx("strong", { children: amount(data.estimatedToday, true) })] }), _jsxs("div", { children: [t('missing'), _jsx("strong", { children: data.missingCount })] })] })] }), _jsxs("div", { className: "fp-metrics", children: [_jsxs("div", { children: [_jsxs("span", { className: "fp-muted", children: [t('market'), " \u00B7 ", data.marketCovered, "/", data.holdings.length] }), _jsx("strong", { children: amount(data.marketValue) })] }), _jsxs("div", { children: [_jsx("span", { className: "fp-muted", children: t('cost') }), _jsx("strong", { children: amount(data.cost) })] }), _jsxs("div", { children: [_jsxs("span", { className: "fp-muted", children: [t('floating'), " \u00B7 ", data.floatingCovered, "/", data.holdings.length] }), _jsx("strong", { className: tone(data.floatingProfit), children: amount(data.floatingProfit, true) })] })] })] }), _jsxs("div", { className: "fp-toolbar", children: [_jsxs("select", { "aria-label": t('account'), value: filter, onChange: event => {
                            setFilter(event.target.value);
                            controller.select(event.target.value ? { accountId: event.target.value } : {});
                        }, children: [_jsx("option", { value: "", children: t('allAccounts') }), data?.accounts.map(account => _jsx("option", { value: account.id, children: account.name }, account.id))] }), _jsxs("div", { children: [_jsx("button", { onClick: () => setSection(section === 'accounts' ? 'holdings' : 'accounts'), children: t('accounts') }), _jsx("button", { onClick: () => setSection(section === 'backup' ? 'holdings' : 'backup'), children: t('backup') }), _jsx("button", { className: "fp-primary", onClick: () => {
                                    setSection('holdings');
                                    setForm({ accountId: filter || data?.accounts[0]?.id || '', code: '', shares: '', costPrice: '', fund: null });
                                }, children: t('addHolding') })] })] }), deleting && _jsxs("div", { role: "alertdialog", "aria-modal": "false", "aria-label": t('deleteQuestion'), className: "fp-form", children: [_jsx("h3", { children: t('deleteQuestion') }), _jsx("p", { className: "fp-note", children: deleting.label }), _jsxs("div", { className: "fp-actions", children: [_jsx("button", { ref: confirmRef, onClick: () => setDeleting(null), children: t('cancel') }), _jsx("button", { className: "fp-danger", disabled: working, onClick: () => void run(deleting.action, () => setDeleting(null)), children: t('delete') })] })] }), section === 'accounts' && _jsxs("div", { className: "fp-form", children: [_jsx("h3", { children: t('accounts') }), data?.accounts.map(account => _jsxs("div", { className: "fp-line fp-account", children: [_jsx("span", { children: account.name }), _jsxs("div", { className: "fp-line", children: [_jsx("button", { onClick: () => setAccountForm({ account, name: account.name }), children: t('rename') }), _jsx("button", { onClick: () => setDeleting({ label: account.name, action: () => api.accountDelete({ id: account.id, version: account.version }, lifetime.current.signal) }), children: t('delete') })] })] }, account.id)), _jsxs("form", { onSubmit: event => {
                            event.preventDefault();
                            void run(() => accountForm.account
                                ? api.accountUpdate({ ...accountForm.account, name: accountForm.name }, lifetime.current.signal)
                                : api.accountCreate({ name: accountForm.name }, lifetime.current.signal), () => setAccountForm({ name: '' }));
                        }, children: [_jsxs("label", { children: [t('accountName'), _jsx("input", { required: true, maxLength: 100, value: accountForm.name, onChange: event => setAccountForm({ ...accountForm, name: event.target.value }) })] }), _jsxs("div", { className: "fp-actions", children: [_jsx("button", { type: "button", onClick: () => setAccountForm({ name: '' }), children: t('cancel') }), _jsx("button", { className: "fp-primary", disabled: working, children: t(accountForm.account ? 'save' : 'addAccount') })] })] })] }), section === 'backup' && _jsxs("div", { className: "fp-form", children: [_jsx("h3", { children: t('backup') }), _jsx("p", { className: "fp-note", children: t('privacy') }), _jsx("button", { onClick: exportBackup, disabled: working, children: t('export') }), _jsxs("label", { children: [t('import'), _jsx("textarea", { value: json, onChange: event => { setJson(event.target.value); setPreview(null); setReplace(false); } })] }), _jsx("button", { disabled: working || !json, onClick: () => void run(async () => setPreview(await api.previewImport({ json }, lifetime.current.signal))), children: t('preview') }), preview && _jsxs(_Fragment, { children: [_jsxs("p", { className: "fp-note", children: [t('importReady'), ": ", preview.accounts, " ", t('accounts'), " \u00B7 ", preview.holdings, " ", t('holdings')] }), _jsxs("p", { className: "fp-note", children: [t('conflict'), ": ", preview.conflicts.join(', ') || t('noConflicts')] }), _jsxs("label", { children: [_jsx("input", { type: "checkbox", style: { width: 'auto' }, checked: replace, onChange: event => setReplace(event.target.checked) }), " ", t('replace')] }), replace && _jsx("p", { className: "fp-warning", children: t('importWarning') }), _jsx("div", { className: "fp-actions", children: _jsxs("button", { disabled: working || (!replace && preview.conflicts.length > 0), className: replace ? 'fp-danger' : 'fp-primary', onClick: () => void run(() => api.importData({ json, previewToken: preview.previewToken, mode: replace ? 'replace' : 'merge' }, lifetime.current.signal), () => { setJson(''); setPreview(null); setFilter(''); controller.select({}); }), children: [t('confirm'), " \u00B7 ", t(replace ? 'replace' : 'merge')] }) })] })] }), form && section === 'holdings' && _jsxs("form", { className: "fp-form", onSubmit: saveHolding, children: [_jsx("h3", { children: t(form.holding ? 'edit' : 'addHolding') }), !data?.accounts.length && _jsx("p", { className: "fp-warning", children: t('chooseAccount') }), _jsxs("label", { children: [t('account'), _jsxs("select", { required: true, value: form.accountId, onChange: event => setForm({ ...form, accountId: event.target.value }), children: [_jsx("option", { value: "", children: t('account') }), data?.accounts.map(account => _jsx("option", { value: account.id, children: account.name }, account.id))] })] }), _jsxs("label", { children: [t('code'), _jsx("input", { required: true, pattern: "[0-9]{6}", maxLength: 6, value: form.code, onChange: event => setForm({ ...form, code: event.target.value, fund: null }) })] }), _jsx("button", { type: "button", disabled: working || !/^\d{6}$/.test(form.code), onClick: () => {
                            const code = form.code;
                            void run(async () => {
                                const fund = await api.lookup({ code }, lifetime.current.signal);
                                setForm(current => current?.code === code ? { ...current, fund, costPrice: fund.kind === 'money' ? '1' : current.costPrice } : current);
                            });
                        }, children: t('lookup') }), form.fund && _jsxs("p", { className: "fp-note", children: [t('validated'), ": ", form.fund.name, " \u00B7 ", form.fund.code] }), _jsxs("label", { children: [t('shares'), _jsx("input", { required: true, inputMode: "decimal", value: form.shares, onChange: event => setForm({ ...form, shares: event.target.value }) })] }), _jsxs("label", { children: [t('costPrice'), _jsx("input", { required: true, inputMode: "decimal", readOnly: form.fund?.kind === 'money', value: form.costPrice, onChange: event => setForm({ ...form, costPrice: event.target.value }) })] }), _jsxs("div", { className: "fp-actions", children: [_jsx("button", { type: "button", onClick: () => setForm(null), children: t('cancel') }), _jsx("button", { className: "fp-primary", disabled: working || !form.fund || !form.accountId, children: t('confirmFund') })] })] }), !data && _jsx("p", { className: "fp-note", children: t('loading') }), data?.holdings.length === 0 && _jsxs("div", { className: "fp-empty", children: [_jsx("h3", { children: t('empty') }), _jsx("p", { children: t('emptyHint') })] }), _jsx("div", { className: "fp-list", children: data?.holdings.map(row => _jsx(HoldingCard, { row: row, t: t, edit: () => { setSection('holdings'); setForm({ holding: row.holding, accountId: row.holding.accountId, code: row.fund.code, shares: row.holding.shares, costPrice: row.holding.costPrice, fund: row.fund }); }, remove: () => setDeleting({ label: `${row.fund.name} · ${row.accountName} · ${row.holding.shares} · ${row.holding.costPrice}`, action: () => api.holdingDelete({ id: row.holding.id, version: row.holding.version }, lifetime.current.signal) }) }, row.holding.id)) }), _jsxs("footer", { children: [_jsx("p", { className: "fp-note", children: t('disclaimer') }), _jsx("p", { className: "fp-muted", children: t('source') })] })] });
}
