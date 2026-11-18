import { Link } from 'react-router-dom'
import DepartureBoard from '../components/DepartureBoard'
import { Bar, PageHeader, Ring, Roundel } from '../components/ui'
import { DAYS, LINES, TIMETABLE, TOTAL_CREDITS_REQUIRED, byCode, unlocks } from '../data/courses'
import { creditsEarned, creditsInProgress, cumulativeGpa, currentCourses, letterFromScore, runningScore, standing } from '../lib/grades'
import { useStudent } from '../context/StudentContext'

function greeting() {
  const h = new Date().getHours()
  return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening'
}

export default function Dashboard() {
  const { profile } = useStudent()
  const today = new Date().getDay()
  const todays = TIMETABLE.filter((t) => t.day === today).sort((a, b) => a.start.localeCompare(b.start))
  const journey = creditsEarned / TOTAL_CREDITS_REQUIRED
  const withProgress = (creditsEarned + creditsInProgress) / TOTAL_CREDITS_REQUIRED

  return (
    <div>
      <PageHeader eyebrow={`${greeting()} · Zone 5 of 8`} title={`${profile.name.split(' ')[0]}'s line`} accent="#1F6FEB">
        Everything on board this term: your courses, how they're going, and what's coming up next.
      </PageHeader>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* journey ring */}
        <div className="card flex items-center gap-6 p-6">
          <Ring value={withProgress} size={128} color="#1F6FEB">
            <div className="font-display text-2xl font-bold">{Math.round(journey * 100)}%</div>
            <div className="font-mono text-[10px] uppercase text-ink-soft">travelled</div>
          </Ring>
          <div className="space-y-2 text-sm">
            <div><span className="font-display text-xl font-bold">{creditsEarned}</span> <span className="text-ink-soft">credits earned</span></div>
            <div><span className="font-display text-xl font-bold">{creditsInProgress}</span> <span className="text-ink-soft">in progress</span></div>
            <div><span className="font-display text-xl font-bold">{TOTAL_CREDITS_REQUIRED - creditsEarned - creditsInProgress}</span> <span className="text-ink-soft">to go</span></div>
          </div>
        </div>

        {/* GPA */}
        <div className="card p-6">
          <div className="eyebrow">Cumulative GPA</div>
          <div className="mt-2 font-display text-5xl font-bold text-line-core">{cumulativeGpa.toFixed(2)}</div>
          <div className="mt-1 text-sm text-ink-soft">{standing(cumulativeGpa)} · out of 4.00</div>
          <div className="mt-4"><Bar value={(cumulativeGpa / 4) * 100} color="#E4322B" /></div>
          <Link to="/grades" className="mt-4 inline-block text-sm font-semibold text-line-core hover:underline">Try the what-if simulator →</Link>
        </div>

        {/* today */}
        <div className="card p-6">
          <div className="eyebrow">Today · {DAYS[today]}</div>
          {todays.length === 0 ? (
            <div className="mt-4">
              <div className="font-display text-xl font-bold">No classes today 🎉</div>
              <p className="mt-1 text-sm text-ink-soft">A good day to get ahead on a deadline.</p>
            </div>
          ) : (
            <ol className="relative mt-4 space-y-4 border-l-2 border-dashed border-ink/20 pl-5 dark:border-white/20">
              {todays.map((t) => (
                <li key={t.code + t.start} className="relative">
                  <span className="absolute -left-[27px] top-1 h-3 w-3 rounded-full ring-4 ring-white dark:ring-paper-dark" style={{ background: LINES[byCode[t.code].line].color }} />
                  <div className="font-mono text-xs text-ink-soft">{t.start} – {t.end} · {byCode[t.code].room}</div>
                  <Link to={`/courses/${t.code}`} className="font-semibold hover:underline">{byCode[t.code].title}</Link>
                </li>
              ))}
            </ol>
          )}
          <Link to="/timetable" className="mt-4 inline-block text-sm font-semibold text-line-core hover:underline">Full week →</Link>
        </div>
      </div>

      {/* current course tickets */}
      <h2 className="mb-4 mt-12 text-2xl font-bold">On board this term</h2>
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {currentCourses.map((c, i) => {
          const run = runningScore(c)
          const graded = c.assessments.filter((a) => a.score != null).reduce((s, a) => s + a.weight, 0)
          const color = LINES[c.line].color
          const next = unlocks(c.code)
          return (
            <Link key={c.code} to={`/courses/${c.code}`}
              className="card group relative animate-rise overflow-hidden p-0 transition hover:-translate-y-1"
              style={{ animationDelay: `${i * 70}ms` }}>
              <div className="h-2" style={{ background: color }} />
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <Roundel code={c.code} />
                  <span className="font-mono text-xs text-ink-soft">{c.credits} cr · {c.room}</span>
                </div>
                <h3 className="mt-3 text-lg font-bold leading-tight group-hover:underline">{c.title}</h3>
                <p className="text-sm text-ink-soft">{c.instructor}</p>
                <div className="mt-5 flex items-end justify-between">
                  <div>
                    <div className="eyebrow">Running score</div>
                    <div className="font-display text-3xl font-bold">{run ? run.toFixed(0) : '—'}<span className="text-base text-ink-soft">%</span></div>
                  </div>
                  {run && <span className="rounded-lg px-3 py-1 font-display text-xl font-bold text-white" style={{ background: color }}>{letterFromScore(run)}</span>}
                </div>
                <div className="mt-3"><Bar value={graded} color={color} /></div>
                <div className="mt-1 font-mono text-[10px] uppercase text-ink-soft">{graded}% of the grade is in</div>
              </div>
              {next.length > 0 && (
                <div className="border-t-2 border-dashed border-ink/10 px-5 py-3 text-xs text-ink-soft dark:border-white/10">
                  Unlocks → {next.map((n) => n.code).join(', ')}
                </div>
              )}
            </Link>
          )
        })}
      </div>

      <div className="mt-12">
        <DepartureBoard limit={7} title="Deadlines & departures" />
      </div>
    </div>
  )
}
