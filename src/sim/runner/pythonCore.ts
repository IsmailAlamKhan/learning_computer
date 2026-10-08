import { OUTPUT_CAP, parsePythonTraceback } from './helpers'
import type { RunError } from './types'

/** Minimal slice of the Pyodide API we use (so no Pyodide types/bundle are pulled into the app). */
export interface PyodideLike {
  runPython(code: string, options?: { filename?: string }): unknown
}

/**
 * Python side of the runner. `_learner_run(code, inputs_json, cap)` runs the code in a fresh namespace and returns a
 * JSON string. Nothing leaks between runs: fresh globals dict, restored stdout/stderr/stdin, blocked modules restored.
 */
export const PYTHON_RUNNER_SOURCE = String.raw`
import sys, builtins, json, linecache, traceback, io

_BLOCKED = {'js', 'pyodide_js', 'pyodide', 'micropip', 'pyodide_http', '_pyodide', '_pyodide_core', 'pyodide_kernel'}
_state = {'block': False}

class _NeedInput(BaseException):
    def __init__(self, prompt):
        self.prompt = prompt

class _OutputLimit(BaseException):
    pass

class _Out:
    encoding = 'utf-8'
    def __init__(self, cap):
        self.parts = []
        self.n = 0
        self.cap = cap
    def write(self, s):
        if not isinstance(s, str):
            s = str(s)
        room = self.cap - self.n
        if len(s) > room:
            if room > 0:
                self.parts.append(s[:room])
                self.n += room
            raise _OutputLimit()
        self.parts.append(s)
        self.n += len(s)
        return len(s)
    def flush(self):
        pass
    def isatty(self):
        return False

class _Blocker:
    @staticmethod
    def find_spec(name, path=None, target=None):
        if _state['block'] and name.split('.')[0] in _BLOCKED:
            raise ModuleNotFoundError("No module named '" + name + "'", name=name)
        return None

if not any(getattr(f, '__name__', '') == '_Blocker' for f in sys.meta_path):
    sys.meta_path.insert(0, _Blocker)

def _format_user_exception(e):
    if isinstance(e, SyntaxError):
        return ''.join(traceback.format_exception_only(type(e), e))
    tb = e.__traceback__
    while tb is not None and tb.tb_frame.f_code.co_filename != '<exec>':
        tb = tb.tb_next
    return ''.join(traceback.format_exception(type(e), e, tb))

def _learner_run(code, inputs_json, cap):
    inputs = json.loads(inputs_json)
    out = _Out(cap)
    pos = [0]
    def fake_input(prompt=''):
        if pos[0] >= len(inputs):
            raise _NeedInput(str(prompt))
        v = inputs[pos[0]]
        pos[0] += 1
        return v
    user_builtins = dict(vars(builtins))
    user_builtins['input'] = fake_input
    saved = (sys.stdout, sys.stderr, sys.stdin)
    removed = {k: sys.modules.pop(k) for k in list(sys.modules) if k.split('.')[0] in _BLOCKED}
    result = {'ok': True}
    sys.stdout = out
    sys.stderr = out
    sys.stdin = io.StringIO('')
    _state['block'] = True
    try:
        lines = code.split('\n')
        linecache.cache['<exec>'] = (len(code), None, [l + '\n' for l in lines], '<exec>')
        compiled = compile(code, '<exec>', 'exec')
        exec(compiled, {'__name__': '__main__', '__builtins__': user_builtins})
    except _NeedInput as e:
        result = {'ok': False, 'needInput': e.prompt}
    except _OutputLimit:
        result = {'ok': False, 'outputLimit': True}
    except SystemExit:
        pass
    except BaseException as e:
        result = {'ok': False, 'raw': _format_user_exception(e)}
    finally:
        _state['block'] = False
        sys.stdout, sys.stderr, sys.stdin = saved
        sys.modules.update(removed)
        linecache.cache.pop('<exec>', None)
    result['output'] = ''.join(out.parts)
    return json.dumps(result)

_learner_run
`

export interface PythonRunOutcome {
  ok: boolean
  output: string
  error?: RunError
  needInput?: { prompt: string }
}

interface PyCallable {
  (code: string, inputsJson: string, cap: number): string
}

/** Compile the Python runner once per Pyodide instance; returns a function to run learner code. */
export function createPythonRunner(pyodide: PyodideLike): (code: string, inputs: string[], cap?: number) => PythonRunOutcome {
  const fn = pyodide.runPython(PYTHON_RUNNER_SOURCE, { filename: '<learner-runner>' }) as PyCallable
  return (code, inputs, cap = OUTPUT_CAP) => {
    const json = fn(code, JSON.stringify(inputs), cap)
    const r = JSON.parse(json) as { ok: boolean; output: string; raw?: string; needInput?: string; outputLimit?: boolean }
    if (r.needInput !== undefined) return { ok: false, output: '', needInput: { prompt: r.needInput } }
    if (r.outputLimit) {
      return {
        ok: false,
        output: r.output,
        error: { name: 'OutputLimitExceeded', message: 'The program printed too much text and was stopped.', raw: '' },
      }
    }
    if (r.raw) return { ok: false, output: r.output, error: parsePythonTraceback(r.raw) }
    return { ok: true, output: r.output }
  }
}
