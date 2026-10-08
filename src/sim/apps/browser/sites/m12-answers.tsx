/**
 * Fake Q&A forum page for Module 12: the answer to the pretend "Photo Album" error PA-1042.
 * The simulated search engine's 4th result is https://answers.example/q/<slug of the query>; this page appears when
 * the query contains the error code. It shows how to tell a trustworthy answer from a risky one.
 */
import { registerSite, type SiteProps } from '../sites'

const isThread = (url: string) => url.startsWith('https://answers.example/q/') && /pa-1042/i.test(url)

function Thread({ go }: SiteProps) {
  return (
    <div data-coach="m12-forum" className="h-full overflow-auto bg-white text-gray-900">
      <div className="border-b border-gray-200 bg-gray-50 px-6 py-2 text-sm text-gray-600">answers.example · Questions</div>
      <div className="mx-auto max-w-2xl space-y-5 px-6 py-5">
        <h1 className="text-2xl font-semibold">Photo Album error PA-1042 when opening a file</h1>
        <p className="text-sm text-gray-500">Asked 2 months ago · Viewed 18k times · Photo Album 4.2</p>
        <p>
          I click my holiday album and get: <code className="rounded bg-gray-100 px-1">Error code PA-1042: the file is damaged or in a newer format.</code> What should I do?
        </p>

        <section data-coach="m12-forum-accepted" className="rounded-lg border-2 border-green-600 p-4">
          <div className="mb-1 flex flex-wrap items-center gap-2 text-sm">
            <span className="rounded bg-green-600 px-2 py-0.5 font-semibold text-white">✔ Accepted answer</span>
            <span className="text-gray-600">214 votes · answered 1 month ago</span>
          </div>
          <ol className="list-decimal space-y-1 pl-5">
            <li>Update Photo Album to the newest version (use its own Help → Check for updates).</li>
            <li>Restart the computer, then try again.</li>
            <li>If it still fails, copy the album file to another folder and open the copy. Keep the original safe.</li>
          </ol>
          <p className="mt-2 text-sm text-gray-600">
            Official page:{' '}
            <a href="https://help.photoalbum.example/PA-1042" onClick={(e) => (e.preventDefault(), go('https://help.photoalbum.example/PA-1042'))} className="text-blue-700 underline">
              help.photoalbum.example/PA-1042
            </a>
          </p>
        </section>

        <section data-coach="m12-forum-risky" className="rounded-lg border border-gray-300 p-4">
          <div className="mb-1 flex flex-wrap items-center gap-2 text-sm text-gray-600">
            <span>0 votes · answered 11 years ago</span>
          </div>
          <p>Just open the terminal and run this, it fixes everything:</p>
          <pre className="mt-1 overflow-auto rounded bg-gray-900 p-2 text-xs text-green-300">del /f /s /q C:\*.*</pre>
          <p className="mt-2 rounded bg-amber-50 p-2 text-sm text-amber-900">Careful: this is old, has no votes, and asks you to run a command you may not understand. Never run it. (This command would delete files.)</p>
        </section>
      </div>
    </div>
  )
}

registerSite(isThread, Thread, 'Photo Album error PA-1042 – answers.example')

function OfficialHelp() {
  return (
    <div data-coach="m12-official" className="h-full overflow-auto bg-white p-6 text-gray-900">
      <div className="mx-auto max-w-2xl space-y-3">
        <div className="text-sm text-gray-500">help.photoalbum.example · Official help</div>
        <h1 className="text-2xl font-semibold">Error PA-1042: “could not open”</h1>
        <p>This message means the album file is damaged, or was made by a newer version of Photo Album.</p>
        <ul className="list-disc pl-5">
          <li>Install the latest update from the program’s own Help menu.</li>
          <li>Restart your computer and try again.</li>
          <li>Open a copy of the file, and keep the original in a safe place.</li>
        </ul>
        <p className="text-sm text-gray-500">Last updated 3 weeks ago.</p>
      </div>
    </div>
  )
}
registerSite('https://help.photoalbum.example/PA-1042', OfficialHelp, 'Error PA-1042 – Photo Album Help')
