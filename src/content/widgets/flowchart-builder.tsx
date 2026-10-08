import { useRef, useState, type KeyboardEvent as RKeyboardEvent, type PointerEvent as RPointerEvent } from 'react'
import { DropZone, useDrag } from '../../sim/dnd'
import {
  KIND_BN, KIND_EN, PORT_BN, addBlock, blockName, checkAgainstGoal, connect, describeChart, edges, emptyChart, getBlock, moveBlock, portsFor,
  removeBlock, setLabel, setRef, stepOnce, validateStructure, type Block, type BlockKind, type Chart, type GoalCheck, type Port,
} from './lib/flowchart'
import { GOALS, getGoal } from './lib/flowGoals'

const KINDS: BlockKind[] = ['start', 'action', 'decision', 'end']
const FREE = 'free'

const sizeOf = (kind: BlockKind) => (kind === 'decision' ? { w: 176, h: 86 } : { w: 156, h: 52 })

function wrap(label: string, max: number): string[] {
  const words = label.trim().split(/\s+/).filter(Boolean)
  const lines: string[] = []
  let cur = ''
  for (const w of words) {
    if (cur && (cur + ' ' + w).length > max) {
      lines.push(cur)
      cur = w
    } else cur = cur ? cur + ' ' + w : w
  }
  if (cur) lines.push(cur)
  return lines.slice(0, 3)
}

function portPoint(b: Block, port: Port) {
  const { w, h } = sizeOf(b.kind)
  if (port === 'yes') return { x: b.x - w / 2, y: b.y }
  if (port === 'no') return { x: b.x + w / 2, y: b.y }
  return { x: b.x, y: b.y + h / 2 }
}
const entryPoint = (b: Block) => ({ x: b.x, y: b.y - sizeOf(b.kind).h / 2 })

function edgePath(from: Block, port: Port, to: Block) {
  const s = portPoint(from, port)
  const t = entryPoint(to)
  const dx = port === 'yes' ? -70 : port === 'no' ? 70 : 0
  return `M ${s.x} ${s.y} C ${s.x + dx} ${s.y + 55}, ${t.x} ${t.y - 55}, ${t.x} ${t.y}`
}

function PaletteItem({ kind, onAdd }: { kind: BlockKind; onAdd: (k: BlockKind) => void }) {
  const drag = useDrag({ payload: { kind } })
  return (
    <button {...drag} type="button" data-testid={`fc-add-${kind}`} className="btn btn-outline cursor-grab justify-start" onClick={() => onAdd(kind)} aria-label={`${KIND_BN[kind]} (${KIND_EN[kind]}) ব্লক যোগ করুন`}>
      <span aria-hidden="true">{kind === 'decision' ? '◇' : kind === 'action' ? '▭' : '⬭'}</span> {KIND_BN[kind]} <span className="text-sm" style={{ color: 'var(--c-muted)' }}>({KIND_EN[kind]})</span>
    </button>
  )
}

interface Run {
  current: string | null
  visited: string[]
  msgBn: string
  done: boolean
}

export default function FlowchartBuilder() {
  const [mode, setMode] = useState<string>(GOALS[0].id)
  const [charts, setCharts] = useState<Record<string, Chart>>({})
  const [selected, setSelected] = useState<string | null>(null)
  const [connecting, setConnecting] = useState<{ from: string; port: Port } | null>(null)
  const [results, setResults] = useState<Record<string, { check: GoalCheck | null; free?: string[]; fails: number }>>({})
  const [run, setRun] = useState<Run | null>(null)
  const svgRef = useRef<SVGSVGElement | null>(null)

  const goal = mode === FREE ? undefined : getGoal(mode)
  const chart = charts[mode] ?? emptyChart()
  const res = results[mode]
  const update = (fn: (c: Chart) => Chart) => setCharts((all) => ({ ...all, [mode]: fn(all[mode] ?? emptyChart()) }))
  const clearFeedback = () => setResults((r) => (r[mode] ? { ...r, [mode]: { ...r[mode], check: null, free: undefined } } : r))
  const edit = (fn: (c: Chart) => Chart) => {
    update(fn)
    clearFeedback()
    setRun(null)
  }

  const toSvg = (cx: number, cy: number) => {
    const svg = svgRef.current
    const m = svg?.getScreenCTM?.()
    if (!svg || !m || !svg.createSVGPoint) return { x: cx, y: cy }
    const pt = svg.createSVGPoint()
    pt.x = cx
    pt.y = cy
    const r = pt.matrixTransform(m.inverse())
    return { x: r.x, y: r.y }
  }
  const clampPos = (x: number, y: number) => ({ x: Math.max(70, x), y: Math.max(40, y) })

  const addKind = (kind: BlockKind, at?: { x: number; y: number }) => {
    const { chart: next, id } = addBlock(chart, kind, at ? clampPos(at.x, at.y) : undefined)
    setCharts((all) => ({ ...all, [mode]: next }))
    setSelected(id)
    clearFeedback()
    setRun(null)
  }

  const activate = (id: string) => {
    if (connecting) {
      edit((c) => connect(c, connecting.from, connecting.port, id))
      setSelected(connecting.from)
      setConnecting(null)
    } else setSelected(id)
  }

  const onBlockPointerDown = (e: RPointerEvent<SVGGElement>, b: Block) => {
    if (e.button !== 0) return
    const p0 = toSvg(e.clientX, e.clientY)
    const st = { moved: false, cx: e.clientX, cy: e.clientY }
    const move = (ev: PointerEvent) => {
      if (!st.moved && Math.hypot(ev.clientX - st.cx, ev.clientY - st.cy) < 5) return
      st.moved = true
      ev.preventDefault()
      const q = toSvg(ev.clientX, ev.clientY)
      const pos = clampPos(b.x + q.x - p0.x, b.y + q.y - p0.y)
      update((c) => moveBlock(c, b.id, pos.x, pos.y))
    }
    const up = () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      if (!st.moved) activate(b.id)
      else setSelected(b.id)
    }
    window.addEventListener('pointermove', move, { passive: false })
    window.addEventListener('pointerup', up)
  }

  const onBlockKey = (e: RKeyboardEvent<SVGGElement>, b: Block) => {
    const step = e.shiftKey ? 40 : 10
    const dir: Record<string, [number, number]> = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] }
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      activate(b.id)
    } else if (dir[e.key]) {
      e.preventDefault()
      const p = clampPos(b.x + dir[e.key][0], b.y + dir[e.key][1])
      update((c) => moveBlock(c, b.id, p.x, p.y))
    } else if (e.key === 'Delete' || e.key === 'Backspace') {
      e.preventDefault()
      edit((c) => removeBlock(c, b.id))
      setSelected(null)
    } else if (e.key === 'Escape') setConnecting(null)
  }

  const sel = getBlock(chart, selected)

  // --- label / meaning
  const catalog = (kind: BlockKind) => (kind === 'decision' ? goal?.conditions : kind === 'action' ? goal?.actions : undefined)
  const changeLabel = (b: Block, label: string) => {
    edit((c) => {
      let next = setLabel(c, b.id, label)
      const hit = catalog(b.kind)?.find((o) => o.labelBn === label.trim())
      if (hit) next = setRef(next, b.id, hit.id)
      return next
    })
  }
  const changeRef = (b: Block, ref: string) => {
    const hit = catalog(b.kind)?.find((o) => o.id === ref)
    edit((c) => {
      let next = setRef(c, b.id, ref || undefined)
      if (hit && !b.label.trim()) next = setLabel(next, b.id, hit.labelBn)
      return next
    })
  }

  // --- checking
  const doCheck = () => {
    setRun(null)
    if (goal) {
      const check = checkAgainstGoal(chart, goal)
      setResults((r) => ({ ...r, [mode]: { check, fails: check.ok ? (r[mode]?.fails ?? 0) : (r[mode]?.fails ?? 0) + 1 } }))
    } else {
      const issues = validateStructure(chart).map((i) => i.messageBn)
      setResults((r) => ({ ...r, [mode]: { check: null, free: issues.length ? issues : ['চার্টের গড়ন ঠিক আছে: শুরু আছে, শেষ আছে, সব তীর জোড়া আছে। এবার “চালিয়ে দেখুন” চেপে হেঁটে দেখুন।'], fails: 0 } }))
    }
  }

  // --- manual run
  const startRun = () => {
    const start = chart.blocks.find((b) => b.kind === 'start')
    if (!start) return setRun({ current: null, visited: [], msgBn: 'আগে একটি “শুরু” ব্লক যোগ করুন।', done: true })
    setRun({ current: start.id, visited: [start.id], msgBn: 'শুরু ব্লক থেকে হাঁটা শুরু হলো।', done: false })
  }
  const advance = (answerYes?: boolean) => {
    if (!run?.current) return
    const cur = getBlock(chart, run.current)
    if (!cur) return
    if (cur.kind === 'end') return setRun({ ...run, done: true, msgBn: 'শেষ ব্লকে পৌঁছেছেন — চার্ট শেষ হলো।' })
    const { to, reason } = stepOnce(chart, cur.id, answerYes)
    if (!to) {
      const m = reason === 'noYes' ? '“হ্যাঁ” দিকের তীর নেই' : reason === 'noNo' ? '“না” দিকের তীর নেই' : 'এর পরে কোথায় যাবে তা জোড়া নেই'
      return setRun({ ...run, current: cur.id, done: true, msgBn: `${blockName(cur)} ব্লকে এসে আটকে গেছে — ${m}।` })
    }
    if (run.visited.length >= 60) return setRun({ ...run, done: true, msgBn: 'অনেকবার ঘুরেও শেষে পৌঁছায়নি — মনে হচ্ছে অসীম লুপ (Infinite loop)। লুপ থেকে বেরোনোর পথ আছে তো?' })
    const nb = getBlock(chart, to)!
    setRun({ current: to, visited: [...run.visited, to], done: nb.kind === 'end', msgBn: nb.kind === 'end' ? 'শেষ ব্লকে পৌঁছেছেন — চার্ট শেষ হলো। 🎉' : `এখন: ${blockName(nb)}` })
  }
  const runBlock = run?.current ? getBlock(chart, run.current) : undefined

  // --- canvas size
  const maxX = Math.max(0, ...chart.blocks.map((b) => b.x))
  const maxY = Math.max(0, ...chart.blocks.map((b) => b.y))
  const vbW = Math.max(720, maxX + 130)
  const vbH = Math.max(460, maxY + 80)
  const edgeList = edges(chart)
  const issueIds = new Set((res?.check?.issues ?? []).map((i) => i.blockId))

  const switchMode = (m: string) => {
    setMode(m)
    setSelected(null)
    setConnecting(null)
    setRun(null)
  }

  return (
    <div className="card space-y-3 p-4" data-testid="flowchart-builder">
      <p className="font-semibold">ফ্লোচার্ট (Flowchart) বানান</p>
      <div className="flex flex-wrap gap-2" role="group" aria-label="কোন চ্যালেঞ্জ">
        {GOALS.map((g, i) => (
          <button key={g.id} type="button" aria-pressed={mode === g.id} data-testid={`fc-mode-${g.id}`} className="btn btn-outline aria-pressed:border-brand aria-pressed:bg-brand-soft" onClick={() => switchMode(g.id)}>
            চ্যালেঞ্জ {i + 1}
          </button>
        ))}
        <button type="button" aria-pressed={mode === FREE} data-testid="fc-mode-free" className="btn btn-outline aria-pressed:border-brand aria-pressed:bg-brand-soft" onClick={() => switchMode(FREE)}>
          ✏️ নিজে বানান
        </button>
      </div>

      {goal ? (
        <div className="space-y-1 rounded-xl p-3" style={{ background: 'var(--c-sunken)' }} data-testid="fc-goal">
          <p className="font-semibold">{goal.titleBn}</p>
          <p>{goal.taskBn}</p>
          <p className="text-sm" style={{ color: 'var(--c-muted)' }}>💡 {goal.tipBn}</p>
          <p className="text-sm" style={{ color: 'var(--c-muted)' }}>যাচাইয়ের সময় চার্টটি এই পরিস্থিতিগুলোতে চালানো হবে: {goal.tests.map((t) => t.descBn).join(' · ')}</p>
        </div>
      ) : (
        <p className="rounded-xl p-3" style={{ background: 'var(--c-sunken)' }}>
          যে কাজটি ইচ্ছা, তার ফ্লোচার্ট বানান — যেমন “সকালে স্কুলে যাওয়া”। লেখা বাংলাতেও দিতে পারেন।
        </p>
      )}

      <div className="grid gap-3 md:grid-cols-[11rem_1fr]">
        <div className="space-y-2" role="group" aria-label="ব্লকের তালিকা">
          <p className="text-sm font-medium">ব্লক যোগ করুন (টেনে এনে ছাড়ুন, অথবা চাপ দিন)</p>
          {KINDS.map((k) => (
            <PaletteItem key={k} kind={k} onAdd={(kind) => addKind(kind)} />
          ))}
        </div>

        <div className="min-w-0 space-y-2">
          <DropZone
            accepts={(p) => typeof p === 'object' && p !== null && 'kind' in p}
            onDrop={(payload, _s, info) => {
              const q = toSvg(info.clientX, info.clientY)
              addKind((payload as { kind: BlockKind }).kind, q)
            }}
            className="overflow-x-auto rounded-xl border-2 data-[drop-over=true]:bg-brand-soft"
            style={{ borderColor: 'var(--c-line)', background: 'var(--c-surface)' }}
            data-testid="fc-canvas"
          >
            <svg
              ref={svgRef}
              viewBox={`0 0 ${vbW} ${vbH}`}
              style={{ width: '100%', minWidth: 560, display: 'block' }}
              role="group"
              aria-label="ফ্লোচার্টের ক্যানভাস"
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  setSelected(null)
                  setConnecting(null)
                }
              }}
            >
              <defs>
                <marker id="fc-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" style={{ fill: 'var(--c-ink)' }} />
                </marker>
              </defs>
              {chart.blocks.length === 0 && (
                <text x={vbW / 2} y={vbH / 2} textAnchor="middle" style={{ fill: 'var(--c-muted)', fontSize: 16 }}>
                  এখানে ব্লক টেনে আনুন, অথবা বাঁ দিকের বোতাম চাপুন
                </text>
              )}
              {edgeList.map((e) => {
                const f = getBlock(chart, e.from)!
                const t = getBlock(chart, e.to)!
                const s = portPoint(f, e.port)
                return (
                  <g key={`${e.from}-${e.port}`} data-testid={`fc-edge-${e.from}-${e.port}-${e.to}`}>
                    <path d={edgePath(f, e.port, t)} fill="none" strokeWidth={2} markerEnd="url(#fc-arrow)" style={{ stroke: 'var(--c-ink)' }} />
                    {e.port !== 'next' && (
                      <text x={s.x + (e.port === 'yes' ? -26 : 26)} y={s.y + 20} textAnchor="middle" style={{ fill: e.port === 'yes' ? 'var(--c-ok)' : 'var(--c-accent)', fontSize: 13, fontWeight: 700 }}>
                        {PORT_BN[e.port]}
                      </text>
                    )}
                  </g>
                )
              })}
              {chart.blocks.map((b) => {
                const { w, h } = sizeOf(b.kind)
                const isSel = selected === b.id
                const isRun = run?.current === b.id
                const fill = b.kind === 'decision' ? 'var(--c-accent-soft)' : b.kind === 'action' ? 'var(--c-surface)' : 'var(--c-brand-soft)'
                const stroke = isRun ? 'var(--c-ok)' : issueIds.has(b.id) ? 'var(--c-accent)' : isSel ? 'var(--c-focus)' : 'var(--c-ink)'
                const lines = wrap(b.label || `(${KIND_BN[b.kind]})`, b.kind === 'decision' ? 14 : 18)
                const common = { fill, strokeWidth: isSel || isRun ? 4 : 2, style: { stroke } }
                return (
                  <g key={b.id} data-testid={`fc-block-${b.id}`} data-kind={b.kind} data-selected={isSel} tabIndex={0} role="button" aria-label={`${KIND_BN[b.kind]} ব্লক: ${b.label || 'নামহীন'}`} onPointerDown={(e) => onBlockPointerDown(e, b)} onKeyDown={(e) => onBlockKey(e, b)} style={{ cursor: connecting ? 'crosshair' : 'grab', touchAction: 'none', outline: 'none' }}>
                    {b.kind === 'decision' ? (
                      <polygon points={`${b.x},${b.y - h / 2} ${b.x + w / 2},${b.y} ${b.x},${b.y + h / 2} ${b.x - w / 2},${b.y}`} {...common} />
                    ) : b.kind === 'action' ? (
                      <rect x={b.x - w / 2} y={b.y - h / 2} width={w} height={h} rx={6} {...common} />
                    ) : (
                      <rect x={b.x - w / 2} y={b.y - h / 2} width={w} height={h} rx={h / 2} {...common} />
                    )}
                    <text x={b.x} y={b.y - ((lines.length - 1) * 8) + 5} textAnchor="middle" style={{ fill: 'var(--c-ink)', fontSize: 14, pointerEvents: 'none' }}>
                      {lines.map((l, i) => (
                        <tspan key={i} x={b.x} dy={i === 0 ? 0 : 16}>{l}</tspan>
                      ))}
                    </text>
                  </g>
                )
              })}
              {chart.blocks.flatMap((b) =>
                portsFor(b.kind).map((p) => {
                  const pt = portPoint(b, p)
                  const active = connecting?.from === b.id && connecting.port === p
                  const color = p === 'yes' ? 'var(--c-ok)' : p === 'no' ? 'var(--c-accent)' : 'var(--c-brand)'
                  return (
                    <g
                      key={`${b.id}-${p}`}
                      data-testid={`fc-port-${b.id}-${p}`}
                      tabIndex={0}
                      role="button"
                      aria-label={`${blockName(b)} থেকে “${PORT_BN[p]}” তীর শুরু করুন`}
                      aria-pressed={active}
                      style={{ cursor: 'pointer' }}
                      onPointerDown={(e) => e.stopPropagation()}
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelected(b.id)
                        setConnecting(active ? null : { from: b.id, port: p })
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          setSelected(b.id)
                          setConnecting(active ? null : { from: b.id, port: p })
                        }
                      }}
                    >
                      <circle cx={pt.x} cy={pt.y} r={active ? 11 : 9} strokeWidth={3} style={{ fill: active ? color : 'var(--c-surface)', stroke: color }} />
                      <text x={pt.x} y={pt.y + 4} textAnchor="middle" style={{ fill: active ? 'var(--c-surface)' : color, fontSize: 12, fontWeight: 700, pointerEvents: 'none' }}>+</text>
                    </g>
                  )
                }),
              )}
            </svg>
          </DropZone>

          {connecting && (
            <p role="status" data-testid="fc-connecting" className="rounded-xl p-2 text-sm font-medium" style={{ background: 'var(--c-brand-soft)' }}>
              {blockName(getBlock(chart, connecting.from)!)} ব্লকের “{PORT_BN[connecting.port]}” বিন্দু বেছেছেন — এবার যে ব্লকে যাবেন সেটিতে ক্লিক করুন। বাতিল করতে বিন্দুটিতে আবার ক্লিক করুন।
            </p>
          )}

          {sel ? (
            <div className="space-y-2 rounded-xl border-2 p-3" style={{ borderColor: 'var(--c-line)' }} data-testid="fc-inspector">
              <p className="font-medium">বেছে নেওয়া ব্লক: {KIND_BN[sel.kind]} ({KIND_EN[sel.kind]})</p>
              <label className="block space-y-1">
                <span className="text-sm">ব্লকের লেখা</span>
                <input className="field" value={sel.label} data-testid="fc-label" onChange={(e) => changeLabel(sel, e.target.value)} placeholder={sel.kind === 'decision' ? 'যেমন: বৃষ্টি হচ্ছে?' : 'যেমন: ছাতা নিন'} />
              </label>
              {goal && catalog(sel.kind) && (
                <label className="block space-y-1">
                  <span className="text-sm">অর্থ — কম্পিউটার চার্টটি চালানোর সময় ব্লকটিকে কী ধরবে</span>
                  <select className="field" value={sel.ref ?? ''} data-testid="fc-ref" onChange={(e) => changeRef(sel, e.target.value)}>
                    <option value="">— বেছে নিন —</option>
                    {catalog(sel.kind)!.map((o) => (
                      <option key={o.id} value={o.id}>{o.labelBn}</option>
                    ))}
                  </select>
                </label>
              )}
              {portsFor(sel.kind).map((p) => (
                <label key={p} className="block space-y-1">
                  <span className="text-sm">{p === 'next' ? 'এরপর কোথায় যাবে (তীর)' : `“${PORT_BN[p]}” হলে কোথায় যাবে`}</span>
                  <select className="field" value={sel[p] ?? ''} data-testid={`fc-next-${p}`} onChange={(e) => edit((c) => connect(c, sel.id, p, e.target.value || null))}>
                    <option value="">— কোথাও না —</option>
                    {chart.blocks.filter((o) => o.id !== sel.id || sel.kind === 'action' || sel.kind === 'decision').map((o) => (
                      <option key={o.id} value={o.id}>{KIND_BN[o.kind]}: {o.label || '(নামহীন)'} [{o.id}]</option>
                    ))}
                  </select>
                </label>
              ))}
              <div className="flex flex-wrap gap-2">
                <button type="button" className="btn btn-outline" data-testid="fc-delete" onClick={() => { edit((c) => removeBlock(c, sel.id)); setSelected(null) }}>
                  🗑 ব্লকটি মুছুন
                </button>
              </div>
              <p className="text-sm" style={{ color: 'var(--c-muted)' }}>কিবোর্ডে: ব্লকে ফোকাস রেখে তীর-কী দিয়ে সরান, Delete দিয়ে মুছুন।</p>
            </div>
          ) : (
            <p className="text-sm" style={{ color: 'var(--c-muted)' }}>
              তীর জুড়তে: ব্লকের গায়ের ছোট “+” বিন্দুতে ক্লিক করুন, তারপর যে ব্লকে যাবে সেটিতে ক্লিক করুন। অথবা ব্লক বেছে নিয়ে নিচের তালিকা থেকে বাছুন।
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" className="btn" data-testid="fc-check" onClick={doCheck}>✔ যাচাই করুন</button>
        <button type="button" className="btn btn-outline" data-testid="fc-run" onClick={startRun}>▶ চালিয়ে দেখুন</button>
        <button type="button" className="btn btn-outline" data-testid="fc-clear" onClick={() => { edit(() => emptyChart()); setSelected(null); setConnecting(null) }}>↺ সব মুছে নতুন করে</button>
      </div>

      {run && (
        <div className="space-y-2 rounded-xl border-2 p-3" style={{ borderColor: 'var(--c-line)' }} data-testid="fc-run-panel" role="status">
          <p>{run.msgBn}</p>
          {!run.done && runBlock && (
            runBlock.kind === 'decision' ? (
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-medium">{blockName(runBlock)}</span>
                <button type="button" className="btn" data-testid="fc-run-yes" onClick={() => advance(true)}>হ্যাঁ</button>
                <button type="button" className="btn btn-outline" data-testid="fc-run-no" onClick={() => advance(false)}>না</button>
              </div>
            ) : (
              <button type="button" className="btn" data-testid="fc-run-next" onClick={() => advance()}>পরের ধাপ →</button>
            )
          )}
          <p className="text-sm" style={{ color: 'var(--c-muted)' }}>পথ: {run.visited.map((id) => getBlock(chart, id)?.label || id).join(' → ')}</p>
        </div>
      )}

      {res?.check && (
        <div role="status" data-testid={res.check.ok ? 'fc-success' : 'fc-feedback'} className="space-y-2 rounded-xl border-2 p-3" style={{ borderColor: res.check.ok ? 'var(--c-ok)' : 'var(--c-line)', background: res.check.ok ? 'var(--c-ok-soft)' : 'var(--c-sunken)' }}>
          <p className="font-semibold">{res.check.ok ? '✅ ' : ''}{res.check.summaryBn}</p>
          {!res.check.ok && (
            <ul className="list-disc space-y-1 pl-5" data-testid="fc-hints">
              {res.check.hintsBn.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          )}
          <ul className="space-y-1 text-sm">
            {res.check.tests.map((t) => (
              <li key={t.test.descBn} data-pass={t.pass}>{t.pass ? '✅' : '⚠️'} {t.pass ? t.messageBn : t.test.descBn}</li>
            ))}
          </ul>
          {!res.check.ok && goal && res.fails >= 2 && (
            <button type="button" className="btn btn-outline" data-testid="fc-solution" onClick={() => { edit(() => goal.solution); setSelected(null) }}>
              💡 একটি সমাধান দেখান (আপনার চার্ট বদলে যাবে)
            </button>
          )}
        </div>
      )}
      {res?.free && (
        <div role="status" data-testid="fc-free-feedback" className="rounded-xl border-2 p-3" style={{ borderColor: 'var(--c-line)', background: 'var(--c-sunken)' }}>
          <ul className="list-disc space-y-1 pl-5">
            {res.free.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        </div>
      )}

      <details className="text-sm">
        <summary className="cursor-pointer font-medium">চার্টটি লেখায় দেখুন</summary>
        <ul className="mt-1 list-disc space-y-1 pl-5" data-testid="fc-outline">
          {describeChart(chart).length ? describeChart(chart).map((l, i) => <li key={i}>{l}</li>) : <li>এখনও কিছু নেই।</li>}
        </ul>
      </details>
    </div>
  )
}
