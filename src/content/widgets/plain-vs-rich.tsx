import { useState } from 'react'

/** Same sentence as plain text and as formatted text — with the hidden markup made visible. Conceptual only. */
export const PLAIN_TEXT = 'Hello, my name is Ruma.'
export const RICH_MARKUP = 'Hello, my name is <b>Ruma</b>.'

export default function PlainVsRich() {
  const [show, setShow] = useState(false)
  return (
    <div className="card space-y-4 p-4" data-testid="plain-vs-rich">
      <p className="font-semibold">একই বাক্য — দুইভাবে সেভ করলে কী হয় দেখুন</p>
      <div className="grid gap-4 md:grid-cols-2">
        <section className="rounded-xl border-2 p-3" style={{ borderColor: 'var(--c-line)' }} aria-label="Plain text">
          <h3 className="font-semibold">সাধারণ লেখা (Plain text) — <code>hello.txt</code></h3>
          <p className="mt-2 rounded-lg p-3 font-mono" style={{ background: 'var(--c-sunken)' }} data-testid="plain-body">
            {PLAIN_TEXT}
          </p>
          <p className="mt-2 text-sm" style={{ color: 'var(--c-muted)' }}>ফাইলের ভেতরে শুধু আপনার লেখা অক্ষরগুলোই আছে। আর কিছু নেই।</p>
        </section>
        <section className="rounded-xl border-2 p-3" style={{ borderColor: 'var(--c-line)' }} aria-label="Formatted text">
          <h3 className="font-semibold">সাজানো লেখা (Formatted text) — যেমন Word ফাইল</h3>
          <p className="mt-2 rounded-lg p-3" style={{ background: 'var(--c-sunken)' }} data-testid="rich-body">
            {show ? <code className="font-mono">{RICH_MARKUP}</code> : <>Hello, my name is <b>Ruma</b>.</>}
          </p>
          <p className="mt-2 text-sm" style={{ color: 'var(--c-muted)' }}>
            পর্দায় “Ruma” মোটা দেখায়। কিন্তু ফাইলের ভেতরে মোটা করার জন্য লুকানো নির্দেশ (মার্কআপ) জমা থাকে।
          </p>
          <button type="button" className="btn btn-outline mt-2" aria-pressed={show} onClick={() => setShow((s) => !s)}>
            {show ? 'সাজানো রূপ দেখান' : 'লুকানো নির্দেশ দেখান'}
          </button>
        </section>
      </div>
      <p className="text-sm">
        প্রোগ্রামে কম্পিউটারকে ঠিক যা লেখা হয়েছে সেটুকুই পড়তে হয়। লুকানো নির্দেশ থাকলে প্রোগ্রাম গোলমাল করে — তাই প্রোগ্রামিংয়ের ফাইল সাধারণ লেখার (plain text) এডিটরে লেখা হয়।
      </p>
    </div>
  )
}
