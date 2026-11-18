// ─────────────────────────────────────────────────────────────
// Degree data. Each course is a "station" on a "line" (subject area).
// `term` is the zone (semester) the course sits in, 1 → 8.
// Status is derived from CURRENT_TERM: earlier = completed, equal = in progress.
// ─────────────────────────────────────────────────────────────

export const CURRENT_TERM = 5

export const TERMS = [
  { id: 1, label: 'Fall 2024' },
  { id: 2, label: 'Spring 2025' },
  { id: 3, label: 'Fall 2025' },
  { id: 4, label: 'Spring 2026' },
  { id: 5, label: 'Fall 2026' },
  { id: 6, label: 'Spring 2027' },
  { id: 7, label: 'Fall 2027' },
  { id: 8, label: 'Spring 2028' },
]

export const LINES = {
  core: { name: 'Core Line', short: 'Core', subject: 'Computer Science core', color: '#E4322B', code: 'C' },
  math: { name: 'Math Line', short: 'Math', subject: 'Mathematics', color: '#1F6FEB', code: 'M' },
  lang: { name: 'Language Line', short: 'Lang', subject: 'Languages & communication', color: '#8B4FD8', code: 'L' },
  gen: { name: 'Gen-Ed Line', short: 'Gen-Ed', subject: 'General education', color: '#14946B', code: 'G' },
  elective: { name: 'Elective Line', short: 'Elective', subject: 'Major electives', color: '#F2A900', code: 'E' },
}

// Order lines are stacked on the map (top → bottom)
export const LINE_ORDER = ['lang', 'math', 'core', 'elective', 'gen']

export const COURSES = [
  // ── Zone 1 ─────────────────────────────
  { code: 'CSCI150', title: 'Introduction to Programming', line: 'core', term: 1, credits: 3, prereqs: [], grade: 'A',
    instructor: 'Dr. Rania Haidar', description: 'Problem solving with code: variables, control flow, functions, arrays and a first look at debugging.' },
  { code: 'MATH210', title: 'Calculus I', line: 'math', term: 1, credits: 3, prereqs: [], grade: 'B+',
    instructor: 'Dr. Samir Fawaz', description: 'Limits, derivatives and their applications, with an introduction to integration.' },
  { code: 'ENGL101', title: 'Academic English', line: 'lang', term: 1, credits: 3, prereqs: [], grade: 'A-',
    instructor: 'Ms. Lina Moussa', description: 'Reading, summarising and writing structured academic arguments.' },
  { code: 'GEN110', title: 'Cultural Studies', line: 'gen', term: 1, credits: 3, prereqs: [], grade: 'A',
    instructor: 'Dr. Hiba Nasser', description: 'How culture, media and identity shape everyday life in the region and beyond.' },

  // ── Zone 2 ─────────────────────────────
  { code: 'CSCI200', title: 'Object-Oriented Programming', line: 'core', term: 2, credits: 3, prereqs: ['CSCI150'], grade: 'A',
    instructor: 'Dr. Rania Haidar', description: 'Classes, objects, inheritance, interfaces and designing small programs that grow cleanly.' },
  { code: 'MATH220', title: 'Discrete Mathematics', line: 'math', term: 2, credits: 3, prereqs: ['MATH210'], grade: 'A-',
    instructor: 'Dr. Samir Fawaz', description: 'Logic, sets, proofs, counting, relations and graphs — the maths behind computing.' },
  { code: 'ENGL102', title: 'Technical Writing', line: 'lang', term: 2, credits: 3, prereqs: ['ENGL101'], grade: 'B+',
    instructor: 'Ms. Lina Moussa', description: 'Writing documentation, reports and proposals for technical audiences.' },
  { code: 'GEN120', title: 'Ethics & Society', line: 'gen', term: 2, credits: 3, prereqs: [], grade: 'A-',
    instructor: 'Dr. Hiba Nasser', description: 'Moral reasoning applied to technology, work and public life.' },

  // ── Zone 3 ─────────────────────────────
  { code: 'CSCI250', title: 'Data Structures', line: 'core', term: 3, credits: 3, prereqs: ['CSCI200', 'MATH220'], grade: 'A-',
    instructor: 'Dr. Karim Jaber', description: 'Lists, stacks, queues, trees, heaps, hash tables and their complexity.' },
  { code: 'MATH230', title: 'Linear Algebra', line: 'math', term: 3, credits: 3, prereqs: ['MATH210'], grade: 'B',
    instructor: 'Dr. Samir Fawaz', description: 'Vectors, matrices, linear transformations and eigenvalues.' },
  { code: 'COMM201', title: 'Public Speaking', line: 'lang', term: 3, credits: 2, prereqs: ['ENGL102'], grade: 'A',
    instructor: 'Mr. Omar Saad', description: 'Planning and delivering clear, confident presentations.' },
  { code: 'CSCI270', title: 'Digital Logic', line: 'elective', term: 3, credits: 3, prereqs: ['CSCI150'], grade: 'B+',
    instructor: 'Eng. Maya Khalil', description: 'Boolean algebra, gates, combinational and sequential circuits.' },

  // ── Zone 4 ─────────────────────────────
  { code: 'CSCI300', title: 'Algorithms', line: 'core', term: 4, credits: 3, prereqs: ['CSCI250'], grade: 'B+',
    instructor: 'Dr. Karim Jaber', description: 'Divide and conquer, greedy, dynamic programming, graph algorithms and NP-completeness.' },
  { code: 'MATH310', title: 'Probability & Statistics', line: 'math', term: 4, credits: 3, prereqs: ['MATH220'], grade: 'A-',
    instructor: 'Dr. Nour Hamdan', description: 'Random variables, distributions, estimation and hypothesis testing.' },
  { code: 'CSCI326', title: 'Web Programming', line: 'elective', term: 4, credits: 3, prereqs: ['CSCI200'], grade: 'A',
    instructor: 'Eng. Maya Khalil', description: 'HTML, CSS, JavaScript and the fundamentals of building for the browser.' },
  { code: 'GEN210', title: 'Entrepreneurship', line: 'gen', term: 4, credits: 3, prereqs: [], grade: 'A',
    instructor: 'Dr. Ziad Itani', description: 'From idea to business model: validation, pitching and small-business finance.' },

  // ── Zone 5 · current term ─────────────
  { code: 'CSCI426', title: 'Advanced Web Programming', line: 'elective', term: 5, credits: 3, prereqs: ['CSCI326'],
    instructor: 'Eng. Maya Khalil', room: 'B-204',
    description: 'Component-based front ends with React, routing, state, responsive UI/UX and deployment.',
    assessments: [
      { name: 'Quizzes', weight: 10, score: 92 },
      { name: 'Project Phase 1', weight: 20, score: null },
      { name: 'Midterm', weight: 25, score: 86 },
      { name: 'Project Phase 2', weight: 20, score: null },
      { name: 'Final exam', weight: 25, score: null },
    ] },
  { code: 'CSCI430', title: 'Operating Systems', line: 'core', term: 5, credits: 3, prereqs: ['CSCI250', 'CSCI270'],
    instructor: 'Dr. Karim Jaber', room: 'C-110',
    description: 'Processes, threads, scheduling, synchronisation, memory management and file systems.',
    assessments: [
      { name: 'Labs', weight: 20, score: 88 },
      { name: 'Midterm', weight: 30, score: 79 },
      { name: 'Project', weight: 15, score: null },
      { name: 'Final exam', weight: 35, score: null },
    ] },
  { code: 'CSCI475', title: 'Artificial Intelligence', line: 'core', term: 5, credits: 3, prereqs: ['CSCI300', 'MATH310'],
    instructor: 'Dr. Nour Hamdan', room: 'B-118',
    description: 'Search, constraint satisfaction, knowledge representation, probabilistic reasoning and intro ML.',
    assessments: [
      { name: 'Assignments', weight: 25, score: 94 },
      { name: 'Midterm', weight: 25, score: 90 },
      { name: 'Project', weight: 20, score: null },
      { name: 'Final exam', weight: 30, score: null },
    ] },
  { code: 'MATH340', title: 'Numerical Methods', line: 'math', term: 5, credits: 3, prereqs: ['MATH230'],
    instructor: 'Dr. Samir Fawaz', room: 'A-301',
    description: 'Root finding, interpolation, numerical integration and solving linear systems on a computer.',
    assessments: [
      { name: 'Homework', weight: 20, score: 85 },
      { name: 'Midterm', weight: 35, score: 74 },
      { name: 'Final exam', weight: 45, score: null },
    ] },
  { code: 'GEN250', title: 'Environmental Science', line: 'gen', term: 5, credits: 2, prereqs: [],
    instructor: 'Dr. Hiba Nasser', room: 'D-012',
    description: 'Ecosystems, climate, water and energy — with a focus on South Lebanon.',
    assessments: [
      { name: 'Field report', weight: 40, score: 91 },
      { name: 'Final exam', weight: 60, score: null },
    ] },

  // ── Zone 6 ─────────────────────────────
  { code: 'CSCI440', title: 'Computer Networks', line: 'core', term: 6, credits: 3, prereqs: ['CSCI430'],
    instructor: 'TBA', description: 'Layered architecture, TCP/IP, routing, and building networked applications.' },
  { code: 'CSCI460', title: 'Machine Learning', line: 'elective', term: 6, credits: 3, prereqs: ['CSCI475', 'MATH310'],
    instructor: 'TBA', description: 'Supervised and unsupervised learning, model evaluation and neural networks.' },
  { code: 'CSCI310', title: 'Database Systems', line: 'core', term: 6, credits: 3, prereqs: ['CSCI250'],
    instructor: 'TBA', description: 'Relational modelling, SQL, normalisation, transactions and indexing.' },
  { code: 'GEN310', title: 'Arabic Literature', line: 'gen', term: 6, credits: 3, prereqs: [],
    instructor: 'TBA', description: 'Modern and classical Arabic texts and the ideas behind them.' },

  // ── Zone 7 ─────────────────────────────
  { code: 'CSCI450', title: 'Computer Security', line: 'elective', term: 7, credits: 3, prereqs: ['CSCI440'],
    instructor: 'TBA', description: 'Threat models, cryptography basics, secure coding and network defence.' },
  { code: 'CSCI480', title: 'Software Engineering', line: 'core', term: 7, credits: 3, prereqs: ['CSCI300'],
    instructor: 'TBA', description: 'Requirements, design patterns, testing, and working as a team on real software.' },
  { code: 'CSCI490', title: 'Capstone Project I', line: 'core', term: 7, credits: 3, prereqs: ['CSCI426', 'CSCI310'],
    instructor: 'TBA', description: 'Proposal, research and design of the graduation project.' },

  // ── Zone 8 ─────────────────────────────
  { code: 'CSCI495', title: 'Capstone Project II', line: 'core', term: 8, credits: 3, prereqs: ['CSCI490'],
    instructor: 'TBA', description: 'Build, test, document and defend the graduation project.' },
  { code: 'CSCI445', title: 'Cloud Computing', line: 'elective', term: 8, credits: 3, prereqs: ['CSCI440'],
    instructor: 'TBA', description: 'Virtualisation, containers, serverless and deploying at scale.' },
  { code: 'GEN410', title: 'Professional Practice', line: 'gen', term: 8, credits: 2, prereqs: ['GEN120'],
    instructor: 'TBA', description: 'Careers, workplace ethics and preparing for life after graduation.' },
]

export const TOTAL_CREDITS_REQUIRED = COURSES.reduce((s, c) => s + c.credits, 0)

export function statusOf(course) {
  if (course.term < CURRENT_TERM) return 'done'
  if (course.term === CURRENT_TERM) return 'now'
  return 'next'
}

export const byCode = Object.fromEntries(COURSES.map((c) => [c.code, c]))

/** All courses that list `code` as a prerequisite */
export function unlocks(code) {
  return COURSES.filter((c) => c.prereqs.includes(code))
}

/** Walk the prerequisite tree back to the start — the "route" to a course */
export function routeTo(code, seen = new Set()) {
  const c = byCode[code]
  if (!c || seen.has(code)) return []
  seen.add(code)
  const before = c.prereqs.flatMap((p) => routeTo(p, seen))
  return [...before, c]
}

// Weekly timetable for the current term
export const TIMETABLE = [
  { code: 'CSCI426', day: 1, start: '08:00', end: '09:30' },
  { code: 'CSCI426', day: 3, start: '08:00', end: '09:30' },
  { code: 'CSCI430', day: 1, start: '10:00', end: '11:30' },
  { code: 'CSCI430', day: 3, start: '10:00', end: '11:30' },
  { code: 'CSCI475', day: 2, start: '09:00', end: '10:30' },
  { code: 'CSCI475', day: 4, start: '09:00', end: '10:30' },
  { code: 'MATH340', day: 2, start: '12:00', end: '13:30' },
  { code: 'MATH340', day: 4, start: '12:00', end: '13:30' },
  { code: 'GEN250', day: 5, start: '11:00', end: '12:40' },
]

export const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
