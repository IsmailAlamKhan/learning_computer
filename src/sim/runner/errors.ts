import type { FriendlyError, RunError } from './types'

/** Bengali, blame-free explanation for common beginner errors. IMPLEMENTATION PROVIDED BY THE RUNNER MODULE. */
export function translateError(_language: 'python' | 'javascript', err: RunError): FriendlyError {
  return { titleBn: 'একটি সমস্যা হয়েছে', explanationBn: err.message, tryBn: 'কোডটি আবার ধীরে পড়ে দেখুন।' }
}
