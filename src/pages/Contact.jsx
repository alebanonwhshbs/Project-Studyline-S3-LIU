import { useState } from 'react'
import { PageHeader } from '../components/ui'
import { useStudent } from '../context/StudentContext'

const TOPICS = ['Registration & courses', 'Grades & transcripts', 'Technical problem with the portal', 'Financial office', 'Something else']

const OFFICES = [
  { color: '#E4322B', title: 'Registrar', line: 'Building A · Ground floor', hours: 'Mon–Fri · 08:00–15:00', mail: 'registrar@studyline.edu' },
  { color: '#1F6FEB', title: 'IT help desk', line: 'Building C · Room 010', hours: 'Mon–Fri · 08:00–16:00', mail: 'helpdesk@studyline.edu' },
  { color: '#14946B', title: 'Student affairs', line: 'Building D · First floor', hours: 'Mon–Thu · 09:00–14:00', mail: 'students@studyline.edu' },
]

const FAQ = [
  ['How do I change my expected grades?', 'Go to Grades and use the what-if simulator. Your picks are saved in this browser.'],
  ['Why is a course shown as a dashed station?', 'Dashed stations are planned courses in future zones (semesters) that you have not started yet.'],
  ['Can I use StudyLine on my phone?', 'Yes — every page is responsive. The map scrolls sideways and the timetable switches to day tabs.'],
]

export default function Contact() {
  const { profile } = useStudent()
  const [form, setForm] = useState({ name: profile.name, email: profile.email, topic: TOPICS[0], message: '' })
  const [errors, setErrors] = useState({})
  const [ticket, setTicket] = useState(null)

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = (e) => {
    e.preventDefault()
    const err = {}
    if (form.name.trim().length < 2) err.name = 'Please enter your name.'
    if (!/^\S+@\S+\.\S+$/.test(form.email)) err.email = 'Please enter a valid email address.'
    if (form.message.trim().length < 15) err.message = 'Tell us a little more (at least 15 characters).'
    setErrors(err)
    if (Object.keys(err).length === 0) {
      setTicket({ id: `SL-${Math.floor(100000 + Math.random() * 900000)}`, ...form, at: new Date() })
    }
  }

  return (
    <div>
      <PageHeader eyebrow="Help point" title="Contact student services" accent="#14946B">
        Send a message and we'll issue you a ticket. Most questions get an answer within one working day.
      </PageHeader>

      <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div className="card p-6 sm:p-8">
          {ticket ? (
            <div className="animate-rise text-center">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-line-gen text-3xl text-white">✓</div>
              <h2 className="mt-4 text-2xl font-bold">Ticket issued</h2>
              <p className="mt-1 text-ink-soft">We've received your message about “{ticket.topic}”.</p>
              <div className="mx-auto mt-6 max-w-sm rounded-2xl border-2 border-dashed border-ink/20 p-5 text-left font-mono text-sm dark:border-white/20">
                <div className="flex justify-between"><span className="text-ink-soft">Ticket</span><strong>{ticket.id}</strong></div>
                <div className="mt-1 flex justify-between"><span className="text-ink-soft">Reply to</span><span className="truncate pl-4">{ticket.email}</span></div>
                <div className="mt-1 flex justify-between"><span className="text-ink-soft">Issued</span><span>{ticket.at.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span></div>
              </div>
              <button className="btn-ghost mt-6" onClick={() => { setTicket(null); setForm((f) => ({ ...f, message: '' })) }}>Send another message</button>
            </div>
          ) : (
            <form onSubmit={submit} noValidate className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Full name" error={errors.name}>
                  <input className="input" value={form.name} onChange={set('name')} autoComplete="name" />
                </Field>
                <Field label="Email" error={errors.email}>
                  <input className="input" type="email" value={form.email} onChange={set('email')} autoComplete="email" />
                </Field>
              </div>
              <Field label="Topic">
                <select className="input" value={form.topic} onChange={set('topic')}>
                  {TOPICS.map((t) => <option key={t}>{t}</option>)}
                </select>
              </Field>
              <Field label="Message" error={errors.message} hint={`${form.message.length}/600`}>
                <textarea className="input min-h-36 resize-y" maxLength={600} value={form.message} onChange={set('message')}
                  placeholder="How can we help?" />
              </Field>
              <button className="btn-primary w-full sm:w-auto" type="submit">Send message →</button>
            </form>
          )}
        </div>

        <aside className="space-y-4">
          {OFFICES.map((o) => (
            <div key={o.title} className="card flex gap-4 p-5">
              <span className="w-1.5 shrink-0 rounded-full" style={{ background: o.color }} />
              <div className="text-sm">
                <div className="font-display text-base font-bold">{o.title}</div>
                <div className="text-ink-soft dark:text-zinc-400">{o.line}</div>
                <div className="font-mono text-xs text-ink-soft">{o.hours}</div>
                <a href={`mailto:${o.mail}`} className="mt-1 inline-block font-semibold hover:underline" style={{ color: o.color }}>{o.mail}</a>
              </div>
            </div>
          ))}
        </aside>
      </div>

      <section className="mt-14">
        <h2 className="mb-4 text-2xl font-bold">Frequently asked</h2>
        <div className="space-y-3">
          {FAQ.map(([q, a]) => (
            <details key={q} className="card group p-5">
              <summary className="flex cursor-pointer list-none items-center justify-between font-semibold">
                {q}<span className="ml-4 text-xl transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm text-ink-soft dark:text-zinc-400">{a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  )
}

function Field({ label, error, hint, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 flex justify-between text-sm font-semibold">
        {label}
        {hint && <span className="font-mono text-xs font-normal text-ink-soft">{hint}</span>}
      </span>
      {children}
      {error && <span className="mt-1 block text-xs font-medium text-red-600" role="alert">{error}</span>}
    </label>
  )
}
