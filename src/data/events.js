// Upcoming deadlines and events, generated relative to "now" so the demo
// always shows a live departure board no matter when it is opened.

function at(daysFromNow, hour, minute = 0) {
  const d = new Date()
  d.setDate(d.getDate() + daysFromNow)
  d.setHours(hour, minute, 0, 0)
  return d
}

export function getDepartures() {
  return [
    { id: 1, code: 'CSCI426', title: 'Project Phase 1 — report + GitHub link', type: 'Deadline', when: at(2, 23, 59), platform: 'Classroom' },
    { id: 2, code: 'CSCI475', title: 'Search algorithms assignment', type: 'Deadline', when: at(4, 18, 0), platform: 'Classroom' },
    { id: 3, code: 'CSCI430', title: 'Lab 6 — process scheduling', type: 'Lab', when: at(1, 10, 0), platform: 'C-110' },
    { id: 4, code: 'MATH340', title: 'Homework 5 — interpolation', type: 'Deadline', when: at(6, 12, 0), platform: 'Portal' },
    { id: 5, code: 'GEN250', title: 'Field trip — Litani river', type: 'Event', when: at(9, 8, 30), platform: 'Gate A' },
    { id: 6, code: 'CSCI430', title: 'OS project proposal', type: 'Deadline', when: at(12, 23, 59), platform: 'Classroom' },
    { id: 7, code: 'CSCI475', title: 'AI project checkpoint', type: 'Meeting', when: at(15, 14, 0), platform: 'B-118' },
  ].sort((a, b) => a.when - b.when)
}

export const ANNOUNCEMENTS = [
  { id: 1, tag: 'Registration', text: 'Spring 2027 registration opens in 3 weeks — plan your next zone now.', tone: 'core' },
  { id: 2, tag: 'Library', text: 'Extended hours during finals: open until midnight, Monday to Saturday.', tone: 'math' },
  { id: 3, tag: 'Careers', text: 'Tech internship fair on campus — bring your CV and GitHub profile.', tone: 'gen' },
]
