import { useMemo, useState } from 'react'
import type { OsFlavor, SimSetup } from '../engine/types'
import { SimStage } from '../sim/SimStage'
import { SimBus } from '../sim/bus'
import type { VirtualFileSystem } from '../sim/vfs'

const HELLO_PY = `name = input("আপনার নাম কী? ")
print("স্বাগতম, " + name)
`
const HELLO_JS = `// একটি ছোট জাভাস্ক্রিপ্ট প্রোগ্রাম
console.log("স্বাগতম! এটি আমার প্রথম প্রোগ্রাম")
console.log("ক্ষমতা, স্তব্ধ, আনন্দ")
`
const INDEX_HTML = `<!DOCTYPE html>
<html lang="bn">
<head>
  <meta charset="utf-8">
  <title>আমার প্রথম পাতা</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <h1>আমার প্রথম ওয়েবপেজ</h1>
  <p>এটি একটি ছোট অনুচ্ছেদ। এখানে যা খুশি লিখুন।</p>
  <ul>
    <li>ভাত</li>
    <li>ডাল</li>
    <li>সবজি</li>
  </ul>
  <a href="https://example.com">একটি লিংক</a>
</body>
</html>
`
const STYLE_CSS = `body {
  font-family: sans-serif;
  background: #fffbe6;
  margin: 16px;
}

h1 {
  color: #0b5cad;
}
`
const BROKEN_PY = `name = "রুমা"
print("হ্যালো, " + nam)
`

export function seedCoding(vfs: VirtualFileSystem) {
  const home = vfs.home
  const folder = vfs.child(home, 'coding') ?? vfs.mkdir(home, 'coding')
  const files: Record<string, string> = { 'hello.py': HELLO_PY, 'hello.js': HELLO_JS, 'index.html': INDEX_HTML, 'style.css': STYLE_CSS, 'broken.py': BROKEN_PY }
  for (const [n, c] of Object.entries(files)) if (!vfs.child(folder, n)) vfs.createFile(folder, n, c)
}

const setup: SimSetup = { openApps: ['terminal', 'code'], vfs: (v) => seedCoding(v) }

export default function ToolsDemo() {
  const [os, setOs] = useState<OsFlavor>('windows')
  const [dark, setDark] = useState(false)
  const bus = useMemo(() => new SimBus(), [os])
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">টুলস ডেমো — টার্মিনাল ও কোড এডিটর</h1>
      <div className="flex items-center gap-2" role="group" aria-label="অপারেটিং সিস্টেম">
        <button className={`btn ${os === 'windows' ? '' : 'btn-outline'}`} aria-pressed={os === 'windows'} data-testid="os-windows" onClick={() => setOs('windows')}>
          Windows
        </button>
        <button className={`btn ${os === 'mac' ? '' : 'btn-outline'}`} aria-pressed={os === 'mac'} data-testid="os-mac" onClick={() => setOs('mac')}>
          Mac
        </button>
        <label className="ml-4 flex items-center gap-2">
          <input type="checkbox" checked={dark} onChange={(e) => setDark(e.target.checked)} data-testid="dark-toggle" />
          গাঢ় থিম
        </label>
      </div>
      <SimStage key={`${os}-${dark}`} os={os} bus={bus} setup={setup} initialSettings={{ darkMode: dark }} />
      <div className="card space-y-2">
        <h2 className="text-lg font-bold">কী কী করে দেখবেন</h2>
        <ul className="list-disc space-y-1 pl-6">
          <li>
            টার্মিনালে টাইপ করুন: <code>pwd</code>, <code>ls</code>, <code>cd coding</code>, <code>python hello.py</code>
          </li>
          <li>কোড এডিটরের বাঁ দিকের তালিকা থেকে <code>index.html</code> খুলুন — ডান পাশে সাথে সাথে প্রিভিউ দেখা যাবে। লেখা বদলান, প্রিভিউও বদলে যাবে।</li>
          <li><code>hello.js</code> বা <code>hello.py</code> খুলে ▶ Run চাপুন। <code>broken.py</code> চালিয়ে দেখুন ভুল হলে কেমন সহজ বাংলায় বোঝানো হয়।</li>
          <li>সেভ করতে {os === 'mac' ? 'Cmd+S' : 'Ctrl+S'} চাপুন বা Save বোতাম টিপুন।</li>
        </ul>
        <h2 className="text-lg font-bold">Windows আর Mac-এ পার্থক্য</h2>
        <p>
          কোড এডিটর দুই জায়গাতেই একই। সেভের শর্টকাট আলাদা: Windows-এ Ctrl+S, Mac-এ Cmd+S। টার্মিনালে Windows-এ ফোল্ডারের পথ <code>C:\Users\…</code> আর Mac-এ <code>/Users/…</code> আকারে দেখা যায়, তবে <code>cd</code>, <code>ls</code> (Windows-এ <code>dir</code>ও চলে) প্রায় একই কাজ করে।
        </p>
      </div>
    </div>
  )
}
