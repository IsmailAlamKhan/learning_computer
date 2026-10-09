import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { store, useProgress } from '../state/store'
import { Choice } from '../ui/Choice'
import { ArtView } from '../ui/illustrations/ArtView'
import { detectOs, OS_LABEL } from '../lib/device'
import type { OsFlavor } from '../engine/types'
import type { TextSize } from '../state/progress'

const STEPS = 4
const BN = ['১', '২', '৩', '৪']
const GOAL_EXAMPLES = ['ওয়েবসাইট বানাতে', 'চাকরির জন্য', 'নিজের অ্যাপ বানাতে']

function OsCards({ value, onChange }: { value: OsFlavor; onChange: (v: OsFlavor) => void }) {
  const opts: { v: OsFlavor; label: string; icon: string }[] = [
    { v: 'windows', label: 'Windows', icon: '🪟' },
    { v: 'mac', label: 'Mac', icon: '🍎' },
  ]
  return (
    <fieldset>
      <legend className="sr-only">আপনার কম্পিউটারের ধরন</legend>
      <div className="grid grid-cols-2 gap-4">
        {opts.map((o) => (
          <label key={o.v} className="relative flex min-h-36 cursor-pointer flex-col items-center justify-center gap-2 rounded-[var(--r-card)] border-2 p-4 text-center has-[:checked]:border-brand has-[:checked]:bg-brand-soft has-[:focus-visible]:outline-3" style={{ borderColor: 'var(--c-line)' }}>
            <input type="radio" name="os" className="absolute inset-0 h-full w-full cursor-pointer opacity-0" checked={value === o.v} onChange={() => onChange(o.v)} aria-label={o.label} />
            <span aria-hidden="true" className="text-5xl">{o.icon}</span>
            <span className="text-xl font-bold" aria-hidden="true">{o.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}

export default function Onboarding() {
  const nav = useNavigate()
  const { profile, settings } = useProgress()
  const [step, setStep] = useState(0)
  const [name, setName] = useState(profile.name)
  // detected once, never asked about touchpad / mouse
  const [detected] = useState<OsFlavor | null>(() => detectOs())
  const [os, setOs] = useState<OsFlavor>(detected ?? profile.os)
  const [changing, setChanging] = useState(false)
  const [motivation, setMotivation] = useState(profile.motivation)

  const finish = () => {
    store.setProfile({ name: name.trim(), os, input: store.getSnapshot().profile.input, autoDetected: true, motivation: motivation.trim(), onboarded: true })
    nav('/', { replace: true })
  }
  const askOs = detected === null || changing

  return (
    <div className="mx-auto max-w-xl space-y-6 pb-24">
      <div className="flex items-center justify-center gap-2" aria-hidden="true">
        {Array.from({ length: STEPS }, (_, i) => (
          <span key={i} className="h-3 rounded-full transition-all" style={{ width: i === step ? 32 : 12, background: i <= step ? 'var(--c-brand)' : 'var(--c-line)' }} />
        ))}
      </div>
      <p className="sr-only" aria-live="polite">ধাপ {BN[step]} / {BN[STEPS - 1]}</p>
      <div className="card space-y-6">
        {step === 0 && (
          <>
            <div className="flex justify-center"><ArtView name="didi-wave" size={140} /></div>
            <h1 className="t-title text-center">স্বাগতম! 🌸</h1>
            <label className="block space-y-2">
              <span className="t-heading block">আপনার নাম কী?</span>
              <input className="field" value={name} onChange={(e) => setName(e.target.value)} placeholder="যেমন: রুমা" autoComplete="given-name" maxLength={60} autoFocus />
            </label>
          </>
        )}
        {step === 1 && (
          <>
            <div className="flex justify-center"><ArtView name="laptop" size={120} /></div>
            {askOs ? (
              <>
                <h1 className="t-title text-center">আপনার কম্পিউটার কোনটি?</h1>
                <OsCards value={os} onChange={setOs} />
              </>
            ) : (
              <>
                <h1 className="t-title text-center">আপনার কম্পিউটার চেনা হয়েছে</h1>
                <p className="chip chip-ok mx-auto flex w-fit text-xl" style={{ padding: '0.6rem 1.4rem' }} data-testid="detected-os">
                  আপনার কম্পিউটার: {OS_LABEL[os]} <span aria-hidden="true">{os === 'windows' ? '💻' : '🍎'}</span>
                </p>
                <p className="text-center">
                  <button type="button" className="btn btn-ghost btn-sm" onClick={() => setChanging(true)}>ঠিক নয়? বদলান</button>
                </p>
              </>
            )}
          </>
        )}
        {step === 2 && (
          <>
            <h1 className="t-title text-center">লেখার আকার</h1>
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
            <p className="rounded-[var(--r-md)] bg-sunken p-4 text-center font-medium" data-testid="size-preview">এভাবে লেখা দেখাবে। আরামে পড়তে পারছেন?</p>
          </>
        )}
        {step === 3 && (
          <>
            <h1 className="t-title text-center">আপনি কেন প্রোগ্রামিং শিখতে চান?</h1>
            <div className="flex flex-wrap justify-center gap-2" role="group" aria-label="উদাহরণ">
              {GOAL_EXAMPLES.map((g) => (
                <button key={g} type="button" className="chip" aria-pressed={motivation === g} style={motivation === g ? { background: 'var(--c-brand-soft)', borderColor: 'var(--c-brand)' } : undefined} onClick={() => setMotivation(g)}>
                  {g}
                </button>
              ))}
            </div>
            <label className="block">
              <span className="sr-only">আমার লক্ষ্য</span>
              <input className="field" value={motivation} onChange={(e) => setMotivation(e.target.value)} placeholder="নিজের কথায় লিখুন (না লিখলেও চলবে)" maxLength={200} />
            </label>
          </>
        )}
        <div className="flex items-center justify-between gap-3">
          {step > 0 ? (
            <button className="btn btn-ghost whitespace-nowrap px-3" onClick={() => setStep((s) => s - 1)}>← আগে</button>
          ) : (
            <span />
          )}
          {step < STEPS - 1 ? (
            <button className="btn btn-lg whitespace-nowrap" onClick={() => setStep((s) => s + 1)} disabled={step === 0 && name.trim() === ''}>
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
