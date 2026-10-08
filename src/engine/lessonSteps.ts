import type { Lesson, Step } from './types'

/** All guided steps of a lesson: the chapters' steps if it has chapters, otherwise `steps`. */
export function lessonSteps(lesson: Lesson): Step[] {
  return lesson.chapters && lesson.chapters.length > 0 ? lesson.chapters.flatMap((c) => c.steps) : lesson.steps
}
