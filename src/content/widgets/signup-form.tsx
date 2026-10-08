import { useState } from 'react'
import { passwordRules, signupProblems, type SignupValues } from './lib/signupLogic'

type Stage = 'form' | 'waiting' | 'verified'

/** A pretend sign-up page for a fictional site ("LearnCode"), with a pretend verification email. Nothing is sent anywhere. */
export default function SignupForm() {
  const [v, setV] = useState<SignupValues>({ name: '', email: '', username: '', password: '' })
  const [show, setShow] = useState(false)
  const [tried, setTried] = useState(false)
  const [stage, setStage] = useState<Stage>('form')
  const problems = signupProblems(v)
  const rules = passwordRules(v.password, v.username)
  const set = (k: keyof SignupValues) => (e: React.ChangeEvent<HTMLInputElement>) => setV({ ...v, [k]: e.target.value })
  const field = (k: keyof SignupValues, label: string, hint: string, type = 'text') => (
    <label className="block">
      <span className="font-medium">{label}</span>
      <span className="block text-sm text-muted">{hint}</span>
      <input
        data-testid={`signup-${k}`}
        type={k === 'password' && show ? 'text' : type}
        value={v[k]}
        onChange={set(k)}
        autoComplete="off"
        className="mt-1 min-h-11 w-full rounded border border-gray-400 bg-white px-3 text-gray-900"
      />
      {tried && problems[k] && <span role="alert" className="mt-1 block text-sm text-accent">{problems[k]}</span>}
    </label>
  )
  return (
    <div className="card space-y-3 p-4" data-testid="signup-form">
      <p className="font-semibold">নকল সাইন-আপ পাতা — LearnCode (শুধু অনুশীলনের জন্য)</p>
      {stage === 'form' && (
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault()
            setTried(true)
            if (Object.keys(problems).length === 0) setStage('waiting')
          }}
        >
          {field('name', 'Full name (পুরো নাম)', 'আপনার নাম, যেমন Anika Rahman')}
          {field('email', 'Email (ইমেইল ঠিকানা)', 'এই ঠিকানায় যাচাইয়ের চিঠি যাবে এবং পাসওয়ার্ড ভুলে গেলে এখানেই উদ্ধারের লিংক আসবে', 'email')}
          {field('username', 'Username (ইউজারনেম)', 'ছোট হাতের অক্ষর, সংখ্যা, ডট বা আন্ডারস্কোর; ফাঁকা জায়গা নয়')}
          {field('password', 'Password (পাসওয়ার্ড)', 'নিচের নিয়মগুলো মেলাতে হবে', 'password')}
          <label className="flex min-h-11 items-center gap-2">
            <input type="checkbox" checked={show} onChange={(e) => setShow(e.target.checked)} />
            <span>পাসওয়ার্ড দেখান</span>
          </label>
          <ul className="space-y-1 text-sm" data-testid="signup-rules">
            {rules.map((r) => (
              <li key={r.id} className={r.ok ? 'text-ok' : 'text-muted'}>
                {r.ok ? '✓' : '○'} {r.textBn}
              </li>
            ))}
          </ul>
          <button type="submit" className="btn" data-testid="signup-submit">
            Create account
          </button>
        </form>
      )}
      {stage === 'waiting' && (
        <div className="space-y-3" data-testid="signup-waiting">
          <p>অ্যাকাউন্ট প্রায় তৈরি! LearnCode আপনার ঠিকানা <b>{v.email}</b>-এ একটি যাচাইয়ের ইমেইল (Verification email) পাঠিয়েছে। ইমেইল বাক্স (Inbox) খুলে দেখুন:</p>
          <div className="rounded border border-gray-300 bg-white p-3 text-gray-900" data-testid="signup-inbox">
            <div className="text-xs text-gray-500">Inbox (1 new)</div>
            <div className="mt-1 font-semibold">Please verify your LearnCode email</div>
            <div className="text-sm text-gray-600">From: no-reply@learncode.example · To: {v.email}</div>
            <p className="mt-2 text-sm">Hi {v.name.trim().split(' ')[0] || 'there'}, press the button to confirm this email address is yours.</p>
            <button type="button" className="btn mt-2" data-testid="signup-verify" onClick={() => setStage('verified')}>
              Verify my email
            </button>
          </div>
          <p className="text-sm text-muted">আসল সাইটে ইমেইলে একটি লিংক থাকে; সেখানে ক্লিক করলেই যাচাই হয়। সেই ইমেইল না এলে Spam ফোল্ডারটিও দেখবেন।</p>
        </div>
      )}
      {stage === 'verified' && (
        <div className="space-y-3" data-testid="signup-done">
          <p className="text-ok">✓ ইমেইল যাচাই হয়েছে। এখন ইউজারনেম <b>{v.username}</b> আর আপনার পাসওয়ার্ড দিয়ে লগ ইন (Log in) করা যাবে।</p>
          <p className="text-sm text-muted">খেয়াল করুন: পাসওয়ার্ড কাউকে বলবেন না, আর যাচাইয়ের কোড (OTP) কেউ চাইলে কখনো দেবেন না।</p>
          <button type="button" className="btn btn-outline" onClick={() => (setStage('form'), setTried(false), setV({ name: '', email: '', username: '', password: '' }))}>
            আবার শুরু করুন
          </button>
        </div>
      )}
    </div>
  )
}
