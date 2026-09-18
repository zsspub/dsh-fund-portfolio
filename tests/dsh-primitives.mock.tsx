import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from 'react'
import { createPortal } from 'react-dom'
import buttonCss from '../node_modules/@deepseek-ai/dsh-client-ui-primitives/lib/Button.module.css'
import disclosureCss from '../node_modules/@deepseek-ai/dsh-client-ui-primitives/lib/DisclosureRow.module.css'
import inputCss from '../node_modules/@deepseek-ai/dsh-client-ui-primitives/lib/Input.module.css'
import menuCss from '../node_modules/@deepseek-ai/dsh-client-ui-primitives/lib/Menu.module.css'
import modalCss from '../node_modules/@deepseek-ai/dsh-client-ui-primitives/lib/Modal.module.css'
import pillCss from '../node_modules/@deepseek-ai/dsh-client-ui-primitives/lib/Pill.module.css'
import switchCss from '../node_modules/@deepseek-ai/dsh-client-ui-primitives/lib/Switch.module.css'
import tagCss from '../node_modules/@deepseek-ai/dsh-client-ui-primitives/lib/Tag.module.css'

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

export function Pill({ active = false, className, children, onClick, ...rest }: {
  active?: boolean
  className?: string
  children?: ReactNode
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  if (!onClick) return <span className={classes(pillCss.pill, active && pillCss.active, className)}>{children}</span>
  return <button type="button" className={classes(pillCss.pill, pillCss.interactive, active && pillCss.active, className)}
    onClick={onClick} {...rest}>{children}</button>
}

export function Tag({ tone = 'outline', className, children }: {
  tone?: 'outline' | 'solid' | 'neutral' | 'quiet' | 'success' | 'info' | 'warning' | 'danger'
  className?: string
  children?: ReactNode
}) {
  return <span className={classes(tagCss.tag, className)} data-tone={tone}>{children}</span>
}

export function Switch({ checked, onChange, label, disabled = false, title, className }: {
  checked: boolean
  onChange: (next: boolean) => void
  label: string
  disabled?: boolean
  title?: string
  className?: string
}) {
  return <button type="button" role="switch" aria-checked={checked} aria-label={label} title={title}
    disabled={disabled} className={classes(switchCss.switch, className)} onClick={() => onChange(!checked)}>
    <span className={switchCss.thumb} />
  </button>
}

export function DisclosureRow({ icon, title, open, expandable, onToggle, expandOnRowClick = false, children }: {
  icon: ReactNode
  title: string
  open: boolean
  expandable: boolean
  onToggle: () => void
  expandOnRowClick?: boolean
  children?: ReactNode
}) {
  const rowExpands = expandable && expandOnRowClick
  return <div className={disclosureCss.root} data-open={open || undefined}>
    <div className={disclosureCss.row} data-disclosure-row data-expandable={rowExpands || undefined}
      role={rowExpands ? 'button' : undefined} tabIndex={rowExpands ? 0 : undefined} aria-expanded={rowExpands ? open : undefined}
      onClick={rowExpands ? onToggle : undefined}
      onKeyDown={rowExpands ? event => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onToggle()
        }
      } : undefined}>
      <span className={disclosureCss.leading}>{icon}</span>
      <span className={disclosureCss.title}>{title}</span>
    </div>
    {open && children}
  </div>
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

export function IconRefreshOutline16({ size = 16, className }: { size?: number; className?: string }) {
  return <svg width={size} height={size} className={className} viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M13.5 4.5V1.75M13.5 4.5h-2.75M13.08 4.08A5.5 5.5 0 1 0 13.5 9" stroke="currentColor" />
  </svg>
}

export function IconPlusOutline16({ size = 16, className }: { size?: number; className?: string }) {
  return <svg width={size} height={size} className={className} viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M8 3v10M3 8h10" stroke="currentColor" />
  </svg>
}

export function Modal({ open, onClose, title, closeLabel, description, children, footer, className, contentClassName }: {
  open: boolean
  onClose: () => void
  title: string
  closeLabel: string
  description?: string
  children?: ReactNode
  footer?: ReactNode
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
        {description !== undefined && description !== '' && <p className={modalCss.description}>{description}</p>}
        {children !== undefined && <div className={modalCss.body}>{children}</div>}
      </div>
      {footer !== undefined && <div className={modalCss.footer}>{footer}</div>}
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
