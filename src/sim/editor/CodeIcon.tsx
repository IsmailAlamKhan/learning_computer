/** Generic "code" app icon: a window with angle brackets (no logo). 48×48 viewBox like ui/icons.tsx. */
export const CodeIcon = ({ size = 40 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true" focusable="false">
    <rect x="4" y="6" width="40" height="36" rx="5" fill="#1f2937" />
    <rect x="4" y="6" width="40" height="8" rx="4" fill="#374151" />
    <circle cx="10" cy="10" r="1.6" fill="#f87171" />
    <circle cx="15" cy="10" r="1.6" fill="#fbbf24" />
    <circle cx="20" cy="10" r="1.6" fill="#4ade80" />
    <path d="M19 22l-6 6 6 6M29 22l6 6-6 6" fill="none" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M26 20l-4 16" stroke="#fbbf24" strokeWidth="2.4" strokeLinecap="round" />
  </svg>
)
