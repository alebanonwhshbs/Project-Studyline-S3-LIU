import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getDepartures } from '../data/events'
import { LINES, byCode } from '../data/courses'

function countdown(ms) {
  if (ms <= 0) return 'NOW'
  const m = Math.floor(ms / 60000)
  const d = Math.floor(m / 1440)
  const h = Math.floor((m % 1440) / 60)
  if (d > 0) return `${d}D ${String(h).padStart(2, '0')}H`
  return `${h}H ${String(m % 60).padStart(2, '0')}M`
}

const fmtTime = (d) => d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
const fmtDay = (d) => d.toLocaleDateString([], { weekday: 'short', day: '2-digit', month: 'short' }).toUpperCase()

/** Split-flap style board of upcoming deadlines, with live countdowns */
export default function DepartureBoard({ limit = 5, title = 'Next departures' }) {
  const [now, setNow] = useState(Date.now())
  const [items] = useState(() => getDepartures())

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30000)
    return () => clearInterval(id)
  }, [])

  return (
    <section className="overflow-hidden rounded-2xl bg-[#101114] text-amber-300 shadow-ticket ring-1 ring-black/40">
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 animate-pulse rounded-full bg-amber-400" />
          <h2 className="font-mono text-xs font-bold uppercase tracking-[.25em] text-amber-200">{title}</h2>
        </div>
        <span className="font-mono text-xs text-white/50">{fmtTime(new Date(now))}</span>
      </div>
      <div className="hidden grid-cols-[86px_92px_1fr_92px] gap-3 px-5 pt-3 font-mono text-[10px] uppercase tracking-widest text-white/35 sm:grid">
        <span>Time</span><span>Line</span><span>Destination</span><span className="text-right">Departs in</span>
      </div>
      <ul className="divide-y divide-white/5">
        {items.slice(0, limit).map((e, i) => {
          const left = e.when - now
          const soon = left < 2 * 864e5
          const color = LINES[byCode[e.code].line].color
          return (
            <li key={e.id}>
              <Link to={`/courses/${e.code}`} className="block px-5 py-3 font-mono transition hover:bg-white/[.04]">
                {/* mobile layout */}
                <div className="sm:hidden">
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-2">
                      <span className="rounded px-1.5 py-0.5 text-[10px] font-bold text-white" style={{ background: color }}>{e.code}</span>
                      <span className="text-[10px] uppercase text-white/40">{e.type}</span>
                    </span>
                    <span className={`text-sm font-bold ${soon ? 'text-red-400' : 'text-amber-300'}`}>{countdown(left)}</span>
                  </div>
                  <div className="board-char mt-1.5 animate-flip text-[13px] text-amber-100" style={{ animationDelay: `${i * 90}ms` }}>{e.title}</div>
                  <div className="mt-0.5 text-[10px] text-white/40">{fmtDay(e.when)} · {fmtTime(e.when)} · {e.platform}</div>
                </div>
                {/* desktop layout */}
                <div className="hidden grid-cols-[86px_92px_1fr_92px] items-center gap-3 sm:grid">
                  <span className="board-char animate-flip text-sm font-bold" style={{ animationDelay: `${i * 90}ms` }}>
                    {fmtTime(e.when)}
                    <span className="block text-[10px] font-medium text-white/40">{fmtDay(e.when)}</span>
                  </span>
                  <span>
                    <span className="rounded px-1.5 py-0.5 text-[10px] font-bold text-white" style={{ background: color }}>{e.code}</span>
                  </span>
                  <span className="min-w-0">
                    <span className="board-char block truncate text-[13px] text-amber-100 animate-flip" style={{ animationDelay: `${i * 90 + 40}ms` }}>
                      {e.title}
                    </span>
                    <span className="block text-[10px] uppercase tracking-wider text-white/40">{e.type} · Platform {e.platform}</span>
                  </span>
                  <span className={`text-right text-sm font-bold ${soon ? 'text-red-400' : 'text-amber-300'}`}>{countdown(left)}</span>
                </div>
              </Link>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
