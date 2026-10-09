import type { Lesson, Step } from './types'

/** All guided steps of a lesson (every unit's steps). */
export const lessonSteps = (lesson: Lesson): Step[] => lesson.units.flatMap((u) => u.steps)
