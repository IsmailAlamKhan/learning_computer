import { runCode, registerWorkerFactory, type WorkerLike } from '../index'

type Handler = (w: FakeWorker, msg: any) => void // eslint-disable-line @typescript-eslint/no-explicit-any

class FakeWorker implements WorkerLike {
  onmessage: ((ev: { data: any }) => void) | null = null // eslint-disable-line @typescript-eslint/no-explicit-any
  onerror: ((ev: { message?: string }) => void) | null = null
  terminated = false
  sent: unknown[] = []
  private handler: Handler
  constructor(handler: Handler) {
    this.handler = handler
  }
  postMessage(m: unknown) {
    this.sent.push(m)
    this.handler(this, m)
  }
  terminate() {
    this.terminated = true
  }
  reply(data: unknown) {
    queueMicrotask(() => !this.terminated && this.onmessage?.({ data }))
  }
}

afterEach(() => {
  registerWorkerFactory('javascript', null)
  registerWorkerFactory('python', null)
  vi.useRealTimers()
})

describe('JavaScript host with a fake worker', () => {
  it('returns the worker result and terminates the worker', async () => {
    let w!: FakeWorker
    registerWorkerFactory('javascript', () => (w = new FakeWorker((fw) => fw.reply({ type: 'result', output: 'hi' }))))
    const r = await runCode({ language: 'javascript', code: 'x', inputs: ['a'] })
    expect(r).toMatchObject({ ok: true, output: 'hi' })
    expect(w.terminated).toBe(true)
    expect(w.sent[0]).toMatchObject({ code: 'x', inputs: ['a'] })
  })
  it('passes needInput through', async () => {
    registerWorkerFactory('javascript', () => new FakeWorker((fw) => fw.reply({ type: 'result', output: '', needInput: { prompt: 'q' } })))
    expect(await runCode({ language: 'javascript', code: '' })).toMatchObject({ ok: false, needInput: { prompt: 'q' } })
  })
  it('timeout terminates the worker and reports an infinite-loop style error', async () => {
    vi.useFakeTimers()
    let w!: FakeWorker
    registerWorkerFactory('javascript', () => (w = new FakeWorker(() => {})))
    const p = runCode({ language: 'javascript', code: 'while(1){}', timeoutMs: 3000 })
    await vi.advanceTimersByTimeAsync(3001)
    const r = await p
    expect(r).toMatchObject({ ok: false, timedOut: true, error: { name: 'TimeoutError' } })
    expect(w.terminated).toBe(true)
  })
  it('worker crash gives a RunnerError, never throws', async () => {
    registerWorkerFactory('javascript', () => new FakeWorker((fw) => queueMicrotask(() => fw.onerror?.({ message: 'kaboom' }))))
    const r = await runCode({ language: 'javascript', code: '' })
    expect(r.ok).toBe(false)
    expect(r.error?.name).toBe('RunnerError')
  })
  it('factory failure -> RunnerUnavailable', async () => {
    registerWorkerFactory('javascript', () => {
      throw new Error('no workers')
    })
    expect((await runCode({ language: 'javascript', code: '' })).error?.name).toBe('RunnerUnavailable')
  })
})

describe('Python host with a fake worker', () => {
  const pyHandler: Handler = (w, m) => {
    if (m.type === 'init') w.reply({ type: 'ready' })
    else if (m.type === 'run') {
      if (m.code === 'hang') return
      w.reply({ type: 'result', id: m.id, outcome: { ok: true, output: 'ran ' + m.code } })
    }
  }
  it('loads once, reuses the worker, and re-creates it after a timeout', async () => {
    vi.useFakeTimers()
    const made: FakeWorker[] = []
    registerWorkerFactory('python', () => {
      const w = new FakeWorker(pyHandler)
      made.push(w)
      return w
    })
    const a = runCode({ language: 'python', code: 'a' })
    await vi.advanceTimersByTimeAsync(10)
    expect((await a).output).toBe('ran a')
    const b = runCode({ language: 'python', code: 'b' })
    await vi.advanceTimersByTimeAsync(10)
    expect((await b).output).toBe('ran b')
    expect(made).toHaveLength(1)

    const hang = runCode({ language: 'python', code: 'hang', timeoutMs: 1000 })
    await vi.advanceTimersByTimeAsync(1001)
    expect(await hang).toMatchObject({ timedOut: true, ok: false })
    expect(made[0].terminated).toBe(true)

    const c = runCode({ language: 'python', code: 'c' })
    await vi.advanceTimersByTimeAsync(10)
    expect((await c).output).toBe('ran c')
    expect(made).toHaveLength(2)
  })
  it('init failure -> RunnerUnavailable and a retry is possible', async () => {
    let n = 0
    registerWorkerFactory('python', () =>
      new FakeWorker((w, m) => {
        if (m.type === 'init') w.reply(n++ === 0 ? { type: 'initError', message: 'wasm 404' } : { type: 'ready' })
        else w.reply({ type: 'result', id: m.id, outcome: { ok: true, output: 'ok' } })
      }),
    )
    const r1 = await runCode({ language: 'python', code: 'x' })
    expect(r1.error?.name).toBe('RunnerUnavailable')
    expect(r1.error?.message).toContain('wasm 404')
    expect((await runCode({ language: 'python', code: 'x' })).ok).toBe(true)
  })
})
