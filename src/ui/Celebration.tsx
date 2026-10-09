/** Placeholder: replaced by the design-system task (confetti/sparkles, XP counter, streak, badges). */
export function Celebration({ xp }: { xp?: number }) {
  return <div role="status">🎉 {xp ? `+${xp} XP` : ''}</div>
}
