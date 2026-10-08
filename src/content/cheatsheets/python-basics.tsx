import type { CheatSheet } from './index'

const ROWS: [string, string][] = [
  ['print("স্বাগতম")', 'পর্দায় লেখা ছাপে (Print)'],
  ['name = "Rumi"', 'ভেরিয়েবল (Variable): name বাক্সে Rumi রাখে'],
  ['name = input("নাম? ")', 'ব্যবহারকারীর উত্তর নেয় (লেখা হিসেবে)'],
  ['age = int(input("বয়স? "))', 'উত্তরকে পূর্ণসংখ্যায় (Integer) বদলে নেয়'],
  ['print("Hello, " + name)', '+ দিয়ে লেখা জোড়া লাগে'],
  ['print("বয়স", age + 1)', 'কমা দিয়ে একাধিক জিনিস ছাপে'],
  ['# নিজের নোট', 'মন্তব্য (Comment): পাইথন চালায় না'],
]

const OPS: [string, string][] = [
  ['+  -', 'যোগ, বিয়োগ'],
  ['*  /', 'গুণ, ভাগ (ভাগে 7 / 2 = 3.5)'],
  ['**', 'ঘাত (2 ** 3 = 8)'],
  ['==  !=', 'সমান, সমান নয়'],
  ['>  >=  <  <=', 'বড়, বড় বা সমান, ছোট, ছোট বা সমান'],
]

const IF = `if age >= 18:
    print("adult")
else:
    print("not yet")`

const LOOP = `for i in range(3):
    print(i)      # 0 1 2`

const TIPS: string[] = [
  'আগে আন্দাজ করি কী ছাপা হবে, তারপর চালাই (Run)।',
  'if, else, for লাইনের শেষে কোলন (:)।',
  'ভেতরের লাইন ৪ ঘর সরানো (ইন্ডেন্টেশন); একই ব্লকের সব লাইন একই সরানো।',
  'কোটেশন (" ") আর বন্ধনী ( ) জোড়ায় জোড়ায় বন্ধ করি।',
  'এরর এলে ইংরেজি বার্তার শেষ লাইনটি আর লাইন নম্বর পড়ি; ওই লাইনের আগের-পরের লাইনও দেখি।',
  'চালাই: টার্মিনালে Windows-এ python hello.py (না চললে py hello.py), Mac-এ python3 hello.py।',
  'আটকে গেলে python.org-এর অফিসিয়াল ডকুমেন্টেশন দেখতে পারেন।',
]

function Component() {
  return (
    <div className="space-y-4">
      <p className="m-0">পাইথন ওপর থেকে নিচে, এক লাইন এক লাইন করে চলে। বাংলা লেখাও কোটেশনের ভেতরে ঠিকঠাক ছাপা হয়।</p>
      <h2 className="m-0 text-lg font-bold">প্রধান লাইন</h2>
      <table>
        <tbody>
          {ROWS.map(([c, m]) => (
            <tr key={c}><td className="font-mono text-sm">{c}</td><td className="text-sm">{m}</td></tr>
          ))}
        </tbody>
      </table>
      <h2 className="m-0 text-lg font-bold">অপারেটর</h2>
      <table>
        <tbody>
          {OPS.map(([c, m]) => (
            <tr key={c}><td className="font-mono text-sm">{c}</td><td className="text-sm">{m}</td></tr>
          ))}
        </tbody>
      </table>
      <h2 className="m-0 text-lg font-bold">শর্ত (if / else)</h2>
      <pre className="m-0 rounded-lg border p-3 font-mono text-sm" style={{ borderColor: 'var(--c-line)' }}>{IF}</pre>
      <h2 className="m-0 text-lg font-bold">লুপ (for)</h2>
      <pre className="m-0 rounded-lg border p-3 font-mono text-sm" style={{ borderColor: 'var(--c-line)' }}>{LOOP}</pre>
      <h2 className="m-0 text-lg font-bold">মনে রাখার কথা</h2>
      <ul className="m-0 space-y-1 pl-5">{TIPS.map((x) => <li key={x}>☐ {x}</li>)}</ul>
    </div>
  )
}

const sheet: CheatSheet = { id: 'python-basics', titleBn: 'পাইথনের মূল কথা', Component }
export default sheet
