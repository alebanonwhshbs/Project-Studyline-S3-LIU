import { Link } from 'react-router-dom'
import TransitMap, { MapLegend } from '../components/TransitMap'
import DepartureBoard from '../components/DepartureBoard'
import { Roundel } from '../components/ui'
import { ANNOUNCEMENTS } from '../data/events'
import { COURSES, LINES, TOTAL_CREDITS_REQUIRED, statusOf } from '../data/courses'
import { creditsEarned, cumulativeGpa, currentCourses } from '../lib/grades'
import { useStudent } from '../context/StudentContext'

export default function Home() {
  const { profile } = useStudent()
  const first = profile.name.split(' ')[0] || 'there'
  const passed = COURSES.filter((c) => statusOf(c) === 'done').length
  const pct = Math.round((creditsEarned / TOTAL_CREDITS_REQUIRED) * 100)

  return (
    <div className="space-y-16">
      {/* HERO */}
      <section className="grid items-end gap-10 lg:grid-cols-[1.25fr_1fr]">
        <div className="animate-rise">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-ink/15 bg-white/70 px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-widest dark:border-white/15 dark:bg-white/5">
            <span className="h-2 w-2 animate-pulse rounded-full bg-line-core" /> Now serving: Fall 2026
          </div>
          <h1 className="text-5xl font-bold leading-[.95] sm:text-6xl lg:text-7xl">
            Your degree,<br />
            <span className="relative inline-block">
              mapped like
              <svg className="absolute -bottom-3 left-0 w-full" height="14" viewBox="0 0 300 14" preserveAspectRatio="none" aria-hidden>
                <path d="M2 10 L120 10 L135 4 L298 4" stroke="#E4322B" strokeWidth="5" fill="none" strokeLinecap="round" />
              </svg>
            </span>{' '}
            a metro.
          </h1>
          <p className="mt-8 max-w-xl text-lg text-ink-soft dark:text-zinc-400">
            Welcome back, <strong className="text-ink dark:text-white">{first}</strong>. Every course is a station, every subject is a
            line, and every semester is a zone. See your whole journey to graduation at a glance — and what's departing next.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/dashboard" className="btn-primary">Open my dashboard →</Link>
            <Link to="/features" className="btn-ghost">How it works</Link>
          </div>
        </div>

        {/* journey ticket */}
        <div className="card relative animate-rise overflow-hidden p-0 [animation-delay:120ms]">
          <div className="flex items-center justify-between bg-ink px-6 py-4 text-white dark:bg-white dark:text-ink">
            <span className="font-mono text-[11px] font-bold uppercase tracking-[.25em]">Journey pass</span>
            <span className="font-mono text-[11px] opacity-70">#{profile.studentId}</span>
          </div>
          <div className="grid grid-cols-2 gap-px bg-ink/10 dark:bg-white/10">
            {[
              ['Cumulative GPA', cumulativeGpa.toFixed(2), '#E4322B'],
              ['Journey complete', `${pct}%`, '#1F6FEB'],
              ['Stations passed', `${passed}/${COURSES.length}`, '#14946B'],
              ['Credits earned', `${creditsEarned}`, '#F2A900'],
            ].map(([l, v, c]) => (
              <div key={l} className="bg-white p-5 dark:bg-paper-dark">
                <div className="eyebrow">{l}</div>
                <div className="mt-1 font-display text-3xl font-bold" style={{ color: c }}>{v}</div>
              </div>
            ))}
          </div>
          <div className="border-t-2 border-dashed border-ink/15 px-6 py-4 dark:border-white/15">
            <div className="eyebrow mb-2">On board this term</div>
            <div className="flex flex-wrap gap-1.5">
              {currentCourses.map((c) => <Roundel key={c.code} code={c.code} link />)}
            </div>
          </div>
          {/* ticket notches */}
          <span className="absolute -left-3 bottom-[74px] h-6 w-6 rounded-full bg-paper dark:bg-paper-dark" />
          <span className="absolute -right-3 bottom-[74px] h-6 w-6 rounded-full bg-paper dark:bg-paper-dark" />
        </div>
      </section>

      {/* MAP */}
      <section className="card p-5 sm:p-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="eyebrow">Degree network · B.S. {profile.major}</div>
            <h2 className="mt-1 text-2xl font-bold sm:text-3xl">The full line map</h2>
            <p className="mt-1 text-sm text-ink-soft dark:text-zinc-400">Hover any station to trace its prerequisite route. Click to open it.</p>
          </div>
          <MapLegend />
        </div>
        <TransitMap />
      </section>

      {/* DEPARTURES + NEWS */}
      <section className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <DepartureBoard />
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Service updates</h2>
          {ANNOUNCEMENTS.map((a) => (
            <div key={a.id} className="card flex gap-4 p-4">
              <span className="mt-1 h-10 w-1.5 shrink-0 rounded-full" style={{ background: LINES[a.tone].color }} />
              <div>
                <div className="eyebrow" style={{ color: LINES[a.tone].color }}>{a.tag}</div>
                <p className="mt-1 text-sm">{a.text}</p>
              </div>
            </div>
          ))}
          <Link to="/timetable" className="btn-ghost w-full">See this week's timetable</Link>
        </div>
      </section>
    </div>
  )
}
