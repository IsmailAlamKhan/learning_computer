import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { store, useProgress } from '../state/store'
import { Choice } from '../ui/Choice'
import type { OsFlavor } from '../engine/types'
import type { TextSize } from '../state/progress'

const STEPS = 4

export default function Onboarding() {
  const nav = useNavigate()
  const { profile, settings } = useProgress()
  const [step, setStep] = useState(0)
  const [name, setName] = useState(profile.name)
  const [os, setOs] = useState<OsFlavor>(profile.os)
  const [motivation, setMotivation] = useState(profile.motivation)

  const finish = () => {
    store.setProfile({ name: name.trim(), os, motivation: motivation.trim(), onboarded: true })
    nav('/', { replace: true })
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <p className="text-muted" aria-live="polite">ধাপ {['১', '২', '৩', '৪'][step]} / {['১', '২', '৩', '৪'][STEPS - 1]}</p>
      <div className="card space-y-6">
        {step === 0 && (
          <>
            <h1 className="text-2xl font-bold">স্বাগতম! 🌸</h1>
            <p>
              এই কোর্সে আপনি ধাপে ধাপে কম্পিউটার চালানো শিখবেন, তারপর প্রোগ্রামিংয়ের জন্য তৈরি হবেন। সবকিছু একটি নিরাপদ নকল কম্পিউটারে অনুশীলন করবেন, তাই কিছু ভুল করলেও আসল কম্পিউটারের কোনো ক্ষতি হবে না।
            </p>
            <label className="block space-y-2">
              <span className="font-bold">আপনার নাম কী?</span>
              <input
                className="field"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="যেমন: রুমা"
                autoComplete="given-name"
                maxLength={60}
                autoFocus
              />
              <span className="block text-sm text-muted">নামটি শুধু এই কম্পিউটারেই থাকবে। সনদে এই নাম ছাপা হবে।</span>
            </label>
          </>
        )}
        {step === 1 && (
          <>
            <h1 className="text-2xl font-bold">আপনার কম্পিউটারে কোনটি চলে?</h1>
            <p>এখন যেটি আপনি আসলে ব্যবহার করেন, সেটি বেছে নিন। পরে সেটিংস থেকে আবার বদলাতে পারবেন।</p>
            <Choice
              legend="আপনার কম্পিউটারের ধরন"
              value={os}
              onChange={setOs}
              options={[
                { value: 'windows', label: 'Windows', sub: 'নিচে একটি লম্বা বার (টাস্কবার) থাকে, বাঁ-কোণে বা মাঝখানে স্টার্ট বোতাম।' },
                { value: 'mac', label: 'Mac (macOS)', sub: 'ওপরে একটি মেনু বার এবং নিচে আইকনের সারি (ডক) থাকে।' },
              ]}
            />
            <p className="text-sm text-muted">নিশ্চিত না হলে পাশের মানুষটিকে জিজ্ঞেস করুন। দুটিই শেখানো হবে।</p>
          </>
        )}
        {step === 2 && (
          <>
            <h1 className="text-2xl font-bold">লেখার আকার</h1>
            <p>নিচের লেখাটি আরামে পড়তে পারছেন কি না দেখুন। না পারলে বড় আকার বেছে নিন।</p>
            <Choice<TextSize>
              legend="লেখার আকার"
              value={settings.textSize}
              onChange={(v) => store.setSettings({ textSize: v })}
              options={[
                { value: 'normal', label: 'সাধারণ' },
                { value: 'large', label: 'বড়' },
                { value: 'xlarge', label: 'আরও বড়' },
                { value: 'xxlarge', label: 'সবচেয়ে বড়' },
              ]}
            />
            <p className="rounded-xl bg-sunken p-4">এটি একটি নমুনা লেখা। কম্পিউটার শেখা মোটেও কঠিন নয় — একটু একটু করে এগোলেই হয়।</p>
          </>
        )}
        {step === 3 && (
          <>
            <h1 className="text-2xl font-bold">কেন প্রোগ্রামিং শিখতে চান?</h1>
            <p>এক-দুই লাইনে লিখে রাখুন। যখন মন খারাপ লাগবে বা মনে হবে এগোতে পারছেন না, আমরা এটি আপনাকে আবার দেখাব। না লিখতে চাইলেও চলবে।</p>
            <label className="block space-y-2">
              <span className="sr-only">আমার লক্ষ্য</span>
              <textarea
                className="field min-h-32"
                value={motivation}
                onChange={(e) => setMotivation(e.target.value)}
                placeholder="যেমন: আমি নিজে একটি ওয়েবসাইট বানাতে চাই।"
                maxLength={500}
              />
            </label>
          </>
        )}
        <div className="flex flex-wrap justify-between gap-3">
          <button className="btn btn-outline" onClick={() => setStep((s) => s - 1)} disabled={step === 0}>← আগের ধাপ</button>
          {step < STEPS - 1 ? (
            <button className="btn btn-lg" onClick={() => setStep((s) => s + 1)} disabled={step === 0 && name.trim() === ''}>
              পরের ধাপ →
            </button>
          ) : (
            <button className="btn btn-lg" onClick={finish}>শুরু করি 🚀</button>
          )}
        </div>
      </div>
    </div>
  )
}
