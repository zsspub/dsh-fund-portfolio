import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Button, IconChevronDownOutline14, Menu } from '@deepseek-ai/dsh-client-ui-primitives';
export function ModalFocusScope({ busy, children, alert = false, initialFocusId }) {
    const contentRef = useRef(null);
    useLayoutEffect(() => {
        const dialog = contentRef.current.closest('[aria-modal=true]');
        const closeButton = dialog.querySelector('button');
        closeButton.disabled = busy;
        dialog.setAttribute('aria-busy', String(busy));
    }, [busy]);
    useLayoutEffect(() => {
        const dialog = contentRef.current.closest('[aria-modal=true]');
        dialog.setAttribute('role', alert ? 'alertdialog' : 'dialog');
        dialog.tabIndex = -1;
        const trigger = document.activeElement;
        const overlay = dialog.parentElement;
        const siblings = Array.from(document.body.children).filter((element) => element instanceof HTMLElement && element !== overlay);
        const inertStates = siblings.map(element => element.inert);
        siblings.forEach(element => { element.inert = true; });
        const focusable = () => Array.from(dialog.querySelectorAll('button:not(:disabled), input:not(:disabled), select:not(:disabled), [tabindex="0"]'));
        const initial = initialFocusId ? document.getElementById(initialFocusId) : null;
        (initial ?? focusable()[0] ?? dialog).focus({ preventScroll: true });
        const onKeyDown = (event) => {
            if (event.key !== 'Tab')
                return;
            event.stopPropagation();
            const items = focusable();
            const first = items[0];
            const last = items[items.length - 1];
            if (!first) {
                event.preventDefault();
                dialog.focus();
            }
            else if (event.shiftKey && (document.activeElement === first || document.activeElement === dialog)) {
                event.preventDefault();
                last?.focus();
            }
            else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        };
        dialog.addEventListener('keydown', onKeyDown);
        return () => {
            dialog.removeEventListener('keydown', onKeyDown);
            siblings.forEach((element, index) => { element.inert = inertStates[index]; });
            queueMicrotask(() => {
                if (trigger instanceof HTMLElement && trigger.isConnected)
                    trigger.focus();
            });
        };
    }, [alert, initialFocusId]);
    return _jsx("div", { ref: contentRef, className: "fp-modal-body", children: children });
}
export function BackupMenu({ t, disabled, onImport, onExport }) {
    const anchorRef = useRef(null);
    const [open, setOpen] = useState(false);
    const [focusLast, setFocusLast] = useState(false);
    const focusTrigger = () => anchorRef.current?.querySelector('button')?.focus();
    useEffect(() => {
        if (open && focusLast) {
            const menu = document.activeElement?.closest('[role=menu]');
            const items = menu?.querySelectorAll('[role=menuitem]');
            items?.[items.length - 1]?.focus();
        }
    }, [open, focusLast]);
    return _jsx("span", { ref: anchorRef, onKeyDown: event => {
            if (open && event.key === 'Tab') {
                setOpen(false);
                focusTrigger();
            }
        }, children: _jsx(Menu, { open: open, portal: true, autoFocus: true, align: "end", onClose: () => setOpen(false), items: [{ id: 'import', label: t('import'), disabled }, { id: 'export', label: t('export'), disabled }], onSelect: id => {
                setOpen(false);
                focusTrigger();
                if (id === 'import')
                    onImport();
                else
                    onExport();
            }, anchor: _jsxs(Button, { variant: "outline", disabled: disabled, "aria-haspopup": "menu", "aria-expanded": open, onClick: () => { setFocusLast(false); setOpen(!open); }, onKeyDown: event => {
                    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
                        event.preventDefault();
                        event.stopPropagation();
                        setFocusLast(event.key === 'ArrowUp');
                        setOpen(true);
                    }
                }, children: [t('transfer'), _jsx(IconChevronDownOutline14, {})] }) }) });
}
