import { Suspense, useEffect, useState } from 'react'
import type { ExplanationBlock, Lesson, OsFlavor } from '../../engine/types'
import { filterByOs } from '../../engine/filter'
import { WIDGETS } from '../../content/widgets'
import { getGlossaryEntry } from '../../content/glossary'
import { store } from '../../state/store'
import type { ModuleProgress } from '../../state/progress'

export function Block({ b }: { b: ExplanationBlock }) {
  switch (b.kind) {
    case 'p':
      return <p>{b.textBn}</p>
    case 'analogy':
      return (
        <p className="rounded-xl border-l-8 p-4" style={{ background: 'var(--c-brand-soft)', borderColor: 'var(--c-brand)' }}>
          <strong>একটি তুলনা: </strong>
          {b.textBn}
        </p>
      )
    case 'note':
      return (
        <p className="rounded-xl p-4" style={{ background: 'var(--c-accent-soft)' }}>
          ℹ️ {b.textBn}
        </p>
      )
    case 'list':
      return (
        <ul className="list-disc space-y-1 pl-6">
          {b.itemsBn.map((t, i) => (
            <li key={i}>{t}</li>
          ))}
        </ul>
      )
    case 'code':
      return (
        <pre className="overflow-auto rounded-xl p-4" style={{ background: 'var(--c-sunken)' }}>
          <code>{b.code}</code>
        </pre>
      )
    case 'widget': {
      const W = WIDGETS[b.widget]
      return W ? (
        <Suspense fallback={<p>লোড হচ্ছে…</p>}>
          <W {...(b.props ?? {})} />
        </Suspense>
      ) : null
    }
  }
}

export function ExplanationSection({ lesson, module }: { lesson: Lesson; module: number }) {
  useEffect(() => {
    store.markExplanationRead(module)
  }, [module])
  const terms = lesson.glossaryIds.map(getGlossaryEntry).filter(Boolean)
  return (
    <div className="space-y-4">
      {lesson.explanation.map((b, i) => (
        <Block key={i} b={b} />
      ))}
      {terms.length > 0 && (
        <details className="card">
          <summary className="min-h-12 cursor-pointer font-bold">এই পাঠের নতুন শব্দ ({terms.length}টি)</summary>
          <dl className="mt-3 space-y-2">
            {terms.map((t) => (
              <div key={t!.id}>
                <dt className="font-bold">
                  {t!.termBn} <span className="font-normal text-muted">({t!.termEn})</span>
                </dt>
                <dd>{t!.meaningBn}</dd>
              </div>
            ))}
          </dl>
        </details>
      )}
    </div>
  )
}

export function SummarySection({ lesson }: { lesson: Lesson }) {
  const c = lesson.summaryCard
  return (
    <div className="card space-y-3" style={{ borderColor: 'var(--c-brand)', borderWidth: 3 }}>
      <h3 className="text-xl font-bold">📌 {c.titleBn || 'মনে রাখুন'}</h3>
      <ul className="list-disc space-y-2 pl-6">
        {c.pointsBn.map((p, i) => (
          <li key={i}>{p}</li>
        ))}
      </ul>
      {c.extraBn && <p className="text-muted">{c.extraBn}</p>}
    </div>
  )
}

export function RealWorldSection({ lesson, os, progress, module }: { lesson: Lesson; os: OsFlavor; progress?: ModuleProgress; module: number }) {
  const r = lesson.realWorld
  const tasks = [...r.tasksBn, ...((os === 'windows' ? r.windowsTasksBn : r.macTasksBn) ?? [])]
  const checked = progress?.realWorldChecked ?? []
  return (
    <div className="space-y-3">
      <p>{r.titleBn}</p>
      <ul className="space-y-2">
        {tasks.map((t, i) => (
          <li key={i}>
            <label className="flex min-h-12 cursor-pointer items-start gap-3 rounded-xl border-2 p-3" style={{ borderColor: 'var(--c-line)' }}>
              <input type="checkbox" className="mt-1 h-6 w-6 accent-[var(--c-brand)]" checked={checked.includes(i)} onChange={(e) => store.setRealWorldChecked(module, i, e.target.checked)} />
              <span>{t}</span>
            </label>
          </li>
        ))}
      </ul>
      <p className="text-sm text-muted">কাজগুলো সম্পূর্ণ নিরাপদ। করা হয়ে গেলে টিক দিয়ে রাখতে পারেন — না করলেও পরের পাঠে যেতে পারবেন।</p>
    </div>
  )
}

export function TeacherTip({ text }: { text?: string }) {
  const [open, setOpen] = useState(false)
  if (!text) return null
  return (
    <div className="card">
      <button className="btn btn-outline" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        👨‍🏫 শিক্ষকের জন্য {open ? '▲' : '▼'}
      </button>
      {open && <p className="mt-3">{text}</p>}
    </div>
  )
}

export const osQuiz = (lesson: Lesson, os: OsFlavor) => filterByOs(lesson.quiz, os)
