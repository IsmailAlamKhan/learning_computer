import type { CheatSheet } from './index'

const BEFORE: string[] = [
  'কম্পিউটার আপডেট করা আছে কি না দেখুন (Windows: Settings → Windows Update; Mac: System Settings → General → Software Update)',
  'অন্তত কয়েক GB খালি জায়গা আছে কি না দেখুন — Python, Node.js আর VS Code মিলিয়ে সাধারণত কয়েকশো MB থেকে কয়েক GB লাগে',
  'নিজের কম্পিউটারের অ্যাডমিন পাসওয়ার্ড (বা Windows-এ অনুমতির “Yes”) কাছে রাখুন — ইনস্টলের সময় চাইবে',
  'স্থির ইন্টারনেট সংযোগ, আর সময় হাতে রাখুন। তাড়াহুড়ো করবেন না',
]

const SITES: [string, string][] = [
  ['VS Code (কোড এডিটর)', 'code.visualstudio.com'],
  ['Python', 'www.python.org'],
  ['Node.js', 'nodejs.org'],
]

const STEPS: string[] = [
  'ব্রাউজারে ঠিকানা নিজে টাইপ করুন (বা বুকমার্ক থেকে যান) — বিজ্ঞাপন (Ad) লেবেলওয়ালা ফলাফলে নয়। অক্ষর ধরে ধরে মিলিয়ে নিন',
  'পাতায় আপনার কম্পিউটারের ধরন (Windows / macOS) দেখে ডাউনলোড বোতাম চাপুন। পাতার ভেতরের বড় রঙিন “Download Now” বিজ্ঞাপনে নয়',
  'ফাইলের নাম আর প্রকাশক (publisher) দেখুন। Downloads ফোল্ডারে ফাইলটি আছে কি না দেখুন',
  'Python (Windows): ইনস্টলারে “Add python.exe to PATH” টিক দিন, তারপর Install Now',
  'Python (Mac): .pkg খুলে Continue → Agree → Install, পাসওয়ার্ড চাইলে নিজের পাসওয়ার্ড দিন',
  'Node.js: LTS সংস্করণ নিন। Windows-এ .msi, Mac-এ .pkg; ধাপগুলোতে সাধারণত Next / Continue, শেষে Install',
  'VS Code: Windows-এ ইনস্টলার চালান; Mac-এ ডাউনলোড করা ফাইলটি (সাধারণত .zip, কখনো .dmg) খুলে অ্যাপটি Applications ফোল্ডারে টেনে দিন',
  'ইনস্টলার অন্য কোনো টুলবার, এক্সটেনশন বা “অফার” ইনস্টল করতে চাইলে না বলুন (সাধারণত এই তিনটির ইনস্টলারে থাকে না, থাকলে থামুন)',
]

const CHECK: [string, string, string][] = [
  ['Python', 'python --version', 'python3 --version'],
  ['Node.js', 'node --version', 'node --version'],
  ['Git (পরে, ঐচ্ছিক)', 'git --version', 'git --version'],
]

const FOLDERS = ['Documents/coding', 'Documents/coding/html-css', 'Documents/coding/python', 'Documents/coding/javascript', 'Documents/coding/projects']

const EXT: string[] = [
  'Python এক্সটেনশন — Python ফাইলের জন্য সাহায্য',
  'Live Server (বা Live Preview) — HTML পেজের প্রিভিউ',
  'বাংলা ভাষার প্যাক — মেনু বাংলায় দেখতে চাইলে, যদি পাওয়া যায় (ঐচ্ছিক)',
  'Prettier — কোড সুন্দরভাবে সাজায় (পরে, ঐচ্ছিক)',
]

function Component() {
  return (
    <div className="space-y-4">
      <p className="m-0">স্বামীর সাথে বসে আসল কম্পিউটারে করার তালিকা। প্রতিটি ঘরে টিক দিন। কোনো ধাপে আটকে গেলে স্ক্রিনের ছবি (screenshot) তুলে রাখুন।</p>
      <h2 className="m-0 text-lg font-bold">১. শুরুর আগে</h2>
      <ul className="m-0 space-y-1 pl-5">
        {BEFORE.map((x) => <li key={x}>☐ {x}</li>)}
      </ul>
      <h2 className="m-0 text-lg font-bold">২. শুধু এই অফিসিয়াল ঠিকানাগুলো</h2>
      <table>
        <tbody>
          {SITES.map(([a, b]) => (
            <tr key={a}>
              <th scope="row" className="font-medium">{a}</th>
              <td><kbd>{b}</kbd></td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="m-0 text-sm">নকল সাইটের ঠিকানা প্রায় একই রকম দেখায় (যেমন o-এর জায়গায় 0)। অক্ষর ধরে ধরে মেলান।</p>
      <h2 className="m-0 text-lg font-bold">৩. নামানো ও ইনস্টল</h2>
      <ul className="m-0 space-y-1 pl-5">
        {STEPS.map((x) => <li key={x}>☐ {x}</li>)}
      </ul>
      <h2 className="m-0 text-lg font-bold">৪. টার্মিনালে যাচাই</h2>
      <table>
        <thead>
          <tr><th>কোনটি</th><th>Windows</th><th>Mac</th></tr>
        </thead>
        <tbody>
          {CHECK.map(([a, w, m]) => (
            <tr key={a}>
              <th scope="row" className="font-medium">{a}</th>
              <td><kbd>{w}</kbd></td>
              <td><kbd>{m}</kbd></td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="m-0 text-sm">সংস্করণ-সংখ্যা ছাপা হলে ঠিক আছে। “not recognized” বা “command not found” এলে: টার্মিনাল বন্ধ করে নতুন করে খুলে আবার চেষ্টা করুন; তাতেও না হলে ছবি তুলে রাখুন।</p>
      <h2 className="m-0 text-lg font-bold">৫. কোডিং ফোল্ডার</h2>
      <ul className="m-0 space-y-1 pl-5">
        {FOLDERS.map((x) => <li key={x}>☐ <kbd>{x}</kbd></li>)}
      </ul>
      <h2 className="m-0 text-lg font-bold">৬. এক্সটেনশন (শুধু অফিসিয়াল মার্কেটপ্লেস থেকে)</h2>
      <ul className="m-0 space-y-1 pl-5">
        {EXT.map((x) => <li key={x}>☐ {x}</li>)}
      </ul>
      <p className="m-0 text-sm">ইনস্টলের আগে দেখুন: ঠিক প্রকাশক, বেশি ইনস্টল-সংখ্যা (লক্ষ-কোটি), ভালো রেটিং।</p>
      <h2 className="m-0 text-lg font-bold">৭. মনে রাখুন</h2>
      <ul className="m-0 space-y-1 pl-5">
        <li>☐ Git আর GitHub পরে আসবে — এখন ইনস্টল না করলেও চলবে। GitHub-এর বিনামূল্যের অ্যাকাউন্টে ইমেইল লাগে</li>
        <li>☐ “আপনার Python এখনই আপডেট করুন” — এমন পপ-আপ বা বিজ্ঞাপনে ক্লিক নয়। আপডেট শুধু অফিসিয়াল সাইট বা কম্পিউটারের আপডেট থেকে</li>
        <li>☐ কম্পিউটারের নিজের আপডেট নিয়মিত করুন</li>
      </ul>
    </div>
  )
}

const sheet: CheatSheet = { id: 'setup-checklist', titleBn: 'সেটআপ চেকলিস্ট — কোডিংয়ের প্রোগ্রাম ইনস্টল', Component }
export default sheet
