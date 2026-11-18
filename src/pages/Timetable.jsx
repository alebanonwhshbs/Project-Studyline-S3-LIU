import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { PageHeader } from '../components/ui'
import { DAYS, LINES, TIMETABLE, byCode } from '../data/courses'

const START = 8 // 08:00
const END = 15 // 15:00
const HOUR_PX = 72
const WEEK = [1, 2, 3, 4, 5]

const toMin = (t) => {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}

export default function Timetable() {
  const [now, setNow] = useState(new Date())
  const today = now.getDay()
  const [day, setDay] = useState(WEEK.includes(today) ? today : 1)

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60000)
    return () => clearInterval(id)
  }, [])

  const nowMin = now.getHours() * 60 + now.getMinutes()
  const nowTop = ((nowMin - START * 60) / 60) * HOUR_PX
  const showNow = WEEK.includes(today) && nowMin >= START * 60 && nowMin <= END * 60
  const totalCredits = [...new Set(TIMETABLE.map((t) => t.code))].reduce((s, c) => s + byCode[c].credits, 0)

  const Block = ({ t }) => {
    const c = byCode[t.code]
    const color = LINES[c.line].color
    const top = ((toMin(t.start) - START * 60) / 60) * HOUR_PX
    const h = ((toMin(t.end) - toMin(t.start)) / 60) * HOUR_PX
    const live = t.day === today && nowMin >= toMin(t.start) && nowMin < toMin(t.end)
    return (
      <Link to={`/courses/${t.code}`}
        className={`absolute inset-x-1 overflow-hidden rounded-xl p-2.5 text-white shadow-md transition hover:z-10 hover:scale-[1.02] ${live ? 'ring-4 ring-ink/80 dark:ring-white' : ''}`}
        style={{ top, height: h - 4, background: color }}>
        <div className="font-mono text-[10px] font-bold opacity-80">{t.start}–{t.end}</div>
        <div className="mt-0.5 font-display text-sm font-bold leading-tight">{c.code}</div>
        <div className="truncate text-[11px] opacity-90">{c.title}</div>
        <div className="mt-1 font-mono text-[10px] opacity-80">{c.room}</div>
        {live && <span className="absolute right-2 top-2 rounded bg-white px-1.5 font-mono text-[9px] font-bold text-ink">NOW</span>}
      </Link>
    )
  }

  const hours = Array.from({ length: END - START + 1 }, (_, i) => START + i)

  return (
    <div>
      <PageHeader eyebrow={`Fall 2026 · ${totalCredits} credits`} title="Weekly timetable" accent="#8B4FD8">
        Your classes this week. Today's column is highlighted, and the red line shows the current time.
      </PageHeader>

      {/* mobile: day tabs + list */}
      <div className="md:hidden">
        <div className="mb-4 grid grid-cols-5 gap-1 rounded-full border border-ink/15 p-1 dark:border-white/15">
          {WEEK.map((d) => (
            <button key={d} onClick={() => setDay(d)}
              className={`rounded-full py-2 text-sm font-semibold ${day === d ? 'bg-ink text-white dark:bg-white dark:text-ink' : ''}`}>
              {DAYS[d]}{d === today && <span className="ml-0.5 text-line-core">•</span>}
            </button>
          ))}
        </div>
        <ul className="space-y-3">
          {TIMETABLE.filter((t) => t.day === day).sort((a, b) => a.start.localeCompare(b.start)).map((t) => {
            const c = byCode[t.code]
            return (
              <li key={t.code}>
                <Link to={`/courses/${t.code}`} className="card flex items-center gap-4 overflow-hidden p-0">
                  <span className="w-2 self-stretch" style={{ background: LINES[c.line].color }} />
                  <div className="py-4 font-mono text-sm font-bold">{t.start}<span className="block text-xs font-normal text-ink-soft">{t.end}</span></div>
                  <div className="py-4 pr-4">
                    <div className="font-bold">{c.title}</div>
                    <div className="text-xs text-ink-soft">{c.code} · {c.room} · {c.instructor}</div>
                  </div>
                </Link>
              </li>
            )
          })}
          {TIMETABLE.every((t) => t.day !== day) && <li className="card p-6 text-center text-ink-soft">No classes on {DAYS[day]}.</li>}
        </ul>
      </div>

      {/* desktop grid */}
      <div className="card hidden overflow-hidden p-0 md:block">
        <div className="grid grid-cols-[64px_repeat(5,1fr)] border-b border-ink/10 dark:border-white/10">
          <div />
          {WEEK.map((d) => (
            <div key={d} className={`px-3 py-3 text-center font-display font-bold ${d === today ? 'text-line-core' : ''}`}>
              {DAYS[d]}
              {d === today && <span className="ml-2 rounded-full bg-line-core px-2 py-0.5 font-mono text-[10px] text-white">TODAY</span>}
            </div>
          ))}
        </div>
        <div className="relative grid grid-cols-[64px_repeat(5,1fr)]" style={{ height: (END - START) * HOUR_PX }}>
          <div className="relative">
            {hours.slice(0, -1).map((h, i) => (
              <span key={h} className="absolute right-2 -translate-y-1/2 font-mono text-[10px] text-ink-soft" style={{ top: i * HOUR_PX + (i === 0 ? 8 : 0) }}>
                {String(h).padStart(2, '0')}:00
              </span>
            ))}
          </div>
          {WEEK.map((d) => (
            <div key={d} className={`relative border-l border-ink/10 dark:border-white/10 ${d === today ? 'bg-line-core/[.05]' : ''}`}>
              {hours.slice(1, -1).map((h, i) => (
                <div key={h} className="absolute inset-x-0 border-t border-dashed border-ink/10 dark:border-white/10" style={{ top: (i + 1) * HOUR_PX }} />
              ))}
              {TIMETABLE.filter((t) => t.day === d).map((t) => <Block key={t.code + t.start} t={t} />)}
            </div>
          ))}
          {showNow && (
            <div className="pointer-events-none absolute left-[64px] right-0 z-20 flex items-center" style={{ top: nowTop }}>
              <span className="-ml-1.5 h-3 w-3 rounded-full bg-line-core" />
              <span className="h-0.5 flex-1 bg-line-core" />
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        {[...new Set(TIMETABLE.map((t) => t.code))].map((code) => {
          const c = byCode[code]
          return (
            <span key={code} className="chip border border-ink/10 bg-white/70 py-1 dark:border-white/10 dark:bg-white/5">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: LINES[c.line].color }} /> {c.code} · {c.instructor}
            </span>
          )
        })}
      </div>
    </div>
  )
}
