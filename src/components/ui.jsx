import { Link } from 'react-router-dom'
import { LINES, byCode, statusOf } from '../data/courses'

/** Coloured course-code badge, like a metro line roundel */
export function Roundel({ code, size = 'md', link = false }) {
  const c = byCode[code]
  const color = c ? LINES[c.line].color : '#16161D'
  const cls = size === 'lg' ? 'h-9 px-3 text-sm' : size === 'sm' ? 'h-5 px-1.5 text-[10px]' : ''
  const el = (
    <span className={`roundel ${cls}`} style={{ background: color }}>
      {code.replace(/(\D+)(\d+)/, '$1 $2')}
    </span>
  )
  return link ? <Link to={`/courses/${code}`} className="hover:opacity-80">{el}</Link> : el
}

export function StatusChip({ course }) {
  const s = statusOf(course)
  const map = {
    done: ['Completed', 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300'],
    now: ['In progress', 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300'],
    next: ['Planned', 'bg-zinc-200/70 text-zinc-700 dark:bg-white/10 dark:text-zinc-300'],
  }
  const [label, cls] = map[s]
  return (
    <span className={`chip ${cls}`}>
      {s === 'now' && <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current" />}
      {label}
    </span>
  )
}

export function PageHeader({ eyebrow, title, children, accent = '#E4322B' }) {
  return (
    <header className="relative mb-10 animate-rise">
      <div className="mb-4 flex items-center gap-3">
        <span className="h-1.5 w-10 rounded-full" style={{ background: accent }} />
        <span className="eyebrow">{eyebrow}</span>
      </div>
      <h1 className="max-w-3xl text-4xl font-bold leading-[1.05] sm:text-5xl">{title}</h1>
      {children && <p className="mt-4 max-w-2xl text-base text-ink-soft dark:text-zinc-400 sm:text-lg">{children}</p>}
    </header>
  )
}

export function Stat({ label, value, sub, color }) {
  return (
    <div className="card p-5">
      <div className="eyebrow">{label}</div>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="font-display text-3xl font-bold" style={color ? { color } : undefined}>{value}</span>
        {sub && <span className="text-sm text-ink-soft dark:text-zinc-400">{sub}</span>}
      </div>
    </div>
  )
}

/** Circular progress ring */
export function Ring({ value, size = 120, stroke = 12, color = '#E4322B', children }) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  return (
    <div className="relative inline-grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} className="stroke-ink/10 dark:stroke-white/10" />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} stroke={color}
          strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - value)}
          style={{ transition: 'stroke-dashoffset 1s ease' }} />
      </svg>
      <div className="absolute text-center">{children}</div>
    </div>
  )
}

export function Bar({ value, color = '#16161D' }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-ink/10 dark:bg-white/10">
      <div className="h-full rounded-full" style={{ width: `${Math.min(100, Math.max(0, value))}%`, background: color, transition: 'width .8s ease' }} />
    </div>
  )
}
