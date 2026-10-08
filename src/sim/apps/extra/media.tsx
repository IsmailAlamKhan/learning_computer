/** Media Player: "plays" the practice .mp3 / .mp4 files with an animation (no real audio or video). Volume and mute use the computer's own sound settings. */
import { useEffect, useRef, useState } from 'react'
import { registerApp } from '../registry'
import { useDesktop, useWindowCombos } from '../../DesktopContext'
import type { VNode } from '../../vfs'
import type { WinState } from '../../windowManager'
import { findNode, attached } from '../util'
import { PhotoScene } from '../Photos'
import { NodeIcon } from '../../ui/icons'

export const MediaIcon = ({ size = 40 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true" focusable="false">
    <rect x="4" y="6" width="40" height="36" rx="7" fill="#6d28d9" />
    <path d="M19 15l14 9-14 9z" fill="#fff" />
  </svg>
)

/** a made-up but stable length (in seconds) for each practice file, between 1:00 and 3:30 */
export function fakeDuration(name: string): number {
  let h = 7
  for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) >>> 0
  return 60 + (h % 151)
}

export const fmtTime = (s: number): string => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`

function Equalizer({ t, playing, dim }: { t: number; playing: boolean; dim: boolean }) {
  return (
    <svg viewBox="0 0 240 120" className="h-full w-full" role="img" aria-label={playing ? 'Music is playing' : 'Music is paused'} data-testid="media-visual" data-playing={playing ? 'true' : 'false'}>
      <rect width="240" height="120" fill="#1e1b4b" />
      {Array.from({ length: 24 }, (_, i) => {
        const h = playing ? 14 + 40 * Math.abs(Math.sin(t * 3 + i * 0.7)) + 18 * Math.abs(Math.sin(t * 1.7 + i)) : 8
        return <rect key={i} x={8 + i * 9.5} y={110 - h} width="6" height={h} rx="2" fill={dim ? '#6b7280' : `hsl(${260 + i * 4} 85% 65%)`} />
      })}
    </svg>
  )
}

export function MediaPlayer({ win }: { win: WinState }) {
  const d = useDesktop()
  const { vfs, sim } = d
  const nodeIdProp = typeof win.props?.nodeId === 'string' ? win.props.nodeId : undefined
  const propN = win.props?._n
  const [nodeId, setNodeId] = useState<string | undefined>(nodeIdProp)
  const [playing, setPlaying] = useState(false)
  const [pos, setPos] = useState(0)
  const found = nodeId ? findNode(vfs.root, nodeId) : null
  const node: VNode | null = found && found.kind === 'file' && attached(found, vfs.root) ? found : null
  const isVideo = node?.media === 'video'
  const duration = node ? fakeDuration(node.name) : 0

  useEffect(() => {
    if (nodeIdProp) {
      setNodeId(nodeIdProp)
      setPlaying(false)
      movePos(0)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodeIdProp, propN])

  useEffect(() => {
    if (!node) return
    d.wmDispatch({ type: 'setTitle', id: win.id, title: `${node.name} - Media Player` })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [node?.name, win.id])

  const posRef = useRef(0)
  const movePos = (v: number) => {
    posRef.current = v
    setPos(v)
  }
  useEffect(() => {
    if (!playing || !node) return
    const timer = setInterval(() => {
      const next = posRef.current + 0.1
      if (next >= duration) {
        setPlaying(false)
        movePos(0)
        d.emit({ type: 'custom', event: 'media-ended' })
      } else movePos(next)
    }, 100)
    return () => clearInterval(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, node, duration])

  const emit = (event: string) => d.emit({ type: 'custom', event })
  const toggle = () => {
    if (!node) return
    emit(playing ? 'media-pause' : 'media-play')
    setPlaying(!playing)
  }
  const stop = () => {
    setPlaying(false)
    movePos(0)
    emit('media-stop')
  }
  useWindowCombos(win.id, (c) => (c === 'space' && node ? (toggle(), true) : false))

  const silent = sim.muted || sim.volume === 0
  const btn = 'flex min-h-10 min-w-10 items-center justify-center rounded px-2 hover:bg-white/15 disabled:opacity-40'

  if (!node) {
    const pick = (name: string) => vfs.child(vfs.home, name)
    const files = ['Music', 'Videos', 'Movies']
      .map(pick)
      .filter((f): f is VNode => !!f)
      .flatMap((f) => vfs.list(f).filter((n) => n.kind === 'file' && (n.media === 'audio' || n.media === 'video')))
    return (
      <div className="flex h-full flex-col gap-2 bg-white p-3 text-sm text-gray-900" data-coach="media-library">
        <div className="font-medium">Choose something to play</div>
        {files.length === 0 && <div className="text-gray-500">There are no music or video files yet.</div>}
        {files.map((n) => (
          <button key={n.id} type="button" data-coach={`media-file-${n.name}`} className="flex min-h-11 items-center gap-2 rounded px-2 text-left hover:bg-gray-100" onClick={() => setNodeId(n.id)}>
            <NodeIcon node={n} size={24} />
            {n.name}
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col bg-neutral-900 text-sm text-white">
      <div className="relative min-h-0 flex-1 overflow-hidden" data-coach="media-screen" data-testid="media-screen">
        {isVideo ? (
          <div className="h-full w-full overflow-hidden" data-testid="media-visual" data-playing={playing ? 'true' : 'false'} role="img" aria-label={playing ? 'Video is playing' : 'Video is paused'}>
            <div className="h-full" style={{ width: '140%', transform: `translateX(${playing ? -((pos * 6) % 40) : 0}%)`, transition: 'transform .1s linear' }}>
              <PhotoScene seed={node.name} className="block h-full w-full" />
            </div>
          </div>
        ) : (
          <Equalizer t={pos} playing={playing} dim={silent} />
        )}
        {!playing && <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-5xl text-white/70">▶</div>}
        <div className="absolute top-2 left-3 rounded bg-black/50 px-2 py-0.5" data-coach="media-title">
          {node.name}
        </div>
        {silent && <div className="absolute top-2 right-3 rounded bg-black/50 px-2 py-0.5">🔇 Muted</div>}
      </div>
      <div className="flex shrink-0 items-center gap-2 px-3 pt-1">
        <span className="w-10 text-xs tabular-nums" data-coach="media-time">
          {fmtTime(pos)}
        </span>
        <input
          type="range"
          data-coach="media-seek"
          aria-label="Seek"
          min={0}
          max={duration}
          step={1}
          value={Math.floor(pos)}
          onChange={(e) => (movePos(Number(e.target.value)), emit('media-seek'))}
          className="h-6 min-w-0 flex-1"
        />
        <span className="w-10 text-right text-xs tabular-nums">{fmtTime(duration)}</span>
      </div>
      <div className="flex shrink-0 items-center gap-1 bg-neutral-800 px-2 py-1">
        <button type="button" data-coach="media-play" aria-label={playing ? 'Pause' : 'Play'} className={btn} onClick={toggle}>
          {playing ? '⏸ Pause' : '▶ Play'}
        </button>
        <button type="button" data-coach="media-stop" aria-label="Stop" className={btn} onClick={stop}>
          ⏹ Stop
        </button>
        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            data-coach="media-mute"
            aria-pressed={sim.muted}
            aria-label={sim.muted ? 'Unmute' : 'Mute'}
            className={btn}
            onClick={() => d.setSim({ muted: !sim.muted })}
          >
            {silent ? '🔇' : '🔊'}
          </button>
          <input
            type="range"
            data-coach="media-volume"
            aria-label="Volume"
            min={0}
            max={100}
            value={sim.muted ? 0 : sim.volume}
            onChange={(e) => d.setSim({ volume: Number(e.target.value), muted: false })}
            className="h-6 w-28"
          />
          <span className="w-8 text-right text-xs tabular-nums" data-coach="media-volume-value">
            {sim.muted ? 0 : sim.volume}
          </span>
        </div>
      </div>
    </div>
  )
}

export function register() {
  registerApp({
    id: 'media',
    title: () => 'Media Player',
    descriptionBn: 'গান (অডিও) আর ভিডিও চালানোর প্রোগ্রাম',
    icon: ({ size }) => <MediaIcon size={size} />,
    component: MediaPlayer,
    defaultSize: { w: 560, h: 400 },
  })
}
