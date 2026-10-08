/**
 * Source of the JavaScript sandbox worker (run from a Blob URL, no external files). Written as a plain string (no
 * template literals inside) so bundler transforms can't change it, and so unit tests can evaluate it in a `vm` context
 * with a fake `self`.
 *
 * Protocol: main -> worker `{code, inputs, cap}`; worker -> main `{type:'result', output, error?, needInput?}`.
 * Learner code runs as `(async () => {<code>\n})()` on ONE line-preserving wrapper (the prefix sits on the first code
 * line), evaluated with `//# sourceURL=learner.js` so stack frames read `learner.js:LINE:COL` = the learner's line.
 */
export const JS_WORKER_SOURCE = String.raw`
(function () {
  'use strict';
  var g = self;
  var post = g.postMessage.bind(g);
  var evalFn = g.eval || (0, eval);
  var STOP = { stop: true };

  function lockdown() {
    var names = ['fetch', 'XMLHttpRequest', 'WebSocket', 'EventSource', 'importScripts', 'indexedDB', 'caches',
      'BroadcastChannel', 'Worker', 'SharedWorker', 'WebTransport', 'postMessage'];
    for (var i = 0; i < names.length; i++) {
      try { Object.defineProperty(g, names[i], { value: undefined, writable: false, configurable: false }); } catch (e) {}
    }
    // postMessage may also live on a prototype of the worker scope: remove it everywhere.
    try {
      var p = Object.getPrototypeOf(g);
      while (p && p !== Object.prototype) {
        try { delete p.postMessage; } catch (e) {}
        p = Object.getPrototypeOf(p);
      }
    } catch (e) {}
    try { if (g.navigator) Object.defineProperty(g.navigator, 'sendBeacon', { value: undefined, configurable: true }); } catch (e) {}
    try { g.onmessage = null; } catch (e) {}
  }

  function inspect(v, depth, seen) {
    var t = typeof v;
    if (t === 'string') return "'" + v.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n') + "'";
    if (t === 'bigint') return String(v) + 'n';
    if (t === 'symbol') return v.toString();
    if (t === 'function') return '[Function' + (v.name ? ': ' + v.name : ' (anonymous)') + ']';
    if (v === null || t !== 'object') return String(v);
    if (seen.indexOf(v) !== -1) return '[Circular]';
    if (v instanceof Error) return v.stack ? String(v.stack).split('\n')[0] : String(v);
    if (depth > 2) return Array.isArray(v) ? '[Array]' : '[Object]';
    seen = seen.concat([v]);
    var parts = [], i;
    if (Array.isArray(v)) {
      if (v.length === 0) return '[]';
      for (i = 0; i < v.length && i < 100; i++) parts.push(inspect(v[i], depth + 1, seen));
      if (v.length > 100) parts.push('... ' + (v.length - 100) + ' more items');
      return '[ ' + parts.join(', ') + ' ]';
    }
    if (v instanceof Map) {
      v.forEach(function (val, key) { parts.push(inspect(key, depth + 1, seen) + ' => ' + inspect(val, depth + 1, seen)); });
      return 'Map(' + v.size + ') ' + (parts.length ? '{ ' + parts.join(', ') + ' }' : '{}');
    }
    if (v instanceof Set) {
      v.forEach(function (val) { parts.push(inspect(val, depth + 1, seen)); });
      return 'Set(' + v.size + ') ' + (parts.length ? '{ ' + parts.join(', ') + ' }' : '{}');
    }
    if (v instanceof Date) return isNaN(v.getTime()) ? 'Invalid Date' : v.toISOString();
    var keys = Object.keys(v);
    if (keys.length === 0) return '{}';
    for (i = 0; i < keys.length; i++) {
      var k = keys[i];
      var kk = /^[A-Za-z_$][\w$]*$/.test(k) ? k : inspect(k, 0, []);
      var val;
      try { val = inspect(v[k], depth + 1, seen); } catch (e) { val = '[Getter]'; }
      parts.push(kk + ': ' + val);
    }
    return '{ ' + parts.join(', ') + ' }';
  }

  function format(args) {
    var out = [];
    for (var i = 0; i < args.length; i++) out.push(typeof args[i] === 'string' ? args[i] : inspect(args[i], 0, []));
    return out.join(' ');
  }

  // Best-effort syntax error line (Chrome gives no line for SyntaxError of eval'd code): compile growing prefixes of the
  // code inside an UNCLOSED wrapper; "Unexpected end of input" just means "still open", the first prefix that fails with
  // any other message is where the problem was noticed. If everything stays open, the last line is reported.
  function openError(src) {
    try { evalFn('(async () => {' + src); return null; } catch (e) { return String(e && e.message || e); }
  }
  function isOpen(msg) { return /end of input|Unterminated template/i.test(msg); }
  function syntaxErrorLine(code) {
    var lines = code.split('\n');
    var firstMissing = 0;
    for (var k = 1; k <= lines.length; k++) {
      var msg = openError(lines.slice(0, k).join('\n'));
      if (msg && !isOpen(msg)) {
        // "missing ) after argument list" is also what an unfinished call looks like at the end of a prefix: blame its first line
        if (/missing \) after argument list/.test(msg)) { if (firstMissing === 0) firstMissing = k; continue; }
        return firstMissing || k;
      }
    }
    if (firstMissing) return firstMissing;
    var last = lines.length;
    while (last > 1 && lines[last - 1].trim() === '') last--;
    return last;
  }

  function stackLine(stack) {
    var m = /learner\.js:(\d+)/.exec(String(stack || ''));
    return m ? Number(m[1]) : undefined;
  }

  g.onmessage = function (ev) {
    var data = ev.data || {};
    var code = String(data.code == null ? '' : data.code);
    var inputs = data.inputs || [];
    var cap = data.cap || 100000;
    var lines = [];
    var size = 0;
    var needInput = null;
    var overLimit = false;
    var pos = 0;

    function emit(text) {
      if (size + text.length + 1 > cap) { overLimit = true; throw STOP; }
      lines.push(text);
      size += text.length + 1;
    }
    var log = function () { emit(format(arguments)); };
    var fakeConsole = {
      log: log, info: log, warn: log, error: log, debug: log,
      table: log, dir: log, trace: log, assert: function () {}, group: function () {}, groupEnd: function () {}, time: function () {}, timeEnd: function () {}, clear: function () {}
    };

    function finish(extra) {
      var res = { type: 'result', output: lines.join('\n') };
      for (var k in extra) res[k] = extra[k];
      post(res);
    }

    lockdown();
    g.console = fakeConsole;
    g.alert = function (msg) { emit(String(msg === undefined ? '' : msg)); };
    g.prompt = function (msg) {
      if (pos >= inputs.length) { needInput = { prompt: String(msg === undefined ? '' : msg) }; throw STOP; }
      return String(inputs[pos++]);
    };
    g.confirm = function () { return true; };

    var promise;
    try {
      promise = evalFn('(async () => {' + code + '\n})()\n//# sourceURL=learner.js');
    } catch (e) {
      // compile-time error
      var msg = String(e && e.message || e);
      var line = e && typeof e.lineNumber === 'number' && e.lineNumber > 0 ? e.lineNumber : undefined;
      var name = (e && e.name) || 'SyntaxError';
      if (name === 'SyntaxError' && line === undefined) line = syntaxErrorLine(code);
      finish({ error: { name: name, message: msg, line: line, raw: String(e && e.stack || msg) } });
      return;
    }
    Promise.resolve(promise).then(function () {
      if (needInput) finish({ output: '', needInput: needInput });
      else finish({});
    }, function (e) {
      if (needInput) { finish({ output: '', needInput: needInput }); return; }
      if (e === STOP && overLimit) {
        finish({ error: { name: 'OutputLimitExceeded', message: 'The program printed too much text and was stopped.', raw: '' } });
        return;
      }
      var isErr = e && typeof e === 'object' && 'message' in e;
      var name2 = isErr && e.name ? String(e.name) : 'Error';
      var message = isErr ? String(e.message) : String(e);
      var stack = isErr && e.stack ? String(e.stack) : name2 + ': ' + message;
      finish({ error: { name: name2, message: message, line: stackLine(stack), raw: stack } });
    });
  };
})();
`
