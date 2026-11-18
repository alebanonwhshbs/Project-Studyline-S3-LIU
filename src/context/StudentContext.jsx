import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { currentCourses, letterFromScore, runningScore } from '../lib/grades'

const StudentContext = createContext(null)

const DEFAULT_PROFILE = {
  name: 'Ali Wehbi',
  studentId: '22130457',
  major: 'Computer Science',
  campus: 'Nabatieh',
  email: 'ali.wehbi@students.edu.lb',
  phone: '+961 70 000 000',
  bio: 'Third-year CS student into web apps, trading tools and building things people actually use.',
  advisor: 'Dr. Karim Jaber',
}

// Initial "what-if" guesses: current running score, or a B if nothing graded yet
const DEFAULT_EXPECTED = Object.fromEntries(
  currentCourses.map((c) => {
    const r = runningScore(c)
    return [c.code, r == null ? 'B' : letterFromScore(r)]
  }),
)

// localStorage can be unavailable (private mode, sandboxed iframes) — never crash on it
function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? { ...fallback, ...JSON.parse(raw) } : fallback
  } catch {
    return fallback
  }
}
function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* ignore */
  }
}

export function StudentProvider({ children }) {
  const [profile, setProfile] = useState(() => load('sl.profile', DEFAULT_PROFILE))
  const [expected, setExpected] = useState(() => load('sl.expected', DEFAULT_EXPECTED))
  const [dark, setDark] = useState(() => load('sl.ui', { dark: false }).dark)

  useEffect(() => save('sl.profile', profile), [profile])
  useEffect(() => save('sl.expected', expected), [expected])
  useEffect(() => {
    save('sl.ui', { dark })
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  const value = useMemo(
    () => ({
      profile,
      updateProfile: (patch) => setProfile((p) => ({ ...p, ...patch })),
      resetProfile: () => {
        setProfile(DEFAULT_PROFILE)
        return DEFAULT_PROFILE
      },
      expected,
      setExpectedGrade: (code, grade) => setExpected((e) => ({ ...e, [code]: grade })),
      resetExpected: () => setExpected(DEFAULT_EXPECTED),
      dark,
      toggleDark: () => setDark((d) => !d),
    }),
    [profile, expected, dark],
  )

  return <StudentContext.Provider value={value}>{children}</StudentContext.Provider>
}

export const useStudent = () => useContext(StudentContext)
