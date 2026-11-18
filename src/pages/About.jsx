import { Link } from 'react-router-dom'
import { PageHeader } from '../components/ui'
import { LINES, LINE_ORDER } from '../data/courses'

const STACK = [
  ['React 18', 'Components, hooks and context for state'],
  ['React Router 6', 'Client-side routing with a dynamic /courses/:code page'],
  ['Tailwind CSS 3', 'Utility-first, responsive styling and dark mode'],
  ['Hand-drawn SVG', 'The transit map, charts and illustrations — no chart library'],
  ['Vite', 'Fast dev server and production build'],
  ['localStorage', 'Saves profile, theme and what-if grades'],
]

export default function About() {
  return (
    <div className="space-y-16">
      <PageHeader eyebrow="About StudyLine" title="Why a student portal should look like a metro map." accent="#1F6FEB">
        Most portals bury your progress in tables. But a degree is a journey with a start, an end, connections and
        required stops — exactly what a transit map was invented to show.
      </PageHeader>

      <section className="grid gap-10 lg:grid-cols-2">
        <div className="space-y-4 text-ink-soft dark:text-zinc-300">
          <h2 className="text-2xl font-bold text-ink dark:text-white">The idea</h2>
          <p>
            In 1931 Harry Beck redrew the London Underground map as a diagram rather than a geographic map. Distances
            stopped mattering; what mattered was <em>order</em> and <em>connections</em>. Millions of people suddenly found
            it easy to plan a journey.
          </p>
          <p>
            StudyLine applies that same thinking to university. You don't need to know a course's catalogue page to
            understand where it fits — you need to know what line it's on, what comes before it, and what it leads to.
          </p>
          <p>
            Every screen follows the metaphor: deadlines are <strong className="text-ink dark:text-white">departures</strong>,
            semesters are <strong className="text-ink dark:text-white">zones</strong>, your student card is a
            <strong className="text-ink dark:text-white"> journey pass</strong>, and a missing page is the
            <strong className="text-ink dark:text-white"> end of the line</strong>.
          </p>
        </div>

        <div className="card p-6">
          <div className="eyebrow mb-4">How to read the map</div>
          <ul className="space-y-4">
            {LINE_ORDER.map((k) => (
              <li key={k} className="flex items-center gap-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full font-mono font-bold text-white" style={{ background: LINES[k].color }}>{LINES[k].code}</span>
                <div>
                  <div className="font-bold">{LINES[k].name}</div>
                  <div className="text-sm text-ink-soft">{LINES[k].subject}</div>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-6 border-t-2 border-dashed border-ink/10 pt-4 text-sm text-ink-soft dark:border-white/10">
            Solid stations are completed, pulsing ones are in progress, dashed ones are still ahead. Zones run left to right, one per semester.
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-6 text-2xl font-bold">Built with</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {STACK.map(([t, d], i) => (
            <div key={t} className="card flex items-start gap-4 p-5">
              <span className="font-mono text-xs font-bold text-ink-soft">{String(i + 1).padStart(2, '0')}</span>
              <div><div className="font-bold">{t}</div><div className="text-sm text-ink-soft dark:text-zinc-400">{d}</div></div>
            </div>
          ))}
        </div>
      </section>

      <section className="card flex flex-col items-start justify-between gap-6 p-8 sm:flex-row sm:items-center">
        <div>
          <div className="eyebrow">Project</div>
          <h2 className="mt-1 text-2xl font-bold">CSCI426 · Advanced Web Programming</h2>
          <p className="mt-1 text-ink-soft dark:text-zinc-400">Designed and developed by Ali Wehbi · Fall 2026 · Nabatieh campus</p>
        </div>
        <Link to="/contact" className="btn-primary">Get in touch</Link>
      </section>
    </div>
  )
}
