import { useCallback, useEffect, useRef, useState } from 'react'

/** Remove **bold** markup and extra spaces so the voice reads plain text. */
export const speechText = (t: string) => t.replace(/\*\*/g, '').replace(/\s+/g, ' ').trim()

/** Prefer bn-BD, then bn-IN, then any Bengali voice. */
export function pickBengaliVoice(voices: readonly { lang: string }[]) {
  const l = (v: { lang: string }) => v.lang.replace('_', '-').toLowerCase()
  return voices.find((v) => l(v) === 'bn-bd') ?? voices.find((v) => l(v) === 'bn-in') ?? voices.find((v) => l(v) === 'bn' || l(v).startsWith('bn-'))
}

const synth = (): SpeechSynthesis | undefined => (typeof window !== 'undefined' && 'speechSynthesis' in window ? window.speechSynthesis : undefined)

/** Text-to-speech in Bengali. `supported` is false when the browser has no speech or no Bengali voice. */
export function useSpeech(text: string) {
  const [supported, setSupported] = useState(false)
  const [speaking, setSpeaking] = useState(false)
  const mounted = useRef(true)

  useEffect(() => {
    mounted.current = true
    const s = synth()
    if (!s) return
    const check = () => setSupported(!!pickBengaliVoice(s.getVoices?.() ?? []))
    check()
    s.addEventListener?.('voiceschanged', check)
    return () => {
      mounted.current = false
      s.removeEventListener?.('voiceschanged', check)
      s.cancel()
    }
  }, [])

  const stop = useCallback(() => {
    synth()?.cancel()
    setSpeaking(false)
  }, [])

  const speak = useCallback(() => {
    const s = synth()
    if (!s) return
    s.cancel()
    const u = new SpeechSynthesisUtterance(speechText(text))
    const v = pickBengaliVoice(s.getVoices())
    u.lang = v?.lang ?? 'bn-BD'
    if (v) u.voice = v as SpeechSynthesisVoice
    u.rate = 0.9
    u.onend = u.onerror = () => mounted.current && setSpeaking(false)
    setSpeaking(true)
    s.speak(u)
  }, [text])

  const toggle = useCallback(() => (speaking ? stop() : speak()), [speaking, speak, stop])
  // changing the text (next card) silences the previous one
  useEffect(() => () => synth()?.cancel(), [text])
  return { supported, speaking, toggle, stop }
}

/** Small icon button "শুনুন" that reads the text aloud; renders nothing when Bengali speech isn't available. */
export function SpeakButton({ text }: { text: string }) {
  const { supported, speaking, toggle } = useSpeech(text)
  if (!supported) return null
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="শুনুন"
      aria-pressed={speaking}
      title={speaking ? 'থামান' : 'শুনুন'}
      className="inline-flex h-11 w-11 items-center justify-center rounded-full border-2 text-xl transition-transform active:scale-95"
      style={{ borderColor: speaking ? 'var(--c-brand)' : 'var(--c-line)', background: speaking ? 'var(--c-brand-soft)' : 'var(--c-surface)' }}
    >
      <span aria-hidden="true">{speaking ? '⏹' : '🔊'}</span>
    </button>
  )
}
