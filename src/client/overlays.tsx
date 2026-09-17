import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { Button, IconChevronDownOutline14, Menu, Modal } from '@deepseek-ai/dsh-client-ui-primitives'
import type { PortfolioKey } from './locales.ts'

type Translate = (key: PortfolioKey) => string

export function PortfolioModal({ title, closeLabel, busy, onClose, children, alert = false, initialFocusId }: {
  title: string
  closeLabel: string
  busy: boolean
  onClose: () => void
  children: ReactNode
  alert?: boolean
  initialFocusId?: string
}) {
  const contentRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef(onClose)
  useLayoutEffect(() => {
    closeRef.current = () => { if (!busy) onClose() }
    const dialog = contentRef.current!.closest<HTMLElement>('[aria-modal=true]')!
    const closeButton = dialog.querySelector<HTMLButtonElement>('button')!
    closeButton.disabled = busy
    dialog.setAttribute('aria-busy', String(busy))
  }, [busy, onClose])
  useLayoutEffect(() => {
    const dialog = contentRef.current!.closest<HTMLElement>('[aria-modal=true]')!
    dialog.setAttribute('role', alert ? 'alertdialog' : 'dialog')
    dialog.tabIndex = -1
    const trigger = document.activeElement
    const overlay = dialog.parentElement!
    const siblings = Array.from(document.body.children).filter((element): element is HTMLElement => element instanceof HTMLElement && element !== overlay)
    const inertStates = siblings.map(element => element.inert)
    siblings.forEach(element => { element.inert = true })
    const focusable = () => Array.from(dialog.querySelectorAll<HTMLElement>('button:not(:disabled), input:not(:disabled), select:not(:disabled), [tabindex="0"]'))
    const initial = initialFocusId ? document.getElementById(initialFocusId) : null
    ;(initial ?? focusable()[0] ?? dialog).focus({ preventScroll: true })
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        event.stopPropagation()
        closeRef.current()
      }
      if (event.key !== 'Tab') return
      event.stopPropagation()
      const items = focusable()
      const first = items[0]
      const last = items[items.length - 1]
      if (!first) {
        event.preventDefault()
        dialog.focus()
      } else if (event.shiftKey && (document.activeElement === first || document.activeElement === dialog)) {
        event.preventDefault()
        last?.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    dialog.addEventListener('keydown', onKeyDown)
    return () => {
      dialog.removeEventListener('keydown', onKeyDown)
      siblings.forEach((element, index) => { element.inert = inertStates[index]! })
      if (trigger instanceof HTMLElement && trigger.isConnected) trigger.focus()
    }
  }, [alert, initialFocusId])
  return <Modal open title={title} closeLabel={closeLabel} onClose={() => closeRef.current()}
    className="fp-modal" contentClassName="fp-modal-content">
    <div ref={contentRef}>{children}</div>
  </Modal>
}

export function BackupMenu({ t, disabled, onImport, onExport }: {
  t: Translate
  disabled: boolean
  onImport: () => void
  onExport: () => void
}) {
  const anchorRef = useRef<HTMLSpanElement>(null)
  const [open, setOpen] = useState(false)
  const [focusLast, setFocusLast] = useState(false)
  const focusTrigger = () => anchorRef.current?.querySelector('button')?.focus()
  useEffect(() => {
    if (open && focusLast) {
      const menu = document.activeElement?.closest('[role=menu]')
      const items = menu?.querySelectorAll<HTMLButtonElement>('[role=menuitem]')
      items?.[items.length - 1]?.focus()
    }
  }, [open, focusLast])
  return <span ref={anchorRef} onKeyDown={event => {
    if (open && event.key === 'Tab') { setOpen(false); focusTrigger() }
  }}>
    <Menu open={open} portal autoFocus align="end" onClose={() => setOpen(false)}
      items={[{ id: 'import', label: t('import'), disabled }, { id: 'export', label: t('export'), disabled }]}
      onSelect={id => {
        setOpen(false)
        focusTrigger()
        if (id === 'import') onImport()
        else onExport()
      }}
      anchor={<Button variant="outline" aria-disabled={disabled} aria-haspopup="menu" aria-expanded={open}
        onClick={() => { if (!disabled) { setFocusLast(false); setOpen(!open) } }}
        onKeyDown={event => {
          if (!disabled && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
            event.preventDefault()
            event.stopPropagation()
            setFocusLast(event.key === 'ArrowUp')
            setOpen(true)
          }
        }}>{t('transfer')}<IconChevronDownOutline14 /></Button>} />
  </span>
}
