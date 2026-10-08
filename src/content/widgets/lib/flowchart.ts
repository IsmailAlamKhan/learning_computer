/**
 * Pure logic for the `flowchart-builder` widget (module 16): a tiny flowchart model, structure validation,
 * path simulation (with a step cap to catch infinite loops) and checking against a goal.
 */

export type BlockKind = 'start' | 'action' | 'decision' | 'end'
export type Port = 'next' | 'yes' | 'no'

export interface Block {
  id: string
  kind: BlockKind
  label: string
  /** centre position on the canvas */
  x: number
  y: number
  /** What this block means in a goal (an action id or a condition id). Only used when checking against a goal. */
  ref?: string
  /** start / action: where to go next */
  next?: string | null
  /** decision exits */
  yes?: string | null
  no?: string | null
}

export interface Chart {
  blocks: Block[]
}

export const KIND_BN: Record<BlockKind, string> = { start: 'শুরু', action: 'কাজ', decision: 'সিদ্ধান্ত', end: 'শেষ' }
export const KIND_EN: Record<BlockKind, string> = { start: 'Start', action: 'Action', decision: 'Decision', end: 'End' }
export const PORT_BN: Record<Port, string> = { next: 'এরপর', yes: 'হ্যাঁ', no: 'না' }

export const portsFor = (kind: BlockKind): Port[] => (kind === 'decision' ? ['yes', 'no'] : kind === 'end' ? [] : ['next'])

export const emptyChart = (): Chart => ({ blocks: [] })
export const getBlock = (c: Chart, id: string | null | undefined) => (id ? c.blocks.find((b) => b.id === id) : undefined)

export function newId(chart: Chart): string {
  let n = 1
  for (const b of chart.blocks) {
    const m = /^b(\d+)$/.exec(b.id)
    if (m) n = Math.max(n, Number(m[1]) + 1)
  }
  return `b${n}`
}

/** Where a block appended with "add" goes: columns of five, left to right. */
export function autoPosition(chart: Chart): { x: number; y: number } {
  const k = chart.blocks.length
  return { x: 120 + 210 * Math.floor(k / 5), y: 50 + 100 * (k % 5) }
}

export const defaultLabel = (kind: BlockKind): string => (kind === 'start' ? 'শুরু' : kind === 'end' ? 'শেষ' : '')

export function addBlock(chart: Chart, kind: BlockKind, pos?: { x: number; y: number }, label?: string): { chart: Chart; id: string } {
  const id = newId(chart)
  const p = pos ?? autoPosition(chart)
  const block: Block = { id, kind, label: label ?? defaultLabel(kind), x: Math.round(p.x), y: Math.round(p.y) }
  return { chart: { blocks: [...chart.blocks, block] }, id }
}

export function removeBlock(chart: Chart, id: string): Chart {
  return {
    blocks: chart.blocks
      .filter((b) => b.id !== id)
      .map((b) => ({
        ...b,
        next: b.next === id ? null : b.next,
        yes: b.yes === id ? null : b.yes,
        no: b.no === id ? null : b.no,
      })),
  }
}

function patch(chart: Chart, id: string, p: Partial<Block>): Chart {
  return { blocks: chart.blocks.map((b) => (b.id === id ? { ...b, ...p } : b)) }
}

export const moveBlock = (chart: Chart, id: string, x: number, y: number) => patch(chart, id, { x: Math.round(x), y: Math.round(y) })
export const setLabel = (chart: Chart, id: string, label: string) => patch(chart, id, { label })
export const setRef = (chart: Chart, id: string, ref: string | undefined) => patch(chart, id, { ref })

/** Connect an output port to a target. Returns the chart unchanged if the port doesn't exist on that block or the target is unknown. */
export function connect(chart: Chart, from: string, port: Port, to: string | null): Chart {
  const b = getBlock(chart, from)
  if (!b || !portsFor(b.kind).includes(port)) return chart
  if (to !== null && !getBlock(chart, to)) return chart
  return patch(chart, from, { [port]: to })
}

export const disconnect = (chart: Chart, from: string, port: Port) => connect(chart, from, port, null)

/** All outgoing edges of a block. */
export function edges(chart: Chart): { from: string; port: Port; to: string }[] {
  const out: { from: string; port: Port; to: string }[] = []
  for (const b of chart.blocks) for (const p of portsFor(b.kind)) {
    const to = b[p]
    if (to && getBlock(chart, to)) out.push({ from: b.id, port: p, to })
  }
  return out
}

/** The name we show for a block in messages. */
export function blockName(b: Block): string {
  const l = b.label.trim()
  return l ? `“${l}”` : `${KIND_BN[b.kind]} ব্লক`
}

// ---------------------------------------------------------------- goals

export type Inputs = Record<string, number | boolean | boolean[]>

export interface GoalCondition {
  id: string
  labelBn: string
  /** `n` = how many times this condition has been asked already in this run (so loops can change their answer). */
  test: (inputs: Inputs, n: number) => boolean
}
export interface GoalAction {
  id: string
  labelBn: string
}
export interface GoalTest {
  inputs: Inputs
  /** plain description of the situation, e.g. “বৃষ্টি হচ্ছে” */
  descBn: string
  /** the action ids that must happen, in this order */
  expected: string[]
}
export interface Goal {
  id: string
  level: 1 | 2 | 3
  titleBn: string
  taskBn: string
  tipBn: string
  conditions: GoalCondition[]
  actions: GoalAction[]
  tests: GoalTest[]
  /** a correct chart, for "সমাধান দেখুন" */
  solution: Chart
}

/** helper for conditions answered from a list of booleans (the last one repeats) */
export function seqValue(v: number | boolean | boolean[] | undefined, n: number): boolean {
  if (Array.isArray(v)) return v.length ? v[Math.min(n, v.length - 1)] : false
  return v === true
}

// ---------------------------------------------------------------- validation

export interface Issue {
  code: 'empty' | 'noStart' | 'manyStart' | 'noEnd' | 'missingNext' | 'missingYes' | 'missingNo' | 'emptyLabel' | 'unreachable' | 'noMeaning' | 'badTarget'
  blockId?: string
  messageBn: string
}

export function reachableFrom(chart: Chart, startId: string): Set<string> {
  const seen = new Set<string>()
  const stack = [startId]
  while (stack.length) {
    const id = stack.pop()!
    if (seen.has(id)) continue
    const b = getBlock(chart, id)
    if (!b) continue
    seen.add(id)
    for (const p of portsFor(b.kind)) {
      const to = b[p]
      if (to) stack.push(to)
    }
  }
  return seen
}

export function validateStructure(chart: Chart, opts: { requireMeaning?: boolean } = {}): Issue[] {
  const issues: Issue[] = []
  if (chart.blocks.length === 0) return [{ code: 'empty', messageBn: 'চার্টে এখনও কোনো ব্লক নেই। বাঁ দিকের তালিকা থেকে “শুরু” ব্লক দিয়ে শুরু করুন।' }]
  const starts = chart.blocks.filter((b) => b.kind === 'start')
  if (starts.length === 0) issues.push({ code: 'noStart', messageBn: 'কোনো “শুরু” ব্লক নেই। প্রতিটি চার্ট একটি শুরু ব্লক দিয়ে শুরু হয়।' })
  if (starts.length > 1) issues.push({ code: 'manyStart', blockId: starts[1].id, messageBn: 'একাধিক “শুরু” ব্লক আছে। একটি রেখে বাকিগুলো মুছে দিন।' })
  if (!chart.blocks.some((b) => b.kind === 'end')) issues.push({ code: 'noEnd', messageBn: 'কোনো “শেষ” ব্লক নেই। চার্ট কোথাও না কোথাও শেষ হতে হয়।' })

  for (const b of chart.blocks) {
    for (const p of portsFor(b.kind)) {
      const to = b[p]
      if (to && !getBlock(chart, to)) issues.push({ code: 'badTarget', blockId: b.id, messageBn: `${blockName(b)} ব্লকের তীরটি এমন জায়গায় গেছে যা আর নেই। আবার জুড়ে দিন।` })
    }
    if (b.kind === 'start' || b.kind === 'action') {
      if (!b.next) issues.push({ code: 'missingNext', blockId: b.id, messageBn: `${blockName(b)} ব্লকের পর কী হবে তা জুড়ে দেওয়া হয়নি। এর নিচের বিন্দু থেকে তীর টেনে পরের ব্লকে নিন।` })
    }
    if (b.kind === 'decision') {
      if (!b.yes) issues.push({ code: 'missingYes', blockId: b.id, messageBn: `${blockName(b)} সিদ্ধান্তের “হ্যাঁ” দিকটি কোথাও যায়নি। উত্তর হ্যাঁ হলে কী হবে তা জুড়ে দিন।` })
      if (!b.no) issues.push({ code: 'missingNo', blockId: b.id, messageBn: `${blockName(b)} সিদ্ধান্তের “না” দিকটি কোথাও যায়নি। উত্তর না হলে কী হবে তা জুড়ে দিন।` })
    }
    if ((b.kind === 'action' || b.kind === 'decision') && !b.label.trim()) {
      issues.push({ code: 'emptyLabel', blockId: b.id, messageBn: `একটি ${KIND_BN[b.kind]} ব্লকের কোনো লেখা নেই। ব্লকটি বেছে নিয়ে নাম লিখুন।` })
    }
    if (opts.requireMeaning && (b.kind === 'action' || b.kind === 'decision') && !b.ref) {
      issues.push({ code: 'noMeaning', blockId: b.id, messageBn: `${blockName(b)} ব্লকটি কী বোঝায় তা “অর্থ” তালিকা থেকে বেছে দিন, নইলে কম্পিউটার চার্টটি চালিয়ে দেখতে পারবে না।` })
    }
  }

  if (starts.length >= 1) {
    const seen = reachableFrom(chart, starts[0].id)
    for (const b of chart.blocks) {
      if (!seen.has(b.id) && b.id !== starts[0].id && !(b.kind === 'start')) {
        issues.push({ code: 'unreachable', blockId: b.id, messageBn: `${blockName(b)} ব্লকটি বিচ্ছিন্ন — শুরু থেকে হেঁটে এখানে পৌঁছানো যায় না। কোনো তীর দিয়ে একে জুড়ে দিন (বা দরকার না হলে মুছে ফেলুন)।` })
      }
    }
  }
  return issues
}

// ---------------------------------------------------------------- simulation

export type StuckReason = 'noNext' | 'noYes' | 'noNo' | 'noMeaning' | 'unknownCondition' | 'badTarget'

export interface SimResult {
  status: 'ended' | 'stuck' | 'loop' | 'nostart'
  /** block ids in the order visited */
  path: string[]
  /** action refs performed, in order */
  actions: string[]
  stuckAt?: string
  reason?: StuckReason
}

export const DEFAULT_STEP_CAP = 100

export function simulate(chart: Chart, conditions: GoalCondition[], inputs: Inputs, maxSteps = DEFAULT_STEP_CAP): SimResult {
  const start = chart.blocks.find((b) => b.kind === 'start')
  if (!start) return { status: 'nostart', path: [], actions: [] }
  const path: string[] = []
  const actions: string[] = []
  const asked: Record<string, number> = {}
  let cur: Block | undefined = start
  while (cur) {
    if (path.length >= maxSteps) return { status: 'loop', path, actions }
    path.push(cur.id)
    let to: string | null | undefined
    switch (cur.kind) {
      case 'end':
        return { status: 'ended', path, actions }
      case 'start':
        to = cur.next
        if (!to) return { status: 'stuck', path, actions, stuckAt: cur.id, reason: 'noNext' }
        break
      case 'action':
        if (cur.ref) actions.push(cur.ref)
        to = cur.next
        if (!to) return { status: 'stuck', path, actions, stuckAt: cur.id, reason: 'noNext' }
        break
      case 'decision': {
        if (!cur.ref) return { status: 'stuck', path, actions, stuckAt: cur.id, reason: 'noMeaning' }
        const cond = conditions.find((c) => c.id === cur!.ref)
        if (!cond) return { status: 'stuck', path, actions, stuckAt: cur.id, reason: 'unknownCondition' }
        const n = asked[cond.id] ?? 0
        asked[cond.id] = n + 1
        const yes = cond.test(inputs, n)
        to = yes ? cur.yes : cur.no
        if (!to) return { status: 'stuck', path, actions, stuckAt: cur.id, reason: yes ? 'noYes' : 'noNo' }
        break
      }
    }
    const nb = getBlock(chart, to)
    if (!nb) return { status: 'stuck', path, actions, stuckAt: cur.id, reason: 'badTarget' }
    cur = nb
  }
  return { status: 'stuck', path, actions }
}

/** Manual stepping for free-build mode: the next block id (or null with a reason when stuck). */
export function stepOnce(chart: Chart, id: string, answerYes?: boolean): { to: string | null; reason?: StuckReason | 'finished' } {
  const b = getBlock(chart, id)
  if (!b) return { to: null, reason: 'badTarget' }
  if (b.kind === 'end') return { to: null, reason: 'finished' }
  const to = b.kind === 'decision' ? (answerYes ? b.yes : b.no) : b.next
  if (!to) return { to: null, reason: b.kind === 'decision' ? (answerYes ? 'noYes' : 'noNo') : 'noNext' }
  if (!getBlock(chart, to)) return { to: null, reason: 'badTarget' }
  return { to }
}

// ---------------------------------------------------------------- checking against a goal

export interface TestOutcome {
  test: GoalTest
  result: SimResult
  pass: boolean
  messageBn: string
}

export interface GoalCheck {
  ok: boolean
  issues: Issue[]
  tests: TestOutcome[]
  /** the few most useful things to tell her, most important first */
  hintsBn: string[]
  summaryBn: string
}

const actionLabel = (goal: Goal, id: string) => goal.actions.find((a) => a.id === id)?.labelBn ?? id
const listActions = (goal: Goal, ids: string[]) => (ids.length ? ids.map((i) => actionLabel(goal, i)).join(' → ') : '(কিছুই না)')

function stuckMessage(chart: Chart, r: SimResult, t: GoalTest): string {
  const b = getBlock(chart, r.stuckAt)
  const name = b ? blockName(b) : 'একটি ব্লক'
  const when = `“${t.descBn}” ধরলে`
  switch (r.reason) {
    case 'noYes':
      return `${when} চার্ট ${name} পর্যন্ত গিয়ে থেমে গেছে — ওখানে “হ্যাঁ” দিকের তীরটি নেই।`
    case 'noNo':
      return `${when} চার্ট ${name} পর্যন্ত গিয়ে থেমে গেছে — ওখানে “না” দিকের তীরটি নেই।`
    case 'noMeaning':
      return `${when} চালানো যায়নি: ${name} সিদ্ধান্তের “অর্থ” বেছে দেওয়া হয়নি।`
    case 'unknownCondition':
      return `${when} চালানো যায়নি: ${name} সিদ্ধান্তটির শর্ত এই কাজের সাথে মিলছে না।`
    default:
      return `${when} চার্ট ${name} পর্যন্ত গিয়ে থেমে গেছে — এর পর কোথায় যাবে তা জোড়া নেই।`
  }
}

function compareMessage(goal: Goal, t: GoalTest, r: SimResult): string {
  const exp = t.expected
  const got = r.actions
  const missing = exp.filter((e) => !got.includes(e))
  const extra = got.filter((g) => !exp.includes(g))
  const when = `“${t.descBn}” ধরলে`
  if (missing.length)
    return `${when} আপনার চার্টে “${actionLabel(goal, missing[0])}” কাজটি হয়নি। আশা ছিল: ${listActions(goal, exp)}। হয়েছে: ${listActions(goal, got)}। হ্যাঁ/না তীর দুটি কি উল্টে গেছে?`
  if (extra.length)
    return `${when} “${actionLabel(goal, extra[0])}” কাজটি হওয়ার কথা নয়। আশা ছিল: ${listActions(goal, exp)}। হয়েছে: ${listActions(goal, got)}।`
  return `${when} কাজগুলো ঠিক ক্রমে হয়নি। আশা ছিল: ${listActions(goal, exp)}। হয়েছে: ${listActions(goal, got)}।`
}

export function checkAgainstGoal(chart: Chart, goal: Goal): GoalCheck {
  const issues = validateStructure(chart, { requireMeaning: true })
  const tests: TestOutcome[] = []
  const hasStart = chart.blocks.some((b) => b.kind === 'start')
  for (const t of goal.tests) {
    if (!hasStart) {
      tests.push({ test: t, result: { status: 'nostart', path: [], actions: [] }, pass: false, messageBn: 'শুরু ব্লক না থাকায় চালানো যায়নি।' })
      continue
    }
    const r = simulate(chart, goal.conditions, t.inputs)
    let pass = false
    let messageBn = ''
    if (r.status === 'ended') {
      pass = r.actions.length === t.expected.length && r.actions.every((a, i) => a === t.expected[i])
      messageBn = pass ? `“${t.descBn}” ধরলে ঠিক: ${listActions(goal, r.actions)}।` : compareMessage(goal, t, r)
    } else if (r.status === 'loop') {
      messageBn = `“${t.descBn}” ধরলে চার্টটি কখনো শেষ হয়নি — একই জায়গায় ঘুরেই গেছে (অসীম লুপ)। লুপ থেকে বেরোনোর একটি পথ রাখুন, যেমন সিদ্ধান্তের একটি দিক “শেষ” ব্লকের দিকে।`
    } else if (r.status === 'stuck') {
      messageBn = stuckMessage(chart, r, t)
    } else {
      messageBn = 'শুরু ব্লক না থাকায় চালানো যায়নি।'
    }
    tests.push({ test: t, result: r, pass, messageBn })
  }
  const allPass = tests.every((t) => t.pass)
  const ok = issues.length === 0 && allPass
  const hintsBn: string[] = []
  for (const i of issues.slice(0, 3)) hintsBn.push(i.messageBn)
  for (const t of tests.filter((x) => !x.pass).slice(0, 2)) if (!hintsBn.includes(t.messageBn)) hintsBn.push(t.messageBn)
  const passed = tests.filter((t) => t.pass).length
  const summaryBn = ok
    ? 'দারুণ! আপনার চার্ট সব পরীক্ষায় ঠিক চলেছে।'
    : issues.length
      ? 'চার্টে এখনও কয়েকটি জিনিস বাকি আছে — নিচের ইঙ্গিতগুলো দেখুন।'
      : `${tests.length}টি পরিস্থিতির মধ্যে ${passed}টি ঠিক চলেছে। নিচের ইঙ্গিত দেখে আবার চেষ্টা করুন।`
  return { ok, issues, tests, hintsBn, summaryBn }
}

// ---------------------------------------------------------------- text outline (also an accessible alternative to the drawing)

export function describeChart(chart: Chart): string[] {
  return chart.blocks.map((b) => {
    const to = (id: string | null | undefined) => {
      const t = getBlock(chart, id)
      return t ? blockName(t) : 'কোথাও না'
    }
    if (b.kind === 'decision') return `সিদ্ধান্ত ${blockName(b)}: হ্যাঁ হলে → ${to(b.yes)}; না হলে → ${to(b.no)}`
    if (b.kind === 'end') return `শেষ ব্লক ${blockName(b)}`
    return `${KIND_BN[b.kind]} ${blockName(b)} → ${to(b.next)}`
  })
}
