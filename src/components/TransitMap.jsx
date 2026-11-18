import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  COURSES, CURRENT_TERM, LINES, LINE_ORDER, TERMS, byCode, routeTo, statusOf, unlocks,
} from '../data/courses'

// Geometry
const PAD_L = 132
const PAD_T = 78
const COL_W = 158
const ROW_H = 86
const GAP = 64 // spacing between stations that share a line + zone
const W = PAD_L + TERMS.length * COL_W + 24
const H = PAD_T + LINE_ORDER.length * ROW_H + 18

function layout() {
  const groups = {}
  COURSES.forEach((c) => {
    const k = `${c.line}|${c.term}`
    ;(groups[k] ||= []).push(c)
  })
  const pos = {}
  Object.values(groups).forEach((list) => {
    list.forEach((c, i) => {
      const off = (i - (list.length - 1) / 2) * GAP
      pos[c.code] = {
        x: PAD_L + (c.term - 0.5) * COL_W + off,
        y: PAD_T + LINE_ORDER.indexOf(c.line) * ROW_H + ROW_H / 2,
      }
    })
  })
  return pos
}

/**
 * Interactive SVG metro map of the whole degree.
 * - hover/focus a station → its prerequisite route and what it unlocks light up
 * - click a station → open the course page
 * - `focus` prop pins the highlight on one course (used on the course page)
 */
export default function TransitMap({ focus = null, compact = false }) {
  const navigate = useNavigate()
  const pos = useMemo(layout, [])
  const [hover, setHover] = useState(null)
  const active = hover || focus

  const lit = useMemo(() => {
    if (!active) return null
    const set = new Set(routeTo(active).map((c) => c.code))
    unlocks(active).forEach((c) => set.add(c.code))
    return set
  }, [active])

  // prerequisite edges inside the lit set
  const edges = useMemo(() => {
    if (!lit) return []
    const out = []
    lit.forEach((code) => {
      byCode[code].prereqs.forEach((p) => {
        if (lit.has(p)) out.push([p, code])
      })
    })
    return out
  }, [lit])

  const lineSegments = LINE_ORDER.map((key) => {
    const stations = COURSES.filter((c) => c.line === key).sort((a, b) => pos[a.code].x - pos[b.code].x)
    const segs = []
    for (let i = 0; i < stations.length - 1; i++) {
      segs.push({ from: stations[i], to: stations[i + 1] })
    }
    return { key, stations, segs }
  })

  const youX = PAD_L + (CURRENT_TERM - 0.5) * COL_W
  const go = (code) => navigate(`/courses/${code}`)

  // On narrow screens, start the scrolled map centred on "You are here"
  const scroller = useRef(null)
  useEffect(() => {
    const el = scroller.current
    if (!el || el.scrollWidth <= el.clientWidth) return
    const target = focus ? pos[focus].x : youX
    el.scrollLeft = (target / W) * el.scrollWidth - el.clientWidth / 2
  }, [focus, pos, youX])

  return (
    <div ref={scroller} className="scroll-fade overflow-x-auto pb-2">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full"
        style={{ minWidth: compact ? 900 : 1040 }}
        role="img"
        aria-label="Degree map. Each station is a course, each coloured line is a subject area, columns are semesters."
      >
        {/* zones (semesters) */}
        {TERMS.map((t, i) => (
          <g key={t.id}>
            <rect
              x={PAD_L + i * COL_W}
              y={PAD_T - 34}
              width={COL_W}
              height={H - PAD_T + 26}
              className={i % 2 ? 'fill-ink/[.025] dark:fill-white/[.03]' : 'fill-transparent'}
            />
            <text x={PAD_L + i * COL_W + COL_W / 2} y={28} textAnchor="middle"
              className="fill-ink-soft font-mono text-[10px] font-bold uppercase tracking-[.18em] dark:fill-zinc-400">
              Zone {t.id}
            </text>
            <text x={PAD_L + i * COL_W + COL_W / 2} y={44} textAnchor="middle"
              className={`font-display text-[12px] font-semibold ${t.id === CURRENT_TERM ? 'fill-line-core' : 'fill-ink dark:fill-zinc-200'}`}>
              {t.label}
            </text>
          </g>
        ))}

        {/* you-are-here band */}
        <g>
          <line x1={youX} x2={youX} y1={PAD_T - 22} y2={H - 6} strokeDasharray="3 5"
            className="stroke-line-core" strokeWidth="1.5" />
          <rect x={youX - 44} y={H - 22} width={88} height={18} rx={9} className="fill-line-core" />
          <text x={youX} y={H - 9.5} textAnchor="middle" className="fill-white font-mono text-[9.5px] font-bold uppercase tracking-wider">
            You are here
          </text>
        </g>

        {/* line names on the left */}
        {LINE_ORDER.map((key, i) => {
          const L = LINES[key]
          const y = PAD_T + i * ROW_H + ROW_H / 2
          return (
            <g key={key} opacity={lit ? 0.5 : 1}>
              <rect x={8} y={y - 12} width={24} height={24} rx={12} fill={L.color} />
              <text x={20} y={y + 4} textAnchor="middle" className="fill-white font-mono text-[11px] font-bold">{L.code}</text>
              <text x={40} y={y + 4} className="fill-ink font-display text-[12.5px] font-semibold dark:fill-zinc-200">{L.short}</text>
            </g>
          )
        })}

        {/* the lines */}
        {lineSegments.map(({ key, segs, stations }) => {
          const color = LINES[key].color
          const first = pos[stations[0].code]
          const last = pos[stations[stations.length - 1].code]
          return (
            <g key={key} opacity={lit ? 0.22 : 1} style={{ transition: 'opacity .25s' }}>
              {/* terminus caps */}
              <line x1={first.x - 22} x2={first.x - 22} y1={first.y - 9} y2={first.y + 9} stroke={color} strokeWidth="5" strokeLinecap="round" />
              <line x1={first.x - 22} x2={first.x} y1={first.y} y2={first.y} stroke={color} strokeWidth="7" />
              <line x1={last.x + 22} x2={last.x + 22} y1={last.y - 9} y2={last.y + 9} stroke={color} strokeWidth="5" strokeLinecap="round" opacity=".45" />
              <line x1={last.x} x2={last.x + 22} y1={last.y} y2={last.y} stroke={color} strokeWidth="7" opacity=".35" />
              {segs.map(({ from, to }) => {
                const a = pos[from.code], b = pos[to.code]
                const travelled = statusOf(to) !== 'next'
                return travelled ? (
                  <line key={to.code} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={color} strokeWidth="7"
                    strokeLinecap="round" pathLength="1" strokeDasharray="1" strokeDashoffset="1" className="animate-dash" />
                ) : (
                  <line key={to.code} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={color} strokeWidth="7" opacity=".35" />
                )
              })}
            </g>
          )
        })}

        {/* highlighted prerequisite route */}
        {edges.map(([p, c]) => {
          const a = pos[p], b = pos[c]
          const mx = (a.x + b.x) / 2
          return (
            <path key={p + c} d={`M${a.x},${a.y} C${mx},${a.y} ${mx},${b.y} ${b.x},${b.y}`}
              fill="none" strokeWidth="3" className="stroke-ink dark:stroke-white" strokeDasharray="6 5" />
          )
        })}

        {/* stations */}
        {COURSES.map((c, idx) => {
          const { x, y } = pos[c.code]
          const s = statusOf(c)
          const color = LINES[c.line].color
          const on = !lit || lit.has(c.code)
          const isActive = active === c.code
          const labelAbove = idx % 2 === 0
          return (
            <g
              key={c.code}
              role="link"
              tabIndex={0}
              aria-label={`${c.code} ${c.title}, ${s === 'done' ? 'completed' : s === 'now' ? 'in progress' : 'planned'}`}
              onMouseEnter={() => setHover(c.code)}
              onMouseLeave={() => setHover(null)}
              onFocus={() => setHover(c.code)}
              onBlur={() => setHover(null)}
              onClick={() => go(c.code)}
              onKeyDown={(e) => e.key === 'Enter' && go(c.code)}
              className="cursor-pointer outline-none"
              opacity={on ? 1 : 0.25}
              style={{ transition: 'opacity .25s' }}
            >
              {s === 'now' && (
                <circle cx={x} cy={y} r={11} fill={color} className="animate-pulseRing" style={{ transformOrigin: `${x}px ${y}px`, transformBox: 'view-box' }} />
              )}
              <circle cx={x} cy={y} r={isActive ? 15 : 11}
                className={s === 'next' ? 'fill-paper dark:fill-paper-dark' : 'fill-white'}
                stroke={s === 'next' ? color : '#16161D'}
                strokeWidth={s === 'now' ? 4 : 3}
                strokeDasharray={s === 'next' ? '3 3' : undefined}
                style={{ transition: 'r .2s' }}
              />
              {s === 'done' && <circle cx={x} cy={y} r={5} fill={color} />}
              {s === 'now' && <circle cx={x} cy={y} r={4} className="fill-ink" />}
              <text x={x} y={labelAbove ? y - 20 : y + 29} textAnchor="middle"
                className={`font-mono text-[10.5px] font-bold ${s === 'next' ? 'fill-ink-soft dark:fill-zinc-500' : 'fill-ink dark:fill-zinc-100'}`}>
                {c.code.replace(/(\D+)(\d+)/, '$1 $2')}
              </text>
              {/* hit area */}
              <circle cx={x} cy={y} r={24} fill="transparent" />
            </g>
          )
        })}

        {/* tooltip */}
        {active && (() => {
          const c = byCode[active]
          const { x, y } = pos[active]
          const w = Math.max(170, c.title.length * 7 + 24)
          const tx = Math.min(Math.max(x - w / 2, 4), W - w - 4)
          const above = y > PAD_T + ROW_H * 2
          const ty = above ? y - 78 : y + 38
          return (
            <g pointerEvents="none">
              <rect x={tx} y={ty} width={w} height={44} rx={10} className="fill-ink dark:fill-white" />
              <text x={tx + 12} y={ty + 18} className="fill-white font-display text-[12.5px] font-semibold dark:fill-ink">{c.title}</text>
              <text x={tx + 12} y={ty + 34} className="fill-white/70 font-mono text-[10px] dark:fill-ink/70">
                {LINES[c.line].short} · {c.credits} cr · {statusOf(c) === 'done' ? `Grade ${c.grade}` : statusOf(c) === 'now' ? 'In progress' : 'Planned'}
              </text>
            </g>
          )
        })()}
      </svg>
    </div>
  )
}

export function MapLegend() {
  const item = 'flex items-center gap-2 text-xs text-ink-soft dark:text-zinc-400'
  return (
    <div className="flex flex-wrap gap-x-5 gap-y-2">
      <span className={item}>
        <svg width="18" height="18"><circle cx="9" cy="9" r="6.5" fill="#fff" stroke="#16161D" strokeWidth="2.5" /><circle cx="9" cy="9" r="3" fill="#E4322B" /></svg>
        Completed
      </span>
      <span className={item}>
        <svg width="18" height="18"><circle cx="9" cy="9" r="6.5" fill="#fff" stroke="#16161D" strokeWidth="3.5" /><circle cx="9" cy="9" r="2.4" fill="#16161D" /></svg>
        In progress
      </span>
      <span className={item}>
        <svg width="18" height="18"><circle cx="9" cy="9" r="6.5" fill="none" stroke="#E4322B" strokeWidth="2.5" strokeDasharray="3 3" /></svg>
        Planned
      </span>
      <span className={item}>
        <svg width="26" height="10"><path d="M1 5 H25" stroke="currentColor" strokeWidth="2.5" strokeDasharray="5 4" /></svg>
        Prerequisite route (hover a station)
      </span>
    </div>
  )
}
