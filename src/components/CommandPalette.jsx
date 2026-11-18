import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { COURSES, LINES } from '../data/courses'
import { NAV } from './nav'

/** Ctrl/⌘ + K quick-jump: search any page or course station */
export default function CommandPalette({ open, onClose }) {
  const [q, setQ] = useState('')
  const [i, setI] = useState(0)
  const navigate = useNavigate()
  const inputRef = useRef(null)

  const items = useMemo(() => {
    const pages = NAV.map((n) => ({ kind: 'Page', label: n.label, hint: n.hint, to: n.to, color: '#16161D' }))
    const courses = COURSES.map((c) => ({
      kind: 'Station', label: `${c.code} — ${c.title}`, hint: LINES[c.line].name, to: `/courses/${c.code}`, color: LINES[c.line].color,
    }))
    const all = [...pages, ...courses]
    const s = q.trim().toLowerCase()
    if (!s) return all.slice(0, 9)
    return all.filter((x) => (x.label + ' ' + x.hint).toLowerCase().includes(s)).slice(0, 12)
  }, [q])

  useEffect(() => {
    if (open) {
      setQ('')
      setI(0)
      setTimeout(() => inputRef.current?.focus(), 20)
    }
  }, [open])

  useEffect(() => setI(0), [q])

  if (!open) return null

  const pick = (it) => {
    navigate(it.to)
    onClose()
  }

  const onKey = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setI((v) => Math.min(v + 1, items.length - 1)) }
    if (e.key === 'ArrowUp') { e.preventDefault(); setI((v) => Math.max(v - 1, 0)) }
    if (e.key === 'Enter' && items[i]) pick(items[i])
    if (e.key === 'Escape') onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-ink/40 px-4 pt-[12vh] backdrop-blur-sm" onMouseDown={onClose}>
      <div role="dialog" aria-modal="true" aria-label="Quick jump"
        className="w-full max-w-lg animate-rise overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-ink/10 dark:bg-zinc-900 dark:ring-white/10"
        onMouseDown={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 border-b border-ink/10 px-4 dark:border-white/10">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-ink-soft"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
          <input ref={inputRef} value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={onKey}
            placeholder="Jump to a page or course station…"
            className="h-14 w-full bg-transparent text-[15px] outline-none focus-visible:ring-0 placeholder:text-ink-soft/70" />
          <kbd className="rounded border border-ink/15 px-1.5 font-mono text-[10px] text-ink-soft dark:border-white/20">ESC</kbd>
        </div>
        <ul className="max-h-[50vh] overflow-y-auto p-2">
          {items.length === 0 && <li className="px-3 py-6 text-center text-sm text-ink-soft">No stations match “{q}”.</li>}
          {items.map((it, idx) => (
            <li key={it.to}>
              <button onMouseEnter={() => setI(idx)} onClick={() => pick(it)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm ${idx === i ? 'bg-ink text-white dark:bg-white dark:text-ink' : ''}`}>
                <span className="h-3 w-3 shrink-0 rounded-full ring-2 ring-white/70" style={{ background: it.color }} />
                <span className="flex-1 truncate font-medium">{it.label}</span>
                <span className={`font-mono text-[10px] uppercase ${idx === i ? 'opacity-70' : 'text-ink-soft'}`}>{it.kind}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
