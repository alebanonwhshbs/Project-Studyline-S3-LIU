import { Link, useParams } from 'react-router-dom'
import TransitMap from '../components/TransitMap'
import { Bar, Roundel, StatusChip } from '../components/ui'
import { COURSES, LINES, TERMS, TIMETABLE, DAYS, byCode, routeTo, statusOf, unlocks } from '../data/courses'
import { letterFromScore, runningScore } from '../lib/grades'
import NotFound from './NotFound'

export default function CourseDetail() {
  const { code } = useParams()
  const course = byCode[code?.toUpperCase()]
  if (!course) return <NotFound station={code} />

  const L = LINES[course.line]
  const s = statusOf(course)
  const route = routeTo(course.code)
  const next = unlocks(course.code)
  const sameLine = COURSES.filter((c) => c.line === course.line).sort((a, b) => a.term - b.term)
  const idx = sameLine.findIndex((c) => c.code === course.code)
  const prev = sameLine[idx - 1]
  const after = sameLine[idx + 1]
  const run = runningScore(course)
  const slots = TIMETABLE.filter((t) => t.code === course.code)
  const prereqsReady = course.prereqs.every((p) => statusOf(byCode[p]) !== 'next')

  return (
    <div className="space-y-8">
      <Link to="/courses" className="inline-flex items-center gap-1 text-sm font-semibold text-ink-soft hover:text-ink dark:hover:text-white">← All stations</Link>

      {/* station sign */}
      <section className="card animate-rise overflow-hidden p-0">
        <div className="relative px-6 py-8 text-white sm:px-10" style={{ background: L.color }}>
          <div className="absolute right-6 top-6 hidden h-24 w-24 place-items-center rounded-full border-[10px] border-white/90 sm:grid">
            <span className="font-display text-3xl font-bold">{L.code}</span>
          </div>
          <div className="font-mono text-xs font-bold uppercase tracking-[.25em] opacity-80">{L.name} · Zone {course.term} · {TERMS[course.term - 1].label}</div>
          <h1 className="mt-3 max-w-2xl text-4xl font-bold leading-tight sm:text-5xl">{course.title}</h1>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-white px-3 py-1 font-mono text-sm font-bold text-ink">{course.code}</span>
            <StatusChip course={course} />
          </div>
        </div>
        <div className="grid grid-cols-2 divide-ink/10 dark:divide-white/10 sm:grid-cols-4 sm:divide-x">
          {[
            ['Credits', course.credits],
            ['Instructor', course.instructor],
            ['Room', course.room || '—'],
            [s === 'done' ? 'Final grade' : s === 'now' ? 'Running' : 'Prerequisites', s === 'done' ? course.grade : s === 'now' ? (run ? `${run.toFixed(0)}% · ${letterFromScore(run)}` : '—') : prereqsReady ? 'Ready ✓' : 'Not yet'],
          ].map(([k, v]) => (
            <div key={k} className="p-5">
              <div className="eyebrow">{k}</div>
              <div className="mt-1 font-display text-lg font-semibold">{v}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-8">
          <section>
            <h2 className="mb-2 text-xl font-bold">About this station</h2>
            <p className="text-ink-soft dark:text-zinc-300">{course.description}</p>
          </section>

          {course.assessments && (
            <section className="card p-6">
              <div className="mb-4 flex items-baseline justify-between">
                <h2 className="text-xl font-bold">Assessments</h2>
                <span className="font-mono text-xs text-ink-soft">weight · score</span>
              </div>
              <ul className="space-y-4">
                {course.assessments.map((a) => (
                  <li key={a.name}>
                    <div className="mb-1.5 flex items-center justify-between text-sm">
                      <span className="font-medium">{a.name} <span className="text-ink-soft">· {a.weight}%</span></span>
                      <span className="font-mono font-bold">{a.score == null ? <span className="font-normal text-ink-soft">upcoming</span> : `${a.score}%`}</span>
                    </div>
                    <Bar value={a.score ?? 0} color={a.score == null ? '#9CA3AF' : L.color} />
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* route */}
          <section>
            <h2 className="mb-1 text-xl font-bold">Your route to this station</h2>
            <p className="mb-5 text-sm text-ink-soft">Every course you need to pass on the way here, in order.</p>
            {route.length <= 1 ? (
              <p className="card p-5 text-sm">No prerequisites — this is a terminus. Anyone can board here.</p>
            ) : (
              <ol className="relative ml-3 border-l-4 pl-7" style={{ borderColor: L.color }}>
                {route.map((r) => (
                  <li key={r.code} className="relative pb-5 last:pb-0">
                    <span className={`absolute -left-[41px] top-0.5 h-5 w-5 rounded-full border-4 ${statusOf(r) === 'next' ? 'border-dashed border-ink-soft bg-paper dark:bg-paper-dark' : 'border-ink bg-white dark:border-white'}`} />
                    <div className="flex flex-wrap items-center gap-2">
                      <Roundel code={r.code} link={r.code !== course.code} size="sm" />
                      <span className={`text-sm ${r.code === course.code ? 'font-bold' : ''}`}>{r.title}</span>
                      {r.grade && <span className="font-mono text-xs text-ink-soft">{r.grade}</span>}
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </section>
        </div>

        <aside className="space-y-6">
          {slots.length > 0 && (
            <div className="card p-5">
              <div className="eyebrow mb-3">Weekly schedule</div>
              <ul className="space-y-2">
                {slots.map((t) => (
                  <li key={t.day} className="flex justify-between font-mono text-sm">
                    <span className="font-bold">{DAYS[t.day]}</span><span>{t.start}–{t.end}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="card p-5">
            <div className="eyebrow mb-3">This station unlocks</div>
            {next.length === 0 ? (
              <p className="text-sm text-ink-soft">Nothing directly — it's an end-of-line course.</p>
            ) : (
              <ul className="space-y-2">
                {next.map((n) => (
                  <li key={n.code}><Link to={`/courses/${n.code}`} className="flex items-center gap-2 text-sm hover:underline"><Roundel code={n.code} size="sm" /> {n.title}</Link></li>
                ))}
              </ul>
            )}
          </div>

          <div className="card p-5">
            <div className="eyebrow mb-3">Along the {L.short} line</div>
            <div className="flex items-center justify-between gap-3 text-sm">
              {prev ? <Link to={`/courses/${prev.code}`} className="hover:underline">← {prev.code}</Link> : <span className="text-ink-soft">Terminus</span>}
              <span className="h-1.5 flex-1 rounded-full" style={{ background: L.color }} />
              {after ? <Link to={`/courses/${after.code}`} className="hover:underline">{after.code} →</Link> : <span className="text-ink-soft">Terminus</span>}
            </div>
          </div>
        </aside>
      </div>

      <section className="card p-5 sm:p-8">
        <h2 className="mb-1 text-xl font-bold">Where this sits on the network</h2>
        <p className="mb-5 text-sm text-ink-soft">Its prerequisite route and the courses it unlocks are highlighted.</p>
        <TransitMap focus={course.code} compact />
      </section>
    </div>
  )
}
