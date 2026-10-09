import type { LegacyLesson, Lesson, Step } from './types'

/** All guided steps of a lesson (every unit's steps; legacy: chapters or `steps`). */
export function lessonSteps(lesson: Lesson | LegacyLesson): Step[] {
  if ('units' in lesson) return lesson.units.flatMap((u) => u.steps)
  return lesson.chapters && lesson.chapters.length > 0 ? lesson.chapters.flatMap((c) => c.steps) : lesson.steps
}
