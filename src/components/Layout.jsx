import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { NAV } from './nav'
import CommandPalette from './CommandPalette'
import { useStudent } from '../context/StudentContext'

function Logo() {
  return (
    <Link to="/" className="group flex items-center gap-2.5" aria-label="StudyLine home">
      <svg width="34" height="34" viewBox="0 0 32 32" className="transition group-hover:rotate-[-8deg]">
        <rect width="32" height="32" rx="9" className="fill-ink dark:fill-white" />
        <path d="M6 22 L13 15 L19 15 L26 8" stroke="#E4322B" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="13" cy="15" r="3.2" fill="#fff" stroke="#16161D" strokeWidth="1.6" />
        <circle cx="19" cy="15" r="3.2" fill="#fff" stroke="#16161D" strokeWidth="1.6" />
      </svg>
      <span className="font-display text-lg font-bold tracking-tight">
        Study<span className="text-line-core">Line</span>
      </span>
    </Link>
  )
}

function initials(name) {
  return name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase()
}

export default function Layout() {
  const { profile, dark, toggleDark } = useStudent()
  const [menu, setMenu] = useState(false)
  const [palette, setPalette] = useState(false)
  const { pathname } = useLocation()
  const links = NAV.filter((n) => n.to !== '/profile')

  useEffect(() => {
    setMenu(false)
    window.scrollTo(0, 0)
  }, [pathname])

  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setPalette((p) => !p)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-white focus:px-3 focus:py-2">
        Skip to content
      </a>

      <header className="sticky top-0 z-40 border-b border-ink/10 bg-paper/85 backdrop-blur-md dark:border-white/10 dark:bg-paper-dark/85">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <Logo />

          <nav className="hidden items-center lg:flex" aria-label="Main">
            {links.map((n) => (
              <NavLink key={n.to} to={n.to} end={n.to === '/'}
                className={({ isActive }) =>
                  `relative px-3 py-2 text-sm font-medium transition ${isActive ? 'text-ink dark:text-white' : 'text-ink-soft hover:text-ink dark:text-zinc-400 dark:hover:text-white'}`}>
                {({ isActive }) => (
                  <>
                    {n.label}
                    <span className={`absolute inset-x-3 -bottom-[13px] h-1 rounded-full transition ${isActive ? 'opacity-100' : 'opacity-0'}`}
                      style={{ background: n.color }} />
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button onClick={() => setPalette(true)}
              className="hidden items-center gap-2 rounded-full border border-ink/15 px-3 py-1.5 text-xs text-ink-soft transition hover:border-ink/40 dark:border-white/15 dark:text-zinc-400 md:flex">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
              Jump to…
              <kbd className="rounded bg-ink/5 px-1 font-mono text-[10px] dark:bg-white/10">Ctrl K</kbd>
            </button>
            <button onClick={toggleDark} aria-label={dark ? 'Switch to day service' : 'Switch to night service'}
              className="grid h-9 w-9 place-items-center rounded-full border border-ink/15 transition hover:rotate-12 dark:border-white/15">
              {dark ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" /></svg>
              )}
            </button>
            <Link to="/profile" aria-label="Your profile"
              className="grid h-9 w-9 place-items-center rounded-full bg-ink font-display text-xs font-bold text-white ring-2 ring-line-core ring-offset-2 ring-offset-paper dark:bg-white dark:text-ink dark:ring-offset-paper-dark">
              {initials(profile.name) || '?'}
            </Link>
            <button onClick={() => setMenu((m) => !m)} aria-label="Menu" aria-expanded={menu}
              className="grid h-9 w-9 place-items-center rounded-full border border-ink/15 dark:border-white/15 lg:hidden">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                {menu ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
              </svg>
            </button>
          </div>
        </div>

        {/* mobile menu — styled as a line diagram */}
        {menu && (
          <nav className="animate-rise border-t border-ink/10 px-6 pb-6 pt-4 dark:border-white/10 lg:hidden" aria-label="Mobile">
            <button onClick={() => { setMenu(false); setPalette(true) }} className="input mb-4 text-left text-ink-soft">Jump to a page or course…</button>
            <ul className="relative ml-2 border-l-4 border-line-core pl-6">
              {NAV.map((n) => (
                <li key={n.to} className="relative py-2">
                  <span className="absolute -left-[34px] top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border-[3px] border-ink bg-white dark:border-white dark:bg-paper-dark" />
                  <NavLink to={n.to} end={n.to === '/'}
                    className={({ isActive }) => `font-display text-lg font-semibold ${isActive ? 'text-line-core' : ''}`}>
                    {n.label}
                  </NavLink>
                  <span className="block text-xs text-ink-soft dark:text-zinc-400">{n.hint}</span>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </header>

      <main id="main" className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <Outlet />
      </main>

      <footer className="border-t border-ink/10 dark:border-white/10">
        <div className="flex h-2">
          {['#8B4FD8', '#1F6FEB', '#E4322B', '#F2A900', '#14946B'].map((c) => <span key={c} className="flex-1" style={{ background: c }} />)}
        </div>
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-3 max-w-sm text-sm text-ink-soft dark:text-zinc-400">
              A student portal that turns your degree into a metro map — so you always know where you are, where you're going, and what's departing next.
            </p>
          </div>
          <div>
            <div className="eyebrow mb-3">Portal</div>
            <ul className="space-y-1.5 text-sm">
              {NAV.slice(0, 5).map((n) => <li key={n.to}><Link className="hover:text-line-core" to={n.to}>{n.label}</Link></li>)}
            </ul>
          </div>
          <div>
            <div className="eyebrow mb-3">Info</div>
            <ul className="space-y-1.5 text-sm">
              {NAV.slice(5).map((n) => <li key={n.to}><Link className="hover:text-line-core" to={n.to}>{n.label}</Link></li>)}
            </ul>
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-4 pb-8 font-mono text-[11px] text-ink-soft dark:text-zinc-500 sm:px-6">
          © {new Date().getFullYear()} StudyLine · Built by Ali Wehbi for CSCI426 Advanced Web Programming · Demo data only
        </div>
      </footer>

      <CommandPalette open={palette} onClose={() => setPalette(false)} />
    </div>
  )
}
