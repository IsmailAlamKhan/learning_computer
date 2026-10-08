/** Pure logic of the “literal robot” game (widget `exact-instructions`). x grows to the right, y grows downward. */

export type Instr = 'F' | 'L' | 'R' | 'VAGUE'
export type Dir = 0 | 1 | 2 | 3 // 0 = north (up), 1 = east (right), 2 = south (down), 3 = west (left)

export interface Pos {
  x: number
  y: number
}

export interface Level {
  id: string
  titleBn: string
  taskBn: string
  size: number
  start: Pos
  startDir: Dir
  goal: Pos
  rocks: Pos[]
  /** one correct instruction list (for “উত্তর দেখুন”) */
  solution: Instr[]
}

export const LEVELS: Level[] = [
  {
    id: 'straight',
    titleBn: 'সোজা পথ',
    taskBn: 'রোবটকে পতাকার ঘরে পৌঁছে দিন।',
    size: 5,
    start: { x: 0, y: 0 },
    startDir: 1,
    goal: { x: 3, y: 0 },
    rocks: [],
    solution: ['F', 'F', 'F'],
  },
  {
    id: 'turn',
    titleBn: 'একটি মোড়',
    taskBn: 'এবার পতাকা একটু নিচে। ঘুরতে হবে।',
    size: 5,
    start: { x: 0, y: 0 },
    startDir: 1,
    goal: { x: 2, y: 2 },
    rocks: [],
    solution: ['F', 'F', 'R', 'F', 'F'],
  },
  {
    id: 'rocks',
    titleBn: 'পাথর এড়িয়ে',
    taskBn: 'মাঝে দুটি পাথর আছে। ঘুরে পার হতে হবে।',
    size: 5,
    start: { x: 0, y: 0 },
    startDir: 1,
    goal: { x: 4, y: 2 },
    rocks: [
      { x: 2, y: 0 },
      { x: 2, y: 1 },
    ],
    solution: ['F', 'R', 'F', 'F', 'L', 'F', 'F', 'F'],
  },
]

export const INSTR_LABEL_BN: Record<Instr, string> = {
  F: 'এক ঘর এগোও',
  L: 'বাঁয়ে ঘোরো',
  R: 'ডানে ঘোরো',
  VAGUE: 'ওই দিকে একটু যাও',
}

export const DIR_NAME_BN: Record<Dir, string> = { 0: 'ওপর', 1: 'ডান', 2: 'নিচ', 3: 'বাঁ' }

const DELTA: Record<Dir, Pos> = { 0: { x: 0, y: -1 }, 1: { x: 1, y: 0 }, 2: { x: 0, y: 1 }, 3: { x: -1, y: 0 } }

export interface TraceStep {
  /** index of the instruction in her list */
  index: number
  instr: Instr
  pos: Pos
  dir: Dir
  /** what the robot “says” about this instruction */
  noteBn: string
  /** the instruction could not be carried out as intended */
  problem: boolean
}

export type Outcome = 'reached' | 'short' | 'confused' | 'bumped' | 'empty'

export interface RunResult {
  trace: TraceStep[]
  final: { pos: Pos; dir: Dir }
  outcome: Outcome
  messageBn: string
}

const same = (a: Pos, b: Pos) => a.x === b.x && a.y === b.y
const isRock = (level: Level, p: Pos) => level.rocks.some((r) => same(r, p))
const inside = (level: Level, p: Pos) => p.x >= 0 && p.y >= 0 && p.x < level.size && p.y < level.size

/** Runs the list literally: the robot does exactly each instruction, nothing more, nothing guessed. */
export function runInstructions(level: Level, list: Instr[]): RunResult {
  let pos = { ...level.start }
  let dir: Dir = level.startDir
  const trace: TraceStep[] = []
  let confused = false
  let bumped = false
  list.forEach((instr, index) => {
    let noteBn = ''
    let problem = false
    if (instr === 'L') {
      dir = ((dir + 3) % 4) as Dir
      noteBn = 'বাঁয়ে ঘুরলাম।'
    } else if (instr === 'R') {
      dir = ((dir + 1) % 4) as Dir
      noteBn = 'ডানে ঘুরলাম।'
    } else if (instr === 'F') {
      const next = { x: pos.x + DELTA[dir].x, y: pos.y + DELTA[dir].y }
      if (!inside(level, next)) {
        noteBn = 'সামনে দেয়াল! এগোতে পারলাম না।'
        problem = true
        bumped = true
      } else if (isRock(level, next)) {
        noteBn = 'সামনে পাথর! এগোতে পারলাম না।'
        problem = true
        bumped = true
      } else {
        pos = next
        noteBn = 'এক ঘর এগোলাম।'
      }
    } else {
      noteBn = '“একটু” মানে কত ঘর? কোন দিকে? আমি বুঝতে পারিনি, তাই কিছু করলাম না।'
      problem = true
      confused = true
    }
    trace.push({ index, instr, pos: { ...pos }, dir, noteBn, problem })
  })
  const reached = same(pos, level.goal)
  let outcome: Outcome
  let messageBn: string
  if (list.length === 0) {
    outcome = 'empty'
    messageBn = 'তালিকা ফাঁকা, তাই রোবট দাঁড়িয়ে আছে। কম্পিউটার নিজে থেকে কিছু ভেবে নেয় না।'
  } else if (reached) {
    outcome = 'reached'
    messageBn = confused || bumped ? 'পতাকায় পৌঁছেছে! তবে পথে কয়েকটি নির্দেশ কাজে লাগেনি — আরও পরিষ্কার করা যায়।' : 'দারুণ! নির্দেশগুলো পরিষ্কার ছিল, তাই রোবট ঠিক জায়গায় পৌঁছেছে।'
  } else if (confused) {
    outcome = 'confused'
    messageBn = 'অস্পষ্ট নির্দেশে রোবট আটকে গেছে। মানুষ আন্দাজ করে নেয়, কম্পিউটার করে না। “কত ঘর” আর “কোন দিকে” পরিষ্কার লিখুন।'
  } else if (bumped) {
    outcome = 'bumped'
    messageBn = 'রোবট দেয়াল বা পাথরে ধাক্কা খেয়েছে। নির্দেশ ঠিক ঠিক পালন হয়েছে — পথটাই একটু ভুল ছিল। আবার ভেবে দেখুন।'
  } else {
    outcome = 'short'
    messageBn = 'রোবট নির্দেশগুলো ঠিকঠাক পালন করেছে, কিন্তু পতাকায় পৌঁছায়নি। তালিকায় কিছু কম বা বেশি আছে — গুনে দেখুন।'
  }
  return { trace, final: { pos, dir }, outcome, messageBn }
}

/** True when this list (without vague steps) takes the robot to the flag. */
export const solves = (level: Level, list: Instr[]) => runInstructions(level, list).outcome === 'reached'
