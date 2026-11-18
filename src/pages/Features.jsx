import { Link } from 'react-router-dom'
import { PageHeader } from '../components/ui'

const FEATURES = [
  {
    color: '#E4322B', title: 'Degree transit map', to: '/courses',
    text: 'Your whole programme drawn as a metro network. Lines are subject areas, zones are semesters, stations are courses — completed, in progress or planned at a glance.',
    art: (
      <svg viewBox="0 0 160 80" className="h-full w-full">
        <path d="M10 60 H60 L80 40 H150" stroke="#E4322B" strokeWidth="7" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M10 20 H70 L90 40" stroke="#1F6FEB" strokeWidth="7" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        {[[35, 60], [80, 40], [115, 40], [40, 20]].map(([x, y]) => <circle key={x + y} cx={x} cy={y} r="7" fill="#fff" stroke="#16161D" strokeWidth="3" />)}
      </svg>
    ),
  },
  {
    color: '#1F6FEB', title: 'Prerequisite routing', to: '/courses/CSCI490',
    text: 'Hover or open any course to trace the exact route of prerequisites that leads to it — and see which future courses it unlocks.',
    art: (
      <svg viewBox="0 0 160 80" className="h-full w-full">
        <path d="M20 60 C60 60 60 20 100 20 S140 50 145 50" stroke="#16161D" strokeWidth="3" strokeDasharray="6 5" fill="none" />
        {[[20, 60], [100, 20], [145, 50]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="8" fill={['#1F6FEB', '#E4322B', '#F2A900'][i]} stroke="#fff" strokeWidth="3" />)}
      </svg>
    ),
  },
  {
    color: '#F2A900', title: 'Departure board', to: '/dashboard',
    text: 'Deadlines, labs and events displayed like a station board with live countdowns. Anything leaving in under 48 hours turns red.',
    art: (
      <svg viewBox="0 0 160 80" className="h-full w-full">
        <rect x="8" y="10" width="144" height="60" rx="8" fill="#101114" />
        {[24, 40, 56].map((y, i) => (
          <g key={y}><rect x="18" y={y - 6} width="26" height="9" rx="2" fill={['#E4322B', '#1F6FEB', '#14946B'][i]} />
            <rect x="52" y={y - 4} width={60 - i * 10} height="5" rx="2" fill="#FCD34D" opacity=".8" />
            <rect x="124" y={y - 4} width="18" height="5" rx="2" fill={i === 0 ? '#F87171' : '#FCD34D'} /></g>
        ))}
      </svg>
    ),
  },
  {
    color: '#14946B', title: 'What-if GPA simulator', to: '/grades',
    text: 'Pick the grade you expect in each current course and instantly see your projected term and cumulative GPA — before the results are out.',
    art: (
      <svg viewBox="0 0 160 80" className="h-full w-full">
        {[30, 45, 38, 55].map((h, i) => <rect key={i} x={22 + i * 30} y={70 - h} width="20" height={h} rx="4" fill="#16161D" />)}
        <rect x={22 + 4 * 30} y={8} width="20" height="62" rx="4" fill="#14946B" opacity=".25" stroke="#14946B" strokeWidth="2" strokeDasharray="4 3" />
      </svg>
    ),
  },
  {
    color: '#8B4FD8', title: 'Live timetable', to: '/timetable',
    text: 'A weekly grid that highlights today, marks the current time and flags the class happening right now. On mobile it becomes simple day tabs.',
    art: (
      <svg viewBox="0 0 160 80" className="h-full w-full">
        {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={12 + i * 29} y="8" width="25" height="64" rx="4" fill={i === 2 ? '#8B4FD8' : '#16161D'} opacity={i === 2 ? 0.12 : 0.05} />)}
        <rect x="14" y="14" width="21" height="18" rx="3" fill="#E4322B" /><rect x="72" y="14" width="21" height="18" rx="3" fill="#8B4FD8" />
        <rect x="43" y="36" width="21" height="22" rx="3" fill="#1F6FEB" /><rect x="101" y="36" width="21" height="22" rx="3" fill="#F2A900" />
        <path d="M8 44 H152" stroke="#E4322B" strokeWidth="2" /><circle cx="8" cy="44" r="3.5" fill="#E4322B" />
      </svg>
    ),
  },
  {
    color: '#16161D', title: 'Quick jump (Ctrl + K)', to: '/',
    text: 'Press Ctrl + K (⌘ K on Mac) anywhere to search every page and course. Arrow keys to move, Enter to go.',
    art: (
      <svg viewBox="0 0 160 80" className="h-full w-full">
        <rect x="16" y="16" width="128" height="48" rx="10" fill="#fff" stroke="#16161D" strokeWidth="2" />
        <circle cx="34" cy="40" r="6" fill="none" stroke="#16161D" strokeWidth="2.5" /><path d="M38.5 44.5 L43 49" stroke="#16161D" strokeWidth="2.5" />
        <rect x="52" y="36" width="50" height="8" rx="3" fill="#16161D" opacity=".15" />
        <rect x="110" y="33" width="24" height="14" rx="3" fill="#16161D" /><text x="122" y="43" textAnchor="middle" fontSize="8" fill="#fff" fontFamily="monospace">⌘K</text>
      </svg>
    ),
  },
]

const EXTRAS = [
  ['Night service', 'A full dark mode that remembers your choice.'],
  ['Saved locally', 'Your profile and what-if grades persist in the browser.'],
  ['Fully responsive', 'Designed for phones first: the map scrolls, the timetable becomes tabs.'],
  ['Accessible', 'Keyboard navigable map, skip link, reduced-motion support.'],
]

export default function Features() {
  return (
    <div>
      <PageHeader eyebrow="Services" title="Everything a student needs, on one network.">
        StudyLine replaces the usual wall of tables with a map you already know how to read. Here's what's on board.
      </PageHeader>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f, i) => (
          <Link key={f.title} to={f.to} className="card group animate-rise overflow-hidden p-0 transition hover:-translate-y-1" style={{ animationDelay: `${i * 60}ms` }}>
            <div className="h-36 border-b border-ink/10 bg-paper p-4 dark:border-white/10 dark:bg-white/[.03]">{f.art}</div>
            <div className="p-5">
              <div className="mb-2 h-1.5 w-8 rounded-full" style={{ background: f.color }} />
              <h3 className="text-lg font-bold group-hover:underline">{f.title}</h3>
              <p className="mt-2 text-sm text-ink-soft dark:text-zinc-400">{f.text}</p>
              <span className="mt-4 inline-block text-sm font-semibold" style={{ color: f.color === '#16161D' ? undefined : f.color }}>Try it →</span>
            </div>
          </Link>
        ))}
      </div>

      <section className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {EXTRAS.map(([t, d]) => (
          <div key={t} className="rounded-2xl border-2 border-dashed border-ink/15 p-5 dark:border-white/15">
            <h3 className="font-bold">{t}</h3>
            <p className="mt-1 text-sm text-ink-soft dark:text-zinc-400">{d}</p>
          </div>
        ))}
      </section>
    </div>
  )
}
