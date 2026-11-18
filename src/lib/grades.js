import { COURSES, statusOf } from '../data/courses'

export const GRADE_POINTS = {
  A: 4.0, 'A-': 3.7, 'B+': 3.3, B: 3.0, 'B-': 2.7, 'C+': 2.3, C: 2.0, 'C-': 1.7, 'D+': 1.3, D: 1.0, F: 0,
}
export const LETTERS = Object.keys(GRADE_POINTS)

/** Convert a 0–100 score to a letter grade */
export function letterFromScore(score) {
  if (score >= 93) return 'A'
  if (score >= 90) return 'A-'
  if (score >= 87) return 'B+'
  if (score >= 83) return 'B'
  if (score >= 80) return 'B-'
  if (score >= 77) return 'C+'
  if (score >= 73) return 'C'
  if (score >= 70) return 'C-'
  if (score >= 67) return 'D+'
  if (score >= 60) return 'D'
  return 'F'
}

/** GPA from a list of { credits, grade } */
export function gpa(list) {
  const graded = list.filter((c) => c.grade in GRADE_POINTS)
  const credits = graded.reduce((s, c) => s + c.credits, 0)
  if (!credits) return 0
  const points = graded.reduce((s, c) => s + c.credits * GRADE_POINTS[c.grade], 0)
  return points / credits
}

export const completedCourses = COURSES.filter((c) => statusOf(c) === 'done')
export const currentCourses = COURSES.filter((c) => statusOf(c) === 'now')

export const cumulativeGpa = gpa(completedCourses)
export const creditsEarned = completedCourses.reduce((s, c) => s + c.credits, 0)
export const creditsInProgress = currentCourses.reduce((s, c) => s + c.credits, 0)

export function termGpa(term) {
  return gpa(COURSES.filter((c) => c.term === term && c.grade))
}

/** Running score so far for a current course (only graded items count) */
export function runningScore(course) {
  const graded = (course.assessments || []).filter((a) => a.score != null)
  const w = graded.reduce((s, a) => s + a.weight, 0)
  if (!w) return null
  return graded.reduce((s, a) => s + a.score * a.weight, 0) / w
}

export function standing(g) {
  if (g >= 3.7) return "Dean's List"
  if (g >= 3.0) return 'Good standing'
  if (g >= 2.0) return 'Satisfactory'
  return 'Academic probation'
}
