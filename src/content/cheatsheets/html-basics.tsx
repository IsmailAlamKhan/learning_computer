import type { CheatSheet } from './index'

const TAGS: [string, string, string][] = [
  ['<h1>শিরোনাম</h1>', 'বড় শিরোনাম (Heading); h2 … h6 ক্রমে ছোট', 'শিরোনাম'],
  ['<p>লেখা</p>', 'অনুচ্ছেদ (Paragraph)', 'অনুচ্ছেদ'],
  ['<ul>\n  <li>ভাত</li>\n  <li>ডাল</li>\n</ul>', 'বুলেট-তালিকা (List)', 'তালিকা'],
  ['<a href="https://example.com">লিংক</a>', 'লিংক (Link): href = গন্তব্যের ঠিকানা', 'লিংক'],
  ['<img src="photo.jpg" alt="ছবির বর্ণনা">', 'ছবি (Image); alt = ছবির বর্ণনা; বন্ধের ট্যাগ নেই', 'ছবি'],
  ['<!-- নিজের নোট -->', 'মন্তব্য (Comment): পাতায় দেখা যায় না', 'মন্তব্য'],
]

const CSS: [string, string][] = [
  ['color: teal;', 'লেখার রং'],
  ['background-color: lightyellow;', 'পেছনের রং'],
  ['font-size: 24px;', 'লেখার আকার'],
  ['text-align: center;', 'লেখা মাঝে (left = বাঁয়ে, right = ডানে)'],
  ['margin: 20px;', 'বাইরের ফাঁকা জায়গা'],
  ['padding: 16px;', 'ভেতরের ফাঁকা জায়গা'],
]

const SKELETON = `<!DOCTYPE html>
<html lang="bn">
<head>
  <meta charset="utf-8">
  <title>আমার পাতা</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <h1>স্বাগতম</h1>
  <p>এটি আমার প্রথম ওয়েবপেজ।</p>
</body>
</html>`

const TIPS: string[] = [
  'যা খুলি, তা বন্ধ করি: <p> খুললে শেষে </p>।',
  'সব ট্যাগের নাম ইংরেজিতে, ভেতরের লেখা বাংলাতেও চলে (ফাইল UTF-8 হলে)।',
  'সেভ করি (Windows: Ctrl+S, Mac: Cmd+S), তারপর ব্রাউজারে খুলে বা প্রিভিউতে দেখি।',
  'ফল না এলে: বন্ধের ট্যাগ, কোটেশন (") আর বানান মিলিয়ে দেখুন।',
  'আটকে গেলে MDN Web Docs (Mozilla-র অফিসিয়াল ডকুমেন্টেশন) দেখতে পারেন।',
]

function Component() {
  return (
    <div className="space-y-4">
      <p className="m-0">HTML পাতার কাঠামো লেখে, CSS সাজায়। ট্যাগগুলো &lt; আর &gt; চিহ্নের ভেতরে থাকে।</p>
      <h2 className="m-0 text-lg font-bold">প্রধান ট্যাগ</h2>
      <table>
        <thead>
          <tr><th scope="col">লিখি</th><th scope="col">মানে</th></tr>
        </thead>
        <tbody>
          {TAGS.map(([code, mean, key]) => (
            <tr key={key}>
              <td><pre className="m-0 whitespace-pre-wrap font-mono text-sm">{code}</pre></td>
              <td className="text-sm">{mean}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2 className="m-0 text-lg font-bold">একটি পুরো পাতার কাঠামো</h2>
      <pre className="m-0 overflow-auto rounded-lg border p-3 font-mono text-sm" style={{ borderColor: 'var(--c-line)' }}>{SKELETON}</pre>
      <h2 className="m-0 text-lg font-bold">CSS: সিলেক্টর { '{ প্রপার্টি: ভ্যালু; }' }</h2>
      <pre className="m-0 rounded-lg border p-3 font-mono text-sm" style={{ borderColor: 'var(--c-line)' }}>{'h1 {\n  color: teal;\n  text-align: center;\n}'}</pre>
      <table>
        <tbody>
          {CSS.map(([c, m]) => (
            <tr key={c}><td className="font-mono text-sm">{c}</td><td className="text-sm">{m}</td></tr>
          ))}
        </tbody>
      </table>
      <h2 className="m-0 text-lg font-bold">মনে রাখার কথা</h2>
      <ul className="m-0 space-y-1 pl-5">{TIPS.map((x) => <li key={x}>☐ {x}</li>)}</ul>
    </div>
  )
}

const sheet: CheatSheet = { id: 'html-basics', titleBn: 'HTML ও CSS-এর মূল কথা', Component }
export default sheet
