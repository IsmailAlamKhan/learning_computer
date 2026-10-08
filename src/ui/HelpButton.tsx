import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Dialog } from './Dialog'

/** Persistent "সাহায্য" button, visible on every screen. */
export function HelpButton() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button
        className="btn no-print fixed right-3 bottom-3 z-40 shadow-lg max-sm:h-12 max-sm:w-12 max-sm:rounded-full max-sm:px-0 sm:right-4 sm:bottom-4"
        style={{ background: 'var(--c-accent)', borderColor: 'var(--c-accent)', color: 'var(--c-canvas)' }}
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
      >
        <span aria-hidden="true">❓</span> <span className="max-sm:sr-only">সাহায্য</span>
      </button>
      <Dialog open={open} onClose={() => setOpen(false)} titleBn="সাহায্য">
        <div className="space-y-4">
          <p>চিন্তা করবেন না — এখানে যা-ই করুন, আসল কম্পিউটারের কিছুই নষ্ট হবে না। ভুল করা শেখারই অংশ।</p>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              <strong>আটকে গেলে:</strong> পাঠের ভেতরে “আমি আটকে গেছি” বোতামে চাপুন — আরও সহজ করে বুঝিয়ে দেওয়া হবে।
            </li>
            <li>
              <strong>নতুন শব্দ বুঝতে না পারলে:</strong> <Link to="/glossary" onClick={() => setOpen(false)} className="underline">শব্দকোষ</Link> দেখুন।
            </li>
            <li>
              <strong>লেখা ছোট বা বড় করতে:</strong> <Link to="/settings" onClick={() => setOpen(false)} className="underline">সেটিংস</Link>-এ গিয়ে লেখার আকার বদলান।
            </li>
            <li>
              <strong>কিবোর্ড দিয়ে চলতে:</strong> <kbd>Tab</kbd> চেপে এক বোতাম থেকে আরেক বোতামে যান, <kbd>Enter</kbd> চেপে চালু করুন।
            </li>
            <li>
              <strong>শিক্ষকের সাহায্য:</strong> আপনার পাশে যিনি আছেন তাঁকে জিজ্ঞেস করুন। তিনি <Link to="/teacher" onClick={() => setOpen(false)} className="underline">শিক্ষকের পাতা</Link>-য় আপনার অগ্রগতি দেখতে পারবেন।
            </li>
          </ul>
        </div>
      </Dialog>
    </>
  )
}
