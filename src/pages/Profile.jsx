import { useState } from 'react'
import { PageHeader } from '../components/ui'
import { useStudent } from '../context/StudentContext'
import { cumulativeGpa, creditsEarned } from '../lib/grades'

const FIELDS = [
  ['name', 'Full name'],
  ['studentId', 'Student ID'],
  ['major', 'Major'],
  ['campus', 'Campus'],
  ['email', 'Email'],
  ['phone', 'Phone'],
  ['advisor', 'Academic advisor'],
]

export default function Profile() {
  const { profile, updateProfile, resetProfile } = useStudent()
  // local draft so typing doesn't update the whole app until Save
  const [draft, setDraft] = useState(profile)
  const [saved, setSaved] = useState(false)

  const initials = draft.name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase()

  const save = (e) => {
    e.preventDefault()
    updateProfile(draft)
    setSaved(true)
    setTimeout(() => setSaved(false), 2200)
  }

  return (
    <div>
      <PageHeader eyebrow="Your journey pass" title="Profile" accent="#8B4FD8">
        Edit your details. Changes are saved in this browser and show up across the portal.
      </PageHeader>

      <div className="grid gap-8 lg:grid-cols-[1fr_1.6fr]">
        {/* student card */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="relative overflow-hidden rounded-3xl bg-ink p-6 text-white shadow-2xl dark:bg-zinc-800">
            <svg className="absolute -right-10 -top-10 opacity-30" width="220" height="220" viewBox="0 0 220 220" aria-hidden>
              <path d="M0 160 H80 L140 100 H220" stroke="#E4322B" strokeWidth="14" fill="none" />
              <path d="M40 0 V60 L100 120 V220" stroke="#1F6FEB" strokeWidth="14" fill="none" />
              <path d="M220 40 H160 L120 80" stroke="#F2A900" strokeWidth="14" fill="none" />
            </svg>
            <div className="relative">
              <div className="font-mono text-[10px] font-bold uppercase tracking-[.3em] text-white/60">StudyLine · Journey pass</div>
              <div className="mt-6 flex items-center gap-4">
                <div className="grid h-16 w-16 place-items-center rounded-2xl bg-white font-display text-2xl font-bold text-ink ring-4 ring-line-core">{initials || '?'}</div>
                <div>
                  <div className="font-display text-xl font-bold leading-tight">{draft.name || 'Your name'}</div>
                  <div className="text-sm text-white/60">{draft.major} · {draft.campus}</div>
                </div>
              </div>
              <div className="mt-6 grid grid-cols-3 gap-3 border-t border-white/15 pt-4 font-mono">
                <div><div className="text-[9px] uppercase text-white/50">ID</div><div className="text-sm font-bold">{draft.studentId}</div></div>
                <div><div className="text-[9px] uppercase text-white/50">GPA</div><div className="text-sm font-bold">{cumulativeGpa.toFixed(2)}</div></div>
                <div><div className="text-[9px] uppercase text-white/50">Credits</div><div className="text-sm font-bold">{creditsEarned}</div></div>
              </div>
              <div className="mt-5 flex h-10 items-end gap-[3px]" aria-hidden>
                {draft.studentId.padEnd(10, '0').split('').concat('3141592653'.split('')).map((d, i) => (
                  <span key={i} className="bg-white" style={{ width: (Number(d) % 3) + 1, height: '100%' }} />
                ))}
              </div>
            </div>
          </div>
          <p className="mt-4 px-1 text-sm text-ink-soft dark:text-zinc-400">{draft.bio}</p>
        </div>

        <form onSubmit={save} className="card space-y-5 p-6 sm:p-8">
          <div className="grid gap-5 sm:grid-cols-2">
            {FIELDS.map(([k, label]) => (
              <label key={k} className="block">
                <span className="mb-1.5 block text-sm font-semibold">{label}</span>
                <input className="input" value={draft[k]} onChange={(e) => setDraft({ ...draft, [k]: e.target.value })} />
              </label>
            ))}
          </div>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold">Short bio</span>
            <textarea className="input min-h-24" value={draft.bio} onChange={(e) => setDraft({ ...draft, bio: e.target.value })} />
          </label>
          <div className="flex flex-wrap items-center gap-3">
            <button className="btn-primary" type="submit">Save changes</button>
            <button className="btn-ghost" type="button" onClick={() => setDraft(resetProfile())}>Reset to demo</button>
            {saved && <span className="animate-rise text-sm font-semibold text-line-gen">✓ Saved</span>}
          </div>
        </form>
      </div>
    </div>
  )
}
