import type { CheatSheet } from './index'
import { EDIT_ROWS, SYSTEM_ROWS, formatAlternatives } from '../../lib/shortcutData'
import { SYMBOLS, howToType } from '../../lib/symbols'

function ShortcutRows({ rows }: { rows: typeof EDIT_ROWS }) {
  return (
    <>
      {rows.map((r) => (
        <tr key={r.id}>
          <th scope="row" className="font-medium">{r.labelBn}</th>
          <td><kbd>{formatAlternatives(r.win, 'windows')}</kbd></td>
          <td><kbd>{formatAlternatives(r.mac, 'mac')}</kbd></td>
        </tr>
      ))}
    </>
  )
}

function Component() {
  const half = Math.ceil(SYMBOLS.length / 2)
  const cols = [SYMBOLS.slice(0, half), SYMBOLS.slice(half)]
  return (
    <div className="space-y-4">
      <p className="m-0">Windows-এ <strong>Ctrl</strong>, Mac-এ <strong>Command (⌘)</strong> — বাকি অক্ষর একই। কী-গুলো একসাথে চেপে ধরতে হয় — আগে Ctrl বা Command চেপে ধরুন, তারপর অক্ষরটি চাপুন।</p>
      <table>
        <thead>
          <tr><th>কাজ</th><th>Windows</th><th>Mac</th></tr>
        </thead>
        <tbody>
          <ShortcutRows rows={EDIT_ROWS} />
          <ShortcutRows rows={SYSTEM_ROWS} />
        </tbody>
      </table>
      <h2 className="m-0 text-lg font-bold">প্রোগ্রামিংয়ের চিহ্ন কীভাবে লিখব (US কিবোর্ড)</h2>
      <div className="grid grid-cols-2 gap-3">
        {cols.map((col, ci) => (
          <table key={ci}>
            <thead>
              <tr><th>চিহ্ন</th><th>নাম</th><th>কী চাপব</th></tr>
            </thead>
            <tbody>
              {col.map((s) => {
                const h = howToType(s.char)!
                return (
                  <tr key={s.char}>
                    <td><code className="text-lg font-bold">{s.char}</code></td>
                    <td className="text-sm">{s.nameBn}</td>
                    <td className="text-sm whitespace-nowrap">{h.keys.join(' + ')}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        ))}
      </div>
      <p className="m-0 text-sm">বাংলা ও ইংরেজি কিবোর্ড বদলাতে: Windows-এ <kbd>Win + Space</kbd> (বা কিছু কম্পিউটারে <kbd>Alt + Shift</kbd>), Mac-এ <kbd>Control + Space</kbd>। কোড লেখার সময় ইংরেজি কিবোর্ড রাখুন। আপনার কম্পিউটারে একটু আলাদা দেখাতে পারে।</p>
    </div>
  )
}

const sheet: CheatSheet = { id: 'keyboard-shortcuts', titleBn: 'কিবোর্ড শর্টকাট ও প্রোগ্রামিংয়ের চিহ্ন (Windows ও Mac)', Component }
export default sheet
