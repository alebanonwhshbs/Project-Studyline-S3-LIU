import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import TransitMap, { MapLegend } from '../components/TransitMap'
import { PageHeader, Roundel, StatusChip } from '../components/ui'
import { COURSES, LINES, LINE_ORDER, TERMS, statusOf } from '../data/courses'

const STATUS = [
  ['all', 'All'],
  ['done', 'Completed'],
  ['now', 'In progress'],
  ['next', 'Planned'],
]

export default function Courses() {
  const [view, setView] = useState('list')
  const [line, setLine] = useState('all')
  const [status, setStatus] = useState('all')
  const [q, setQ] = useState('')

  const list = useMemo(() => {
    const s = q.trim().toLowerCase()
    return COURSES.filter(
      (c) =>
        (line === 'all' || c.line === line) &&
        (status === 'all' || statusOf(c) === status) &&
        (!s || `${c.code} ${c.title} ${c.instructor}`.toLowerCase().includes(s)),
    )
  }, [line, status, q])

  return (
    <div>
      <PageHeader eyebrow={`Network · ${COURSES.length} stations`} title="All courses" accent="#14946B">
        Filter by line or status, search by name or instructor, or switch to the map view.
      </PageHeader>

      {/* controls */}
      <div className="card mb-8 space-y-4 p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="relative flex-1">
            <span className="sr-only">Search courses</span>
            <svg className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-soft" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
            <input className="input pl-10" placeholder="Search code, title or instructor…" value={q} onChange={(e) => setQ(e.target.value)} />
          </label>
          <div className="inline-flex rounded-full border border-ink/15 p-1 dark:border-white/15" role="tablist" aria-label="View">
            {['list', 'map'].map((v) => (
              <button key={v} role="tab" aria-selected={view === v} onClick={() => setView(v)}
                className={`rounded-full px-5 py-1.5 text-sm font-semibold capitalize transition ${view === v ? 'bg-ink text-white dark:bg-white dark:text-ink' : 'text-ink-soft'}`}>
                {v}
              </button>
            ))}
          </div>
        </div>
        {view === 'list' && (
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setLine('all')}
              className={`chip border px-3 py-1 ${line === 'all' ? 'border-ink bg-ink text-white dark:border-white dark:bg-white dark:text-ink' : 'border-ink/15 dark:border-white/15'}`}>
              All lines
            </button>
            {LINE_ORDER.map((k) => (
              <button key={k} onClick={() => setLine(k)}
                className={`chip border px-3 py-1 transition ${line === k ? 'text-white' : 'border-ink/15 dark:border-white/15'}`}
                style={line === k ? { background: LINES[k].color, borderColor: LINES[k].color } : undefined}>
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: line === k ? '#fff' : LINES[k].color }} />
                {LINES[k].short}
              </button>
            ))}
            <span className="mx-1 hidden w-px bg-ink/15 sm:block" />
            {STATUS.map(([k, label]) => (
              <button key={k} onClick={() => setStatus(k)}
                className={`chip border px-3 py-1 ${status === k ? 'border-ink bg-ink text-white dark:border-white dark:bg-white dark:text-ink' : 'border-ink/15 dark:border-white/15'}`}>
                {label}
              </button>
            ))}
          </div>
        )}
      </div>

      {view === 'map' ? (
        <div className="card p-5 sm:p-8">
          <div className="mb-6"><MapLegend /></div>
          <TransitMap />
        </div>
      ) : list.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="font-display text-2xl font-bold">No stations on this route</div>
          <p className="mt-2 text-ink-soft">Try a different line, status or search term.</p>
          <button className="btn-ghost mt-6" onClick={() => { setQ(''); setLine('all'); setStatus('all') }}>Clear filters</button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((c, i) => (
            <Link key={c.code} to={`/courses/${c.code}`}
              className="card group flex animate-rise gap-4 p-5 transition hover:-translate-y-0.5 hover:shadow-lg"
              style={{ animationDelay: `${Math.min(i, 12) * 35}ms` }}>
              <div className="flex flex-col items-center">
                <span className="h-4 w-4 rounded-full border-[3px] border-ink bg-white dark:border-white" />
                <span className="w-1.5 flex-1 rounded-full" style={{ background: LINES[c.line].color }} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Roundel code={c.code} />
                  <StatusChip course={c} />
                </div>
                <h3 className="mt-2 font-bold leading-snug group-hover:underline">{c.title}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-ink-soft dark:text-zinc-400">{c.description}</p>
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px] text-ink-soft">
                  <span>{TERMS[c.term - 1].label}</span>
                  <span>{c.credits} credits</span>
                  {c.grade && <span className="font-bold text-ink dark:text-white">Grade {c.grade}</span>}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
