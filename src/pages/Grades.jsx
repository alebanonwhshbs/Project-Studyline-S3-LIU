import { Link } from 'react-router-dom'
import { PageHeader, Roundel } from '../components/ui'
import { COURSES, CURRENT_TERM, LINES, TERMS } from '../data/courses'
import {
  GRADE_POINTS, LETTERS, completedCourses, creditsEarned, cumulativeGpa, currentCourses, gpa, standing, termGpa,
} from '../lib/grades'
import { useStudent } from '../context/StudentContext'

const QUICK = ['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C']

export default function Grades() {
  const { expected, setExpectedGrade, resetExpected } = useStudent()
  const pastTerms = TERMS.filter((t) => t.id < CURRENT_TERM)

  const projectedTerm = gpa(currentCourses.map((c) => ({ credits: c.credits, grade: expected[c.code] })))
  const projectedCum = gpa([
    ...completedCourses,
    ...currentCourses.map((c) => ({ credits: c.credits, grade: expected[c.code] })),
  ])
  const delta = projectedCum - cumulativeGpa

  return (
    <div>
      <PageHeader eyebrow="Transcript · what-if simulator" title="Grades" accent="#F2A900">
        Your record so far, term by term — plus a simulator to see where this term could take your GPA.
      </PageHeader>

      {/* summary + chart */}
      <div className="grid gap-6 lg:grid-cols-[1fr_1.6fr]">
        <div className="card p-6">
          <div className="eyebrow">Cumulative GPA</div>
          <div className="mt-2 font-display text-6xl font-bold">{cumulativeGpa.toFixed(2)}</div>
          <div className="mt-2 text-sm text-ink-soft">{standing(cumulativeGpa)} · {creditsEarned} credits graded</div>
          <div className="mt-6 grid grid-cols-3 gap-3 text-center">
            {['A', 'B', 'C'].map((band) => {
              const n = completedCourses.filter((c) => c.grade.startsWith(band)).length
              return (
                <div key={band} className="rounded-xl bg-ink/[.04] p-3 dark:bg-white/5">
                  <div className="font-display text-2xl font-bold">{n}</div>
                  <div className="font-mono text-[10px] uppercase text-ink-soft">{band}-range</div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="card p-6">
          <div className="eyebrow mb-6">GPA by zone</div>
          <div className="flex h-48 items-end gap-3 sm:gap-6" role="img" aria-label="Bar chart of GPA per semester">
            {[...pastTerms, { id: CURRENT_TERM, label: TERMS[CURRENT_TERM - 1].label, projected: true }].map((t) => {
              const g = t.projected ? projectedTerm : termGpa(t.id)
              return (
                <div key={t.id} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                  <span className="font-mono text-xs font-bold">{g.toFixed(2)}</span>
                  <div className={`w-full max-w-16 rounded-t-lg transition-all duration-700 ${t.projected ? 'border-2 border-dashed border-line-elective bg-line-elective/25' : 'bg-ink dark:bg-white'}`}
                    style={{ height: `${((g - 2) / 2) * 100}%`, minHeight: 8 }} />
                  <span className="text-center font-mono text-[10px] uppercase leading-tight text-ink-soft">
                    Z{t.id}<span className="hidden sm:inline"><br />{t.label}</span>
                  </span>
                </div>
              )
            })}
          </div>
          <p className="mt-4 text-xs text-ink-soft">Scale 2.0–4.0. The dashed bar is this term's projection from the simulator below.</p>
        </div>
      </div>

      {/* WHAT-IF */}
      <section className="mt-10 overflow-hidden rounded-2xl bg-ink text-white shadow-ticket dark:bg-white/[.06] dark:ring-1 dark:ring-white/10">
        <div className="grid lg:grid-cols-[1.6fr_1fr]">
          <div className="p-6 sm:p-8">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-mono text-[11px] font-bold uppercase tracking-[.25em] text-line-elective">What-if simulator</div>
                <h2 className="mt-1 text-2xl font-bold">Pick the grade you expect</h2>
              </div>
              <button onClick={resetExpected} className="rounded-full border border-white/20 px-3 py-1 text-xs hover:border-white/60">Reset</button>
            </div>
            <ul className="mt-6 space-y-5">
              {currentCourses.map((c) => (
                <li key={c.code}>
                  <div className="mb-2 flex items-center gap-2 text-sm">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: LINES[c.line].color }} />
                    <span className="font-mono font-bold">{c.code}</span>
                    <span className="truncate text-white/60">{c.title} · {c.credits} cr</span>
                  </div>
                  <div className="grid grid-cols-7 gap-1.5 sm:flex" role="radiogroup" aria-label={`Expected grade for ${c.code}`}>
                    {QUICK.map((g) => {
                      const on = expected[c.code] === g
                      return (
                        <button key={g} role="radio" aria-checked={on} onClick={() => setExpectedGrade(c.code, g)}
                          className={`h-9 rounded-lg sm:w-11 font-mono text-sm font-bold transition ${on ? 'scale-105 text-ink' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}
                          style={on ? { background: LINES[c.line].color, color: '#fff' } : undefined}>
                          {g}
                        </button>
                      )
                    })}
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col justify-center gap-6 border-t border-white/10 bg-white/[.04] p-6 sm:p-8 lg:border-l lg:border-t-0">
            <div>
              <div className="font-mono text-[11px] uppercase tracking-widest text-white/50">Projected term GPA</div>
              <div className="font-display text-5xl font-bold">{projectedTerm.toFixed(2)}</div>
            </div>
            <div>
              <div className="font-mono text-[11px] uppercase tracking-widest text-white/50">Projected cumulative</div>
              <div className="flex items-baseline gap-3">
                <span className="font-display text-5xl font-bold">{projectedCum.toFixed(2)}</span>
                <span className={`font-mono text-sm font-bold ${delta >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {delta >= 0 ? '▲' : '▼'} {Math.abs(delta).toFixed(2)}
                </span>
              </div>
              <div className="mt-1 text-sm text-white/60">{standing(projectedCum)}</div>
            </div>
          </div>
        </div>
      </section>

      {/* transcript */}
      <h2 className="mb-4 mt-12 text-2xl font-bold">Transcript</h2>
      <div className="space-y-4">
        {pastTerms.slice().reverse().map((t) => {
          const list = COURSES.filter((c) => c.term === t.id)
          return (
            <details key={t.id} className="card group overflow-hidden p-0" open={t.id === CURRENT_TERM - 1}>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4">
                <span className="flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-ink font-mono text-xs font-bold text-white dark:bg-white dark:text-ink">Z{t.id}</span>
                  <span>
                    <span className="block font-display font-bold">{t.label}</span>
                    <span className="text-xs text-ink-soft">{list.length} courses · {list.reduce((s, c) => s + c.credits, 0)} credits</span>
                  </span>
                </span>
                <span className="flex items-center gap-3">
                  <span className="font-mono text-sm">GPA <strong>{termGpa(t.id).toFixed(2)}</strong></span>
                  <span className="transition group-open:rotate-180">▾</span>
                </span>
              </summary>
              <div className="overflow-x-auto border-t border-ink/10 dark:border-white/10">
                <table className="w-full min-w-[480px] text-sm">
                  <thead>
                    <tr className="text-left font-mono text-[10px] uppercase tracking-widest text-ink-soft">
                      <th className="px-5 py-2 font-medium">Course</th><th className="px-5 py-2 font-medium">Title</th>
                      <th className="px-5 py-2 text-right font-medium">Credits</th><th className="px-5 py-2 text-right font-medium">Grade</th>
                      <th className="px-5 py-2 text-right font-medium">Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    {list.map((c) => (
                      <tr key={c.code} className="border-t border-ink/5 dark:border-white/5">
                        <td className="px-5 py-2.5"><Roundel code={c.code} size="sm" link /></td>
                        <td className="px-5 py-2.5"><Link to={`/courses/${c.code}`} className="hover:underline">{c.title}</Link></td>
                        <td className="px-5 py-2.5 text-right font-mono">{c.credits}</td>
                        <td className="px-5 py-2.5 text-right font-mono font-bold">{c.grade}</td>
                        <td className="px-5 py-2.5 text-right font-mono">{(GRADE_POINTS[c.grade] * c.credits).toFixed(1)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </details>
          )
        })}
      </div>
      <p className="mt-4 text-xs text-ink-soft">Grade scale: {LETTERS.map((l) => `${l} ${GRADE_POINTS[l].toFixed(1)}`).join(' · ')}</p>
    </div>
  )
}
