/** Module 19: a fake Python Q&A page and an official-docs-like page about `NameError: name '…' is not defined`. */
import { registerSite, type SiteProps } from '../sites'
import { registerSearchEntry } from '../searchIndex'

const QA = 'https://pyanswers.example/q/nameerror-name-is-not-defined'
const DOCS = 'https://docs.pyhelp.example/tutorial/errors'

function Qa({ go }: SiteProps) {
  return (
    <div data-coach="m19-qa" className="h-full overflow-auto bg-white text-gray-900">
      <div className="border-b border-gray-200 bg-gray-50 px-6 py-2 text-sm text-gray-600">pyanswers.example · Questions</div>
      <div className="mx-auto max-w-2xl space-y-5 px-6 py-5">
        <h1 className="text-2xl font-semibold">NameError: name is not defined (Python)</h1>
        <p className="text-sm text-gray-500">Asked 5 months ago · Viewed 240k times · Python 3</p>
        <p>
          I wrote <code className="rounded bg-gray-100 px-1">message = "Hello"</code> and then <code className="rounded bg-gray-100 px-1">print(mesage)</code> but I get{' '}
          <code className="rounded bg-gray-100 px-1">NameError: name 'mesage' is not defined</code>. Why?
        </p>
        <section data-coach="m19-qa-accepted" className="rounded-lg border-2 border-green-600 p-4">
          <div className="mb-1 flex flex-wrap items-center gap-2 text-sm">
            <span className="rounded bg-green-600 px-2 py-0.5 font-semibold text-white">✔ Accepted answer</span>
            <span className="text-gray-600">412 votes · answered 5 months ago</span>
          </div>
          <p>Python is telling you it has never seen the name <code className="rounded bg-gray-100 px-1">mesage</code>. The usual causes:</p>
          <ol className="mt-1 list-decimal space-y-1 pl-5">
            <li>A typo: the variable was created as <code>message</code> but used as <code>mesage</code>. Compare the spelling.</li>
            <li>The variable is used before the line that creates it.</li>
            <li>Upper/lower case differs: <code>Message</code> and <code>message</code> are different names.</li>
          </ol>
          <p className="mt-2 text-sm text-gray-600">
            See the official explanation:{' '}
            <a data-coach="m19-docs-link" href={DOCS} onClick={(e) => (e.preventDefault(), go(DOCS))} className="text-blue-700 underline">
              docs.pyhelp.example – Errors and Exceptions
            </a>
          </p>
        </section>
        <section className="rounded-lg border border-gray-300 p-4">
          <div className="mb-1 text-sm text-gray-600">3 votes · answered 5 months ago</div>
          <p>Also try printing the variable right after you create it to see if it exists.</p>
        </section>
      </div>
    </div>
  )
}
registerSite(QA, Qa, 'NameError: name is not defined – pyanswers.example')

function Docs() {
  return (
    <div data-coach="m19-docs" className="h-full overflow-auto bg-white p-6 text-gray-900">
      <div className="mx-auto max-w-2xl space-y-3">
        <div className="text-sm text-gray-500">docs.pyhelp.example · Official documentation · Python 3 tutorial</div>
        <h1 className="text-2xl font-semibold">Errors and Exceptions</h1>
        <p>
          <code className="rounded bg-gray-100 px-1">NameError</code> is raised when a local or global name is not found. The error message tells you which name:{' '}
          <code className="rounded bg-gray-100 px-1">name 'x' is not defined</code>.
        </p>
        <p>The last line of the traceback says what kind of error it is; the lines above show where it happened.</p>
        <p className="text-sm text-gray-500">Last updated 2 weeks ago.</p>
      </div>
    </div>
  )
}
registerSite(DOCS, Docs, 'Errors and Exceptions – Python tutorial docs')

registerSearchEntry({
  url: QA,
  title: 'NameError: name is not defined (Python) – pyanswers.example',
  snippet: "Accepted answer: Python has never seen that name — check the spelling and that the variable is created before use. nameerror name 'x' is not defined.",
  keywords: ['nameerror', 'name', 'defined', 'python', 'error', 'not', 'is', 'mesage', 'message', 'undefined', 'variable'],
  rank: 5,
})
registerSearchEntry({
  url: DOCS,
  title: 'Errors and Exceptions – Python tutorial (official docs)',
  snippet: 'Official documentation: what NameError and other exceptions mean, and how to read a traceback.',
  keywords: ['nameerror', 'python', 'errors', 'exceptions', 'traceback', 'docs', 'documentation', 'defined', 'name'],
  rank: 4,
})
