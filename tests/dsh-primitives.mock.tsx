import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from 'react'
import { createPortal } from 'react-dom'
import buttonCss from '../node_modules/@deepseek-ai/dsh-client-ui-primitives/lib/Button.module.css'
import inputCss from '../node_modules/@deepseek-ai/dsh-client-ui-primitives/lib/Input.module.css'
import menuCss from '../node_modules/@deepseek-ai/dsh-client-ui-primitives/lib/Menu.module.css'
import modalCss from '../node_modules/@deepseek-ai/dsh-client-ui-primitives/lib/Modal.module.css'

function classes(...values: Array<string | undefined | false>): string {
  return values.filter(Boolean).join(' ')
}

export function Button({ variant = 'ghost', size = 'md', icon, className, children, ...rest }: {
  variant?: 'primary' | 'ghost' | 'outline' | 'toolbar'
  size?: 'md' | 'sm'
  icon?: ReactNode
  className?: string
  children?: ReactNode
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button type="button" className={classes(buttonCss.button, buttonCss[variant], buttonCss[size], className)} {...rest}>
    {icon && <span className={buttonCss.icon}>{icon}</span>}{children}
  </button>
}

export function Input({ icon, className, ...rest }: {
  icon?: ReactNode
  className?: string
} & InputHTMLAttributes<HTMLInputElement>) {
  return <span className={classes(inputCss.wrap, className)}>
    {icon && <span className={inputCss.icon}>{icon}</span>}
    <input className={inputCss.input} {...rest} />
  </span>
}

export function IconChevronRightOutline14({ size = 14, className }: { size?: number; className?: string }) {
  return <svg width={size} height={size} className={className} viewBox="0 0 14 14" fill="none">
    <path d="M5.5 2.15 10.35 7 5.5 11.85 4.65 11l4-4-4-4 .85-.85Z" fill="currentColor" />
  </svg>
}

export function IconChevronDownOutline14({ size = 14, className }: { size?: number; className?: string }) {
  return <svg width={size} height={size} className={className} viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path d="m2.15 5.5.85-.85 4 4 4-4 .85.85L7 10.35 2.15 5.5Z" fill="currentColor" />
  </svg>
}

export function Modal({ open, onClose, title, closeLabel, children, className, contentClassName }: {
  open: boolean
  onClose: () => void
  title: string
  closeLabel: string
  children?: ReactNode
  className?: string
  contentClassName?: string
}) {
  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])
  if (!open) return null
  return createPortal(<div className={modalCss.root} role="presentation">
    <div className={modalCss.mask} aria-hidden="true" onClick={onClose} />
    <div className={classes(modalCss.dialog, className)} role="dialog" aria-modal="true" aria-label={title}>
      <div className={classes(modalCss.content, contentClassName)}>
        <div className={modalCss.header}>
          <h2 className={modalCss.title}>{title}</h2>
          <button type="button" className={modalCss.close} aria-label={closeLabel} onClick={onClose}>×</button>
        </div>
        <div className={modalCss.body}>{children}</div>
      </div>
    </div>
  </div>, document.body)
}

type MenuItem = { id: string; label: ReactNode; disabled?: boolean }

export function Menu({ open, anchor, items, onSelect, onClose, portal = false, autoFocus = false, align = 'start' }: {
  open: boolean
  anchor: ReactNode
  items: readonly MenuItem[]
  onSelect: (id: string) => void
  onClose: () => void
  portal?: boolean
  autoFocus?: boolean
  align?: 'start' | 'end'
}) {
  const rootRef = useRef<HTMLSpanElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ left: 0, top: 0 })
  useLayoutEffect(() => {
    if (!open || !portal) return
    const bounds = rootRef.current!.getBoundingClientRect()
    const width = listRef.current?.offsetWidth ?? 218
    setPosition({
      left: align === 'end' ? bounds.right - width : bounds.left,
      top: bounds.bottom + 4,
    })
  }, [align, open, portal])
  useEffect(() => {
    if (open && autoFocus) listRef.current?.querySelector<HTMLButtonElement>('button:not(:disabled)')?.focus()
  }, [autoFocus, open])
  useEffect(() => {
    if (!open) return
    const onPointerDown = (event: PointerEvent) => {
      if (!(event.target instanceof Node) || rootRef.current?.contains(event.target) || listRef.current?.contains(event.target)) return
      onClose()
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
        rootRef.current?.querySelector<HTMLButtonElement>('button')?.focus()
      }
      if (!autoFocus || !['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return
      const buttons = Array.from(listRef.current?.querySelectorAll<HTMLButtonElement>('button:not(:disabled)') ?? [])
      const current = buttons.indexOf(document.activeElement as HTMLButtonElement)
      if (current < 0) return
      event.preventDefault()
      const index = event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length - 1
        : (current + (event.key === 'ArrowDown' ? 1 : -1) + buttons.length) % buttons.length
      buttons[index]?.focus()
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [autoFocus, onClose, open])
  const list = open && <div ref={listRef} role="menu" className={classes(menuCss.list, portal && menuCss.portal)}
    style={portal ? { position: 'fixed', left: position.left, top: position.top } : undefined}>
    <div className={menuCss.viewport} role="presentation">
      {items.map(item => <div className={menuCss.itemWrap} key={item.id}>
        <button type="button" role="menuitem" className={menuCss.item} disabled={item.disabled} onClick={() => onSelect(item.id)}>
          <span className={menuCss.itemLabel}>{item.label}</span>
        </button>
      </div>)}
    </div>
  </div>
  return <span ref={rootRef} className={menuCss.root}>{anchor}{portal && list ? createPortal(list, document.body) : list}</span>
}
