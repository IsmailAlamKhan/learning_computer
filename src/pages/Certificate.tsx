import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { store, useProgress } from '../state/store'
import { useFmt } from '../ui/useFmt'

const PARTS = {
  1: { title: 'পর্ব ১: কম্পিউটারের ভিত্তি', text: 'কম্পিউটার চালানোর মৌলিক সব পাঠ — ডেস্কটপ, ফাইল-ফোল্ডার, কিবোর্ড, ইন্টারনেট, ইমেইল, নিরাপত্তা ও সমস্যা সমাধান — সফলভাবে শেষ করেছেন।', modules: [1, 13] },
  2: { title: 'পর্ব ২: প্রোগ্রামিংয়ের প্রস্তুতি', text: 'কম্পিউটার কীভাবে কাজ করে, প্রোগ্রামিং কী, টার্মিনাল, কোডিং টুলস এবং প্রথম HTML, CSS ও প্রোগ্রাম লেখা সফলভাবে শেষ করেছেন।', modules: [14, 20] },
} as const

/** Printable A4 landscape certificate ("সনদপত্র"). Shown once the part's last module is completed (or by the teacher preview). */
export default function Certificate() {
  const { part } = useParams()
  const p = (part === '2' ? 2 : 1) as 1 | 2
  const data = useProgress()
  const { date } = useFmt()
  const info = PARTS[p]
  const cert = data.certificates.find((c) => c.part === p)
  const earned = !!cert || !!data.modules[info.modules[1]]?.completed
  const name = cert?.name || data.profile.name || 'শিক্ষার্থী'
  const issued = cert?.issuedAt ?? new Date().toISOString()

  useEffect(() => {
    if (earned && !cert) store.addCertificate(p)
  }, [earned, cert, p])

  if (!earned) {
    return (
      <div className="card space-y-3">
        <h1 className="text-xl font-bold">সনদ এখনো পাওয়া যায়নি</h1>
        <p>{info.title} শেষ করলে এখানে আপনার নামে সনদ তৈরি হবে।</p>
        <Link to="/" className="btn">← হোমে ফিরুন</Link>
      </div>
    )
  }
  return (
    <div className="space-y-4">
      <div className="no-print flex flex-wrap gap-3">
        <Link to="/" className="btn btn-outline">← হোম</Link>
        <button className="btn" onClick={() => window.print()}>🖨️ ছাপুন (A4, আড়াআড়ি)</button>
      </div>
      <p className="no-print text-sm text-muted">ছাপার সময় প্রিন্ট ডায়ালগে “Landscape (আড়াআড়ি)” বেছে নিন আর “Background graphics” চালু করুন।</p>
      <section
        aria-label="সনদপত্র"
        className="certificate mx-auto flex aspect-[297/210] w-full max-w-4xl flex-col items-center justify-center gap-4 p-10 text-center"
        style={{ background: '#fffdf7', color: '#1f2937', border: '14px double #0f766e', borderRadius: 8 }}
      >
        <svg width="64" height="64" viewBox="0 0 64 64" aria-hidden="true">
          <circle cx="32" cy="32" r="28" fill="#0f766e" />
          <path d="M20 33l8 8 17-18" stroke="#fff" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <h1 className="text-4xl font-bold" style={{ color: '#0f766e' }}>সনদপত্র</h1>
        <p className="text-lg">আনন্দের সাথে জানানো হচ্ছে যে</p>
        <p className="border-b-2 px-10 text-4xl font-bold" style={{ borderColor: '#9a3412' }}>{name}</p>
        <p className="max-w-2xl text-lg">
          “কম্পিউটার শিখি” কোর্সের <strong>{info.title}</strong>-এ {info.text}
        </p>
        <p className="mt-2 text-base">তারিখ: {date(issued)}</p>
        <p className="text-sm" style={{ color: '#4b5563' }}>অভিনন্দন! শেখার এই যাত্রা চালিয়ে যান।</p>
      </section>
    </div>
  )
}
