import type { CheatSheet } from './index'

const ROWS: [string, string, string][] = [
  ['এখন কোন ফোল্ডারে আছি', 'pwd', 'pwd'],
  ['এখানে কী কী আছে', 'dir (বা ls)', 'ls'],
  ['ফোল্ডারে ঢোকা', 'cd Documents', 'cd Documents'],
  ['এক ধাপ ওপরে ফেরা', 'cd ..', 'cd ..'],
  ['হোম ফোল্ডারে ফেরা', 'cd ~', 'cd ~'],
  ['নতুন ফোল্ডার বানানো', 'mkdir coding', 'mkdir coding'],
  ['নতুন খালি ফাইল বানানো', 'ni notes.txt', 'touch notes.txt'],
  ['ফাইলে লেখা ঢোকানো', 'echo "hello" > hello.txt', 'echo "hello" > hello.txt'],
  ['ফাইলের লেখা পড়া', 'type hello.txt (বা cat)', 'cat hello.txt'],
  ['পর্দা পরিষ্কার করা', 'cls (বা clear)', 'clear'],
  ['স্পেসওয়ালা নাম', 'cd "My Photos"', 'cd "My Photos"'],
]

const TRICKS: string[] = [
  'Tab: নামের প্রথম কয়েকটি অক্ষর লিখে Tab চাপলে বাকিটা নিজে লেখা হয়',
  '↑ (ওপরের তীর): আগের কমান্ড ফিরে আসে; Enter চাপলে আবার চলে',
  'Ctrl+C: লেখা লাইনটি বাতিল করে নতুন লাইনে যায়',
  'ভুল কিছু হলে এরর লেখাটি শান্তভাবে পড়ুন: বানান ও বর্তমান ফোল্ডার মিলিয়ে নিন',
]

const SAFETY: string[] = [
  'rm -rf (Mac), del /s (Windows), format, sudo: এগুলো Trash বা Recycle Bin ছাড়াই মুছে দিতে পারে, ফেরানো কঠিন',
  'ইন্টারনেট বা অন্যের পাঠানো কমান্ড না বুঝে কপি-পেস্ট করবেন না',
  'আসল কম্পিউটারে আগে pwd আর dir/ls দিয়ে দেখুন, তারপর কাজ করুন',
  'মুছতে হলে File Explorer / Finder ব্যবহার করুন, সেখানে ফেরানোর সুযোগ থাকে',
]

const PATHS: [string, string][] = [
  ['Windows', 'C:\\Users\\Anika\\Documents — উল্টো দাঁড়ি (\\), প্রম্পটে PS … >'],
  ['Mac', '/Users/anika/Documents — সোজা দাঁড়ি (/), প্রম্পটে anika@Mac … %'],
  ['হোম ফোল্ডার', 'Windows: C:\\Users\\Anika   Mac: /Users/anika (সংক্ষেপে ~)'],
]

function Component() {
  return (
    <div className="space-y-4">
      <p className="m-0">টার্মিনাল হলো ক্লিকের বদলে লিখে কাজ করা। ফাইল-ফোল্ডার একই, শুধু দেখার পথ আলাদা।</p>
      <h2 className="m-0 text-lg font-bold">কমান্ড পাশাপাশি</h2>
      <table>
        <thead>
          <tr><th scope="col">কাজ</th><th scope="col">Windows PowerShell</th><th scope="col">Mac Terminal</th></tr>
        </thead>
        <tbody>
          {ROWS.map(([a, w, m]) => (
            <tr key={a}>
              <th scope="row" className="font-medium">{a}</th>
              <td className="font-mono text-sm">{w}</td>
              <td className="font-mono text-sm">{m}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2 className="m-0 text-lg font-bold">পথ মনে রাখুন</h2>
      <table>
        <tbody>
          {PATHS.map(([a, b]) => (
            <tr key={a}><th scope="row" className="font-medium">{a}</th><td className="text-sm">{b}</td></tr>
          ))}
        </tbody>
      </table>
      <h2 className="m-0 text-lg font-bold">কাজের কৌশল</h2>
      <ul className="m-0 space-y-1 pl-5">{TRICKS.map((x) => <li key={x}>{x}</li>)}</ul>
      <h2 className="m-0 text-lg font-bold">নিরাপত্তা</h2>
      <ul className="m-0 space-y-1 pl-5">{SAFETY.map((x) => <li key={x}>☐ {x}</li>)}</ul>
      <p className="m-0 text-sm">আপনার কম্পিউটারে প্রম্পট একটু আলাদা দেখাতে পারে।</p>
    </div>
  )
}

const sheet: CheatSheet = { id: 'terminal-commands', titleBn: 'টার্মিনালের কমান্ড (Windows ও Mac)', Component }
export default sheet
