/** Placeholder: replaced by the design-system task (small "শুনুন" icon button using speechSynthesis, hidden if unsupported). */
export function SpeakButton({ text }: { text: string }) {
  return (
    <button type="button" className="btn btn-outline" aria-label="শুনুন" title={text.slice(0, 20)}>
      🔊
    </button>
  )
}
