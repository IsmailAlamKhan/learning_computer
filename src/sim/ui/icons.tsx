/** Generic look-alike SVG icons (no logos, no copyrighted artwork). All use a 48×48 viewBox. */
import type { ReactNode } from 'react'

interface P {
  size?: number
  className?: string
}

const Svg = ({ size = 40, className, children }: P & { children: ReactNode }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" className={className} aria-hidden="true" focusable="false">
    {children}
  </svg>
)

export const FolderIcon = (p: P) => (
  <Svg {...p}>
    <path d="M4 12a3 3 0 0 1 3-3h10l4 5h20a3 3 0 0 1 3 3v21a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3z" fill="#e0a526" />
    <path d="M4 18h40v18a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3z" fill="#f6c453" />
  </Svg>
)

export const FileIcon = (p: P) => (
  <Svg {...p}>
    <path d="M10 4h20l9 9v29a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" fill="#f3f4f6" stroke="#9ca3af" strokeWidth="2" />
    <path d="M30 4v9h9" fill="#d1d5db" stroke="#9ca3af" strokeWidth="2" strokeLinejoin="round" />
  </Svg>
)

export const TextFileIcon = (p: P) => (
  <Svg {...p}>
    <path d="M10 4h20l9 9v29a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" fill="#fff" stroke="#6b7280" strokeWidth="2" />
    <path d="M30 4v9h9" fill="#e5e7eb" stroke="#6b7280" strokeWidth="2" strokeLinejoin="round" />
    <path d="M14 22h20M14 28h20M14 34h13" stroke="#6b7280" strokeWidth="2.4" strokeLinecap="round" />
  </Svg>
)

export const ImageFileIcon = (p: P) => (
  <Svg {...p}>
    <rect x="5" y="9" width="38" height="30" rx="3" fill="#dbeafe" stroke="#3b82f6" strokeWidth="2" />
    <circle cx="16" cy="19" r="4" fill="#fbbf24" />
    <path d="M7 36l10-10 8 7 7-9 9 12z" fill="#22c55e" />
  </Svg>
)

export const PdfFileIcon = (p: P) => (
  <Svg {...p}>
    <path d="M10 4h20l9 9v29a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" fill="#fff" stroke="#dc2626" strokeWidth="2" />
    <rect x="12" y="26" width="24" height="10" rx="2" fill="#dc2626" />
    <text x="24" y="34" fontSize="8" fontWeight="700" textAnchor="middle" fill="#fff" fontFamily="sans-serif">PDF</text>
  </Svg>
)

export const AudioFileIcon = (p: P) => (
  <Svg {...p}>
    <rect x="5" y="5" width="38" height="38" rx="8" fill="#ede9fe" stroke="#7c3aed" strokeWidth="2" />
    <path d="M20 31V15l12-3v16" fill="none" stroke="#7c3aed" strokeWidth="3" strokeLinejoin="round" />
    <circle cx="17" cy="32" r="4" fill="#7c3aed" />
    <circle cx="29" cy="29" r="4" fill="#7c3aed" />
  </Svg>
)

export const VideoFileIcon = (p: P) => (
  <Svg {...p}>
    <rect x="5" y="9" width="38" height="30" rx="4" fill="#1f2937" />
    <path d="M20 17l12 7-12 7z" fill="#f9fafb" />
  </Svg>
)

export const AppFileIcon = (p: P) => (
  <Svg {...p}>
    <rect x="6" y="6" width="36" height="36" rx="8" fill="#e0f2fe" stroke="#0284c7" strokeWidth="2" />
    <path d="M24 13v16m0 0-6-6m6 6 6-6M15 35h18" stroke="#0284c7" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
)

export const ZipFileIcon = (p: P) => (
  <Svg {...p}>
    <path d="M10 4h20l9 9v29a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" fill="#fef3c7" stroke="#d97706" strokeWidth="2" />
    <path d="M22 6v6m4 0v6m-4 0v6m4 0v6" stroke="#d97706" strokeWidth="3" />
  </Svg>
)

export const RecycleBinIcon = ({ full, ...p }: P & { full?: boolean }) => (
  <Svg {...p}>
    <path d="M12 14h24l-2 28a2 2 0 0 1-2 2H16a2 2 0 0 1-2-2z" fill="#e5e7eb" stroke="#6b7280" strokeWidth="2" strokeLinejoin="round" />
    <path d="M9 14h30M19 14v-3a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v3" stroke="#6b7280" strokeWidth="2.4" fill="none" strokeLinecap="round" />
    <path d="M20 21v16M28 21v16" stroke="#9ca3af" strokeWidth="2.4" strokeLinecap="round" />
    {full && <path d="M15 14l4-5 5 4 5-5 4 6" fill="#fff" stroke="#6b7280" strokeWidth="2" />}
  </Svg>
)

export const FilesAppIcon = (p: P) => (
  <Svg {...p}>
    <rect x="4" y="8" width="40" height="32" rx="5" fill="#f6c453" />
    <path d="M4 15h40v20a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5z" fill="#fde68a" />
    <rect x="9" y="19" width="30" height="5" rx="2.5" fill="#3b82f6" />
    <rect x="9" y="28" width="20" height="4" rx="2" fill="#93c5fd" />
  </Svg>
)

export const FinderAppIcon = (p: P) => (
  <Svg {...p}>
    <rect x="4" y="4" width="40" height="40" rx="10" fill="#60a5fa" />
    <path d="M24 4h10a10 10 0 0 1 10 10v20a10 10 0 0 1-10 10H24z" fill="#e0f2fe" />
    <path d="M24 4v40" stroke="#1e3a8a" strokeWidth="2" />
    <circle cx="16" cy="20" r="2.6" fill="#1e3a8a" />
    <circle cx="33" cy="20" r="2.6" fill="#1e3a8a" />
    <path d="M14 31c4 5 16 5 20 0" stroke="#1e3a8a" strokeWidth="2.6" fill="none" strokeLinecap="round" />
  </Svg>
)

export const NotepadIcon = (p: P) => (
  <Svg {...p}>
    <rect x="9" y="4" width="30" height="40" rx="3" fill="#fff" stroke="#2563eb" strokeWidth="2" />
    <rect x="9" y="4" width="30" height="8" rx="3" fill="#2563eb" />
    <path d="M14 20h20M14 26h20M14 32h14" stroke="#60a5fa" strokeWidth="2.4" strokeLinecap="round" />
  </Svg>
)

export const TextEditIcon = (p: P) => (
  <Svg {...p}>
    <rect x="8" y="4" width="32" height="40" rx="4" fill="#fffbeb" stroke="#92400e" strokeWidth="2" />
    <path d="M14 14h20M14 21h20M14 28h12" stroke="#b45309" strokeWidth="2.4" strokeLinecap="round" />
    <path d="M30 40l10-14 3 2-10 14-5 2z" fill="#f59e0b" stroke="#92400e" strokeWidth="1.5" />
  </Svg>
)

export const BrowserIcon = (p: P) => (
  <Svg {...p}>
    <circle cx="24" cy="24" r="19" fill="#e0f2fe" stroke="#0284c7" strokeWidth="2.4" />
    <ellipse cx="24" cy="24" rx="8" ry="19" fill="none" stroke="#0284c7" strokeWidth="2" />
    <path d="M6 18h36M6 30h36M24 5v38" stroke="#0284c7" strokeWidth="2" />
  </Svg>
)

export const SettingsIcon = (p: P) => (
  <Svg {...p}>
    <circle cx="24" cy="24" r="19" fill="#e5e7eb" />
    <g stroke="#4b5563" strokeWidth="3" strokeLinecap="round">
      <path d="M24 6v6M24 36v6M6 24h6M36 24h6M11 11l4 4M33 33l4 4M37 11l-4 4M15 33l-4 4" />
    </g>
    <circle cx="24" cy="24" r="8" fill="#9ca3af" stroke="#4b5563" strokeWidth="3" />
    <circle cx="24" cy="24" r="3" fill="#e5e7eb" />
  </Svg>
)

export const TerminalIcon = (p: P) => (
  <Svg {...p}>
    <rect x="4" y="8" width="40" height="32" rx="5" fill="#111827" />
    <path d="M12 19l7 5-7 5" stroke="#4ade80" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M23 31h12" stroke="#f9fafb" strokeWidth="3" strokeLinecap="round" />
  </Svg>
)

export const MailIcon = (p: P) => (
  <Svg {...p}>
    <rect x="4" y="9" width="40" height="30" rx="4" fill="#fff" stroke="#0d9488" strokeWidth="2.4" />
    <path d="M6 12l18 14 18-14" fill="none" stroke="#0d9488" strokeWidth="2.4" strokeLinejoin="round" />
  </Svg>
)

export const PhotosIcon = (p: P) => (
  <Svg {...p}>
    <rect x="4" y="4" width="40" height="40" rx="9" fill="#fff" stroke="#e5e7eb" strokeWidth="2" />
    <g opacity=".85">
      <circle cx="24" cy="15" r="7" fill="#f87171" />
      <circle cx="33" cy="24" r="7" fill="#fbbf24" />
      <circle cx="24" cy="33" r="7" fill="#34d399" />
      <circle cx="15" cy="24" r="7" fill="#60a5fa" />
    </g>
  </Svg>
)

export const MusicIcon = AudioFileIcon

export const LaunchpadIcon = (p: P) => (
  <Svg {...p}>
    <rect x="4" y="4" width="40" height="40" rx="10" fill="#6b7280" />
    {[0, 1, 2].flatMap((r) => [0, 1, 2].map((c) => <rect key={`${r}${c}`} x={11 + c * 10} y={11 + r * 10} width="7" height="7" rx="2" fill={['#f87171', '#fbbf24', '#34d399', '#60a5fa', '#a78bfa', '#f472b6'][(r * 3 + c) % 6]} />))}
  </Svg>
)

export const TaskManagerIcon = (p: P) => (
  <Svg {...p}>
    <rect x="4" y="6" width="40" height="36" rx="4" fill="#fff" stroke="#16a34a" strokeWidth="2.4" />
    <path d="M8 30l8-8 6 6 8-12 10 10" fill="none" stroke="#16a34a" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
  </Svg>
)

export const PrinterIcon = (p: P) => (
  <Svg {...p}>
    <rect x="12" y="5" width="24" height="12" fill="#fff" stroke="#6b7280" strokeWidth="2" />
    <rect x="5" y="16" width="38" height="18" rx="4" fill="#9ca3af" stroke="#4b5563" strokeWidth="2" />
    <rect x="12" y="28" width="24" height="14" fill="#fff" stroke="#6b7280" strokeWidth="2" />
  </Svg>
)

export const UsbIcon = (p: P) => (
  <Svg {...p}>
    <rect x="14" y="4" width="20" height="14" rx="2" fill="#9ca3af" stroke="#4b5563" strokeWidth="2" />
    <rect x="19" y="8" width="3" height="5" fill="#374151" />
    <rect x="26" y="8" width="3" height="5" fill="#374151" />
    <rect x="10" y="18" width="28" height="26" rx="5" fill="#2563eb" stroke="#1e3a8a" strokeWidth="2" />
  </Svg>
)

// ----- small system/tray glyphs (use currentColor) -----
const Glyph = ({ size = 18, children, className }: P & { children: ReactNode }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true" focusable="false">
    {children}
  </svg>
)
export const WifiGlyph = ({ off, ...p }: P & { off?: boolean }) => (
  <Glyph {...p}>
    <path d="M2 9a15 15 0 0 1 20 0M5.5 12.5a10 10 0 0 1 13 0M9 16a5 5 0 0 1 6 0" />
    <circle cx="12" cy="19.5" r="1" fill="currentColor" />
    {off && <path d="M3 3l18 18" />}
  </Glyph>
)
export const VolumeGlyph = ({ muted, ...p }: P & { muted?: boolean }) => (
  <Glyph {...p}>
    <path d="M4 9v6h4l5 4V5L8 9z" fill="currentColor" />
    {muted ? <path d="M17 9l5 6m0-6l-5 6" /> : <path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12" />}
  </Glyph>
)
export const BatteryGlyph = (p: P) => (
  <Glyph {...p}>
    <rect x="2" y="7" width="17" height="10" rx="2" />
    <path d="M22 11v2" />
    <rect x="4" y="9" width="10" height="6" fill="currentColor" stroke="none" />
  </Glyph>
)
export const SearchGlyph = (p: P) => (
  <Glyph {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="M21 21l-5-5" />
  </Glyph>
)
export const BluetoothGlyph = (p: P) => (
  <Glyph {...p}>
    <path d="M7 7l10 10-5 4V3l5 4L7 17" />
  </Glyph>
)
export const PowerGlyph = (p: P) => (
  <Glyph {...p}>
    <path d="M12 3v9M6.5 7a8 8 0 1 0 11 0" />
  </Glyph>
)
export const CloseGlyph = (p: P) => (
  <Glyph {...p}>
    <path d="M5 5l14 14M19 5L5 19" />
  </Glyph>
)
export const BackGlyph = (p: P) => (
  <Glyph {...p}>
    <path d="M15 5l-7 7 7 7" />
  </Glyph>
)
export const ForwardGlyph = (p: P) => (
  <Glyph {...p}>
    <path d="M9 5l7 7-7 7" />
  </Glyph>
)
export const UpGlyph = (p: P) => (
  <Glyph {...p}>
    <path d="M12 19V5M5 12l7-7 7 7" />
  </Glyph>
)
export const RefreshGlyph = (p: P) => (
  <Glyph {...p}>
    <path d="M20 12a8 8 0 1 1-2.6-5.9M20 4v5h-5" />
  </Glyph>
)
export const PlusGlyph = (p: P) => (
  <Glyph {...p}>
    <path d="M12 5v14M5 12h14" />
  </Glyph>
)

/** Generic "start" mark: a 2×2 grid of dots (deliberately not any company logo). */
export const StartMark = ({ size = 22 }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <circle cx="7" cy="7" r="4" fill="#38bdf8" />
    <circle cx="17" cy="7" r="4" fill="#38bdf8" />
    <circle cx="7" cy="17" r="4" fill="#38bdf8" />
    <circle cx="17" cy="17" r="4" fill="#38bdf8" />
  </svg>
)

/** Generic system-menu mark for the Mac menu bar (a ring with a dot). */
export const SystemMark = ({ size = 16 }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="3" />
    <circle cx="12" cy="12" r="3" fill="currentColor" />
  </svg>
)

import { extensionOf, type VNode } from '../vfs'

/** Pick the right icon for a file-system node. */
export function NodeIcon({ node, size = 40 }: { node: VNode; size?: number }) {
  if (node.kind === 'folder') return <FolderIcon size={size} />
  switch (node.media) {
    case 'image':
      return <ImageFileIcon size={size} />
    case 'pdf':
      return <PdfFileIcon size={size} />
    case 'audio':
      return <AudioFileIcon size={size} />
    case 'video':
      return <VideoFileIcon size={size} />
    case 'app':
      return <AppFileIcon size={size} />
    case 'zip':
      return <ZipFileIcon size={size} />
  }
  return ['txt', 'md', 'py', 'js', 'html', 'css', 'json', 'csv'].includes(extensionOf(node.name)) ? <TextFileIcon size={size} /> : <FileIcon size={size} />
}
