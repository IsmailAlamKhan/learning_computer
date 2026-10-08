import type { ExpectedAction, Lesson, OsFlavor, Step } from '../../engine/types'

const TI = 'terminal-input'

/** Every accepted way to type "cd <name>" (also the form Tab-completion leaves behind). */
function cdForms(name: string, os: OsFlavor): string[] {
  const base = [`cd ${name}`, `cd ${name}/`, `cd ./${name}`]
  return os === 'windows'
    ? [...base, `cd ${name}\\`, `cd .\\${name}`, `cd ${name.toLowerCase()}`, `cd ${name.toLowerCase()}\\`, `Set-Location ${name}`, `sl ${name}`]
    : base
}

function steps(os: OsFlavor): Step[] {
  const win = os === 'windows'
  const p = win ? 'w' : 'm'
  const t = (id: string, titleBn: string, explanationBn: string, expectedAction: ExpectedAction, hintBn: string, simplerBn?: string, target: string = TI): Step => ({
    id: `${p}-${id}`, titleBn, explanationBn, target, expectedAction, hintBn, simplerBn, osVariant: os,
  })
  const prompt = win ? 'PS C:\\Users\\Anika>' : 'anika@Mac ~ %'
  return [
    t(
      'pwd', 'আমি এখন কোথায়? — pwd',
      `টার্মিনালের নিচের লাইনে ${prompt} লেখা আছে, তার পরে কার্সর জ্বলছে। সেখানে pwd লিখে Enter চাপুন। pwd মানে “এখন কোন ফোল্ডারে আছি?”`,
      { type: 'typeCommand', command: win ? ['pwd', 'gl', 'Get-Location'] : ['pwd'] },
      'ছোট হাতের অক্ষরে p, w, d লিখে Enter চাপুন।',
      'কালো পর্দার নিচের লাইনে ক্লিক করে p w d লিখুন, তারপর কিবোর্ডের Enter বোতাম চাপুন।',
    ),
    t(
      'ls', win ? 'এখানে কী কী আছে? — dir' : 'এখানে কী কী আছে? — ls',
      win
        ? 'এবার dir লিখে Enter চাপুন। এই ফোল্ডারের সব ফাইল-ফোল্ডারের তালিকা আসবে — File Explorer-এ ফোল্ডার খুললে যা দেখেন, ঠিক তা-ই। (PowerShell-এ ls লিখলেও একই কাজ হয়।)'
        : 'এবার ls লিখে Enter চাপুন। এই ফোল্ডারের সব ফাইল-ফোল্ডারের তালিকা আসবে — Finder-এ ফোল্ডার খুললে যা দেখেন, ঠিক তা-ই।',
      { type: 'typeCommand', command: win ? ['dir', 'ls', 'gci', 'Get-ChildItem'] : ['ls'], match: 'prefix' },
      win ? 'd, i, r লিখে Enter চাপুন।' : 'l আর s লিখে Enter চাপুন।',
    ),
    t(
      'cd-docs', 'অন্য ফোল্ডারে যান — cd Documents',
      'ওই তালিকায় Documents নামে একটি ফোল্ডার আছে। সেখানে যেতে লিখুন: cd Documents (cd মানে “change directory” — ফোল্ডার বদলাও)। cd আর Documents-এর মাঝে একটি ফাঁকা জায়গা (স্পেস) দিতে হয়।',
      { type: 'typeCommand', command: cdForms('Documents', os) },
      win ? 'cd, তারপর একটি স্পেস, তারপর Documents। Windows-এ বড়-ছোট হাতের অক্ষর ধরে না।' : 'cd, তারপর একটি স্পেস, তারপর Documents — D বড় হাতের অক্ষর। Mac-এ বড়-ছোট হাতের অক্ষর মিলিয়ে লেখাই নিরাপদ।',
      'cd লিখে একটি স্পেস দিন, তারপর Documents লিখে Enter চাপুন।',
    ),
    t(
      'pwd2', win ? 'প্রম্পট আর pwd দেখুন' : 'প্রম্পট আর pwd দেখুন',
      win
        ? 'দেখুন, প্রম্পটের পথের শেষে এখন \\Documents লেখা। আবার pwd লিখে Enter চাপুন — পথটা মিলিয়ে নিন। এটি মডিউল ৪-এ শেখা সম্পূর্ণ পথ: C:\\Users\\Anika\\Documents।'
        : 'দেখুন, প্রম্পটে এখন ~ এর জায়গায় Documents লেখা। আবার pwd লিখে Enter চাপুন — পথটা মিলিয়ে নিন। এটি মডিউল ৪-এ শেখা সম্পূর্ণ পথ: /Users/anika/Documents।',
      { type: 'typeCommand', command: ['pwd', 'gl', 'Get-Location'] },
      'আগের মতোই pwd লিখে Enter চাপুন।',
    ),
    t(
      'cd-up', 'এক ধাপ ওপরে — cd ..',
      'ওপরের ফোল্ডারে ফিরতে লিখুন: cd .. (cd, স্পেস, তারপর দুটি বিন্দু)। দুটি বিন্দুর মানে “ওপরের (পেরেন্ট) ফোল্ডার”। এখন আপনি আবার হোম ফোল্ডারে ফিরবেন।',
      { type: 'typeCommand', command: ['cd ..', 'cd ../', 'cd ..\\', 'cd ~', 'cd'] },
      'cd, একটি স্পেস, আর পরপর দুটি বিন্দু (..)।',
      'cd লিখুন, স্পেস দিন, তারপর কিবোর্ডে বিন্দু (.) দুবার চাপুন।',
    ),
    t(
      'mkdir', 'নতুন ফোল্ডার বানান — mkdir',
      `হোম ফোল্ডারে (প্রম্পটে ${win ? 'C:\\Users\\Anika' : '~'} দেখে নিন) লিখুন: mkdir coding। mkdir মানে “ফোল্ডার বানাও”, আর coding আমাদের নতুন ফোল্ডারের নাম। (নামে স্পেস না দেওয়াই ভালো।)`,
      { type: 'fileExists', path: '~/coding', kind: 'folder' },
      'প্রম্পটে হোম ফোল্ডার না দেখালে আগে cd .. লিখে ফিরে আসুন। তারপর mkdir coding।',
      'mkdir লিখুন, একটি স্পেস দিন, তারপর coding লিখে Enter চাপুন।',
    ),
    t(
      'cd-coding', 'ট্যাব (Tab) দিয়ে ঢুকুন — cd coding',
      `এবার নতুন ফোল্ডারে ঢুকবেন। পুরোটা না লিখে শুধু cd cod লিখুন, তারপর কিবোর্ডের Tab বোতাম চাপুন — টার্মিনাল নিজে বাকিটা (coding${win ? '\\' : '/'}) লিখে দেবে। তারপর Enter।`,
      { type: 'typeCommand', command: cdForms('coding', os) },
      'cd cod লিখে Enter-এর আগে Tab চাপুন (কিবোর্ডের বাঁ দিকে, Caps Lock-এর ওপরে)। নাম নিজে পূর্ণ হলে Enter চাপুন।',
      'Tab কাজ না করলে পুরো নামটা লিখুন: cd coding।',
    ),
    win
      ? t(
          'file', 'নতুন খালি ফাইল বানান — ni',
          'এই ফোল্ডারে একটি ফাইল বানান: ni notes.txt (ni হলো PowerShell-এর New-Item, মানে “নতুন কিছু বানাও”)। Mac-এ এই কাজের কমান্ড touch।',
          { type: 'fileExists', path: '~/coding/notes.txt', kind: 'file' },
          'ni, একটি স্পেস, তারপর notes.txt। বিন্দুও লিখতে হবে।',
        )
      : t(
          'file', 'নতুন খালি ফাইল বানান — touch',
          'এই ফোল্ডারে একটি ফাইল বানান: touch notes.txt (touch মানে এখানে “নতুন খালি ফাইল বানাও”)। Windows PowerShell-এ এই কাজের কমান্ড ni।',
          { type: 'fileExists', path: '~/coding/notes.txt', kind: 'file' },
          'touch, একটি স্পেস, তারপর notes.txt। বিন্দুও লিখতে হবে।',
        ),
    t(
      'echo', 'ফাইলে লেখা ঢোকান — echo ও >',
      'echo যা লেখেন তা-ই পর্দায় দেখায়। কিন্তু শেষে > notes.txt দিলে লেখাটা পর্দার বদলে ফাইলে চলে যায়। লিখুন: echo "hello" > notes.txt (উদ্ধৃতি চিহ্ন সহ)।',
      { type: 'fileContains', path: '~/coding/notes.txt', text: 'hello' },
      'echo, স্পেস, "hello" (দুই পাশে উদ্ধৃতি চিহ্ন), স্পেস, > চিহ্ন, স্পেস, notes.txt।',
      '> চিহ্নটি পাবেন Shift ধরে কমা-র (,) পাশের বিন্দু (.) বোতামে।',
    ),
    t(
      'cat', win ? 'ফাইল পড়ুন — type' : 'ফাইল পড়ুন — cat',
      win ? 'ফাইলের ভেতরে কী আছে দেখতে লিখুন: type notes.txt। (PowerShell-এ cat notes.txt-ও চলে।) hello লেখাটা দেখা গেলে বুঝবেন ফাইলে লেখা ঢুকেছে।' : 'ফাইলের ভেতরে কী আছে দেখতে লিখুন: cat notes.txt। hello লেখাটা দেখা গেলে বুঝবেন ফাইলে লেখা ঢুকেছে।',
      { type: 'typeCommand', command: win ? ['type notes.txt', 'cat notes.txt', 'gc notes.txt', 'Get-Content notes.txt'] : ['cat notes.txt'] },
      win ? 'type, একটি স্পেস, তারপর notes.txt।' : 'cat, একটি স্পেস, তারপর notes.txt।',
    ),
    {
      id: `${p}-history`, titleBn: 'আগের কমান্ড ফিরিয়ে আনুন — ↑',
      explanationBn: `নিজে চেষ্টা করুন: লেখার ঘর খালি রেখে কিবোর্ডের ↑ (ওপরের তীর) বোতাম চাপুন। আগের কমান্ড (${win ? 'type notes.txt' : 'cat notes.txt'}) ফিরে আসবে। আবার ↑ চাপলে তারও আগেরটি। Enter চাপলে কমান্ডটি আবার চলবে। দেখা হলে নিচের “বুঝেছি” বোতাম চাপুন।`,
      target: TI, expectedAction: { type: 'continue' },
      hintBn: 'ঘরটিতে একবার ক্লিক করে ↑ চাপুন। ভুল কিছু হলে Ctrl+C চাপলে লাইনটি মুছে যায়।',
      osVariant: os,
    },
    t(
      'clear', win ? 'পর্দা পরিষ্কার — cls' : 'পর্দা পরিষ্কার — clear',
      win ? 'পর্দা লেখায় ভরে গেছে? cls লিখে Enter চাপুন। শুধু পর্দা পরিষ্কার হবে, কোনো ফাইল মুছবে না। (clear লিখলেও চলে।)' : 'পর্দা লেখায় ভরে গেছে? clear লিখে Enter চাপুন। শুধু পর্দা পরিষ্কার হবে, কোনো ফাইল মুছবে না।',
      { type: 'typeCommand', command: win ? ['cls', 'clear', 'Clear-Host'] : ['clear'] },
      win ? 'c, l, s লিখে Enter।' : 'c, l, e, a, r লিখে Enter।',
    ),
    t(
      'rm', 'বিপজ্জনক কমান্ড — নিরাপদে দেখুন',
      win
        ? 'এখন একটি কমান্ড দেখুন, যেটি আসল কম্পিউটারে ফাইল মুছে ফেলে: del notes.txt। এই অনুশীলন-টার্মিনালে সেটি বন্ধ করা আছে — তাই লিখে Enter চাপুন, আর বার্তাটি মন দিয়ে পড়ুন। কিছুই মুছবে না।'
        : 'এখন একটি কমান্ড দেখুন, যেটি আসল কম্পিউটারে ফাইল মুছে ফেলে: rm notes.txt। এই অনুশীলন-টার্মিনালে সেটি বন্ধ করা আছে — তাই লিখে Enter চাপুন, আর বার্তাটি মন দিয়ে পড়ুন। কিছুই মুছবে না।',
      { type: 'typeCommand', command: win ? ['del', 'rm', 'erase', 'Remove-Item', 'ri'] : ['rm'], match: 'prefix' },
      win ? 'del, একটি স্পেস, তারপর notes.txt।' : 'rm, একটি স্পেস, তারপর notes.txt।',
    ),
    win
      ? t(
          'open-files', 'একই ফোল্ডার, ক্লিক করে দেখুন',
          'টার্মিনালে বানানো ফোল্ডার File Explorer-এও দেখা যাবে — একই ফাইল, শুধু দেখার পথ আলাদা। টাস্কবারের হলুদ ফোল্ডার আইকনে (File Explorer) ক্লিক করুন।',
          { type: 'openApp', app: 'files' },
          'টাস্কবারের নিচের সারিতে হলুদ ফোল্ডারের মতো আইকন।',
          undefined,
          'taskbar-app-files',
        )
      : t(
          'open-files', 'একই ফোল্ডার, ক্লিক করে দেখুন',
          'টার্মিনালে বানানো ফোল্ডার Finder-এও দেখা যাবে — একই ফাইল, শুধু দেখার পথ আলাদা। ডকের একদম বাঁ দিকের Finder আইকনে ক্লিক করুন।',
          { type: 'openApp', app: 'files' },
          'ডকের প্রথম আইকন — নীল-সাদা মুখের মতো।',
          undefined,
          'dock-files',
        ),
    {
      id: `${p}-see-folder`, titleBn: 'coding ফোল্ডারটি খুঁজুন',
      explanationBn: `${win ? 'File Explorer' : 'Finder'}-এ হোম ফোল্ডার (বাঁ পাশে আপনার নাম বা Home) খুলে দেখুন — coding ফোল্ডারটি সেখানে আছে। ভেতরে ঢুকলে notes.txt-ও পাবেন। যে ফোল্ডার টার্মিনালে বানালেন, সেটিই এখানে ক্লিক করে দেখা যায়। দেখা হলে “বুঝেছি” বোতাম চাপুন।`,
      expectedAction: { type: 'continue' },
      hintBn: 'বাঁ পাশের তালিকা থেকে হোম ফোল্ডারটি বেছে নিন।',
      osVariant: os,
    },
  ]
}

const lesson: Lesson = {
  module: 17,
  part: 2,
  id: 'm17',
  titleBn: 'টার্মিনালের প্রথম পাঠ',
  oneLineBn: 'টার্মিনালে লিখে লিখে ফোল্ডার ঘোরা, ফোল্ডার ও ফাইল বানানো, লেখা পড়া — আর বিপজ্জনক কমান্ড কেন সাবধানে ভাবতে হয়।',
  minutes: 7,
  simulation: 'terminal',
  glossaryIds: [
    'term-terminal', 'term-command-line', 'term-shell', 'term-powershell', 'term-zsh', 'term-command', 'term-argument', 'term-prompt',
    'term-current-directory', 'term-pwd', 'term-ls', 'term-cd', 'term-mkdir', 'term-touch', 'term-cat', 'term-echo', 'term-clear',
    'term-tab-completion', 'term-history', 'term-redirect', 'term-dangerous-command',
  ],

  setup: { openApps: ['terminal'] },

  explanation: [
    { kind: 'p', textBn: 'এতদিন আপনি কম্পিউটারকে মাউস দিয়ে ক্লিক করে কাজ দিয়েছেন। টার্মিনাল (Terminal) হলো কম্পিউটারকে কাজ দেওয়ার আরেকটি পথ: কালো-সাদা একটি উইন্ডোতে নির্দেশ লিখে Enter চাপলেই কম্পিউটার সেটি করে। এই নির্দেশগুলোকে বলে কমান্ড (Command)।' },
    { kind: 'analogy', textBn: 'ভাবুন, রেস্তোরাঁয় আপনি দুভাবে খাবার আনাতে পারেন। মেনু দেখে আঙুল দিয়ে দেখিয়ে দেওয়া — এটি File Explorer বা Finder-এ ক্লিক করার মতো। আবার ফোনে গলা দিয়ে বলা, “দুটো খিচুড়ি পাঠান” — এটি টার্মিনালে কমান্ড লেখার মতো। কাজ একই, শুধু বলার ধরন আলাদা।' },
    { kind: 'note', textBn: 'টার্মিনালে আপনি ঠিক সেই ফাইল-ফোল্ডারই দেখেন, মডিউল ৪-এ যা শিখেছেন। আলাদা কোনো জগৎ নয়: টার্মিনালে বানানো ফোল্ডার File Explorer বা Finder-এও দেখা যায়, আর উল্টোটাও সত্যি।' },
    { kind: 'p', textBn: 'দুই কম্পিউটারে টার্মিনালের চেহারা একটু আলাদা। নিচের ছবিতে প্রতিটি অংশে ক্লিক করে দেখুন। বিশেষ করে মাঝের অংশটি, যেটি আপনাকে বলে দেয় আপনি এখন কোন ফোল্ডারে আছেন। ওপরের ফোল্ডার বোতামগুলো চেপে দেখুন প্রম্পট কীভাবে বদলায়।' },
    { kind: 'widget', widget: 'prompt-anatomy' },
    {
      kind: 'list',
      itemsBn: [
        'Windows: Start চেপে PowerShell লিখে খুলুন। প্রম্পট দেখতে PS C:\\Users\\Anika>-এর মতো। এখানে পুরো পথ দেখা যায়।',
        'Mac: Cmd+Space চেপে Terminal লিখে খুলুন। প্রম্পট দেখতে anika@Mac ~ %-এর মতো। এখানে শুধু ফোল্ডারের নাম দেখা যায় (~ মানে হোম ফোল্ডার)।',
        'Windows-এর পথে উল্টো দাঁড়ি (\\), Mac-এ সোজা দাঁড়ি (/)। মডিউল ৪-এর পথের নিয়ম এখানেও একই।',
        'PowerShell-এ বড়-ছোট হাতের অক্ষরে কমান্ডের তফাত হয় না (dir, DIR একই)। Mac-এ কমান্ড ছোট হাতের অক্ষরে লিখতে হয়: ls চলে, LS চলে না। ফাইলের নামও একই বানানে লেখাই ভালো অভ্যাস।',
      ],
    },
    { kind: 'p', textBn: 'নিচের কমান্ডগুলো আজ শিখবেন। প্রতিটি কমান্ডের পর একটি ফাঁকা জায়গা (স্পেস) দিয়ে নাম বা তথ্য (আর্গুমেন্ট) লিখতে হয়:' },
    {
      kind: 'list',
      itemsBn: [
        'কাজ → Windows PowerShell / Mac Terminal',
        'এখন কোথায় আছি → pwd (দুটোতেই)',
        'এখানে কী আছে → dir (বা ls) / ls',
        'ফোল্ডারে যাওয়া → cd Documents; ওপরে ফেরা → cd ..; হোমে ফেরা → cd ~',
        'ফোল্ডার বানানো → mkdir coding (দুটোতেই)',
        'খালি ফাইল বানানো → ni notes.txt / touch notes.txt',
        'ফাইলে লেখা → echo "hello" > hello.txt (দুটোতেই)',
        'ফাইল পড়া → type hello.txt (বা cat) / cat hello.txt',
        'পর্দা পরিষ্কার → cls (বা clear) / clear',
      ],
    },
    { kind: 'code', language: 'shell', code: 'PS C:\\Users\\Anika> cd Documents\nPS C:\\Users\\Anika\\Documents> pwd\n\nPath\n----\nC:\\Users\\Anika\\Documents' },
    { kind: 'code', language: 'shell', code: 'anika@Mac ~ % cd Documents\nanika@Mac Documents % pwd\n/Users/anika/Documents' },
    { kind: 'p', textBn: 'কয়েকটি সহজ কৌশল জানলে কাজ অনেক হালকা হয়। Tab: নামের প্রথম কয়েকটি অক্ষর লিখে Tab চাপলে বাকিটা নিজে লিখে দেয় (cd Doc + Tab = cd Documents)। ↑ (ওপরের তীর): আগের কমান্ড ফিরে আসে, তাই একই কমান্ড বারবার লিখতে হয় না। নামে স্পেস থাকলে নামটা উদ্ধৃতি চিহ্নের ভেতরে লিখুন: cd "My Photos"। নইলে কমান্ড ভাবে ওটা দুটি আলাদা নাম।' },
    { kind: 'p', textBn: 'ভুল হলে ভয় পাবেন না। টার্মিনাল রাগ করে না, শুধু একটা লেখা (এরর) দেখায় — যেমন নাম খুঁজে পায়নি। শান্তভাবে সেই লেখাটা পড়ুন; সাধারণত বানান ভুল বা ভুল ফোল্ডারে থাকাই কারণ। এরর পড়া নিয়ে আরও বিস্তারিত মডিউল ১৯-এ শিখবেন। এই অনুশীলন-টার্মিনালে বাংলায় ছোট ইঙ্গিতও পাবেন।' },
    { kind: 'code', language: 'shell', code: 'anika@Mac ~ % cd Documnts\ncd: no such file or directory: Documnts' },
    { kind: 'note', textBn: 'সাবধান! টার্মিনাল অনেক সময় “আপনি কি নিশ্চিত?” জিজ্ঞেস করে না, আর মুছে ফেললে Recycle Bin বা Trash-এও যায় না। যেমন rm -rf (Mac), del /s (Windows), format বা sudo (প্রশাসকের পূর্ণ ক্ষমতা) — এই ধরনের কমান্ডে সত্যিকারের ফাইল চিরতরে হারাতে পারে। তাই ইন্টারনেট, ভিডিও বা কারও পাঠানো কমান্ড না বুঝে কপি করে চালাবেন না। এটি মডিউল ৯-এর সতর্কতার সাথে মেলে: অচেনা জিনিস না বুঝে চালাতে নেই। এই অনুশীলন-টার্মিনালে এসব কমান্ড বন্ধ করা আছে।' },
  ],

  steps: [...steps('windows'), ...steps('mac')],

  freePractice: {
    titleBn: 'এবার নিজে নিজে চেষ্টা করুন',
    instructionBn: 'টার্মিনালে যা খুশি লিখে দেখুন, আসল কম্পিউটারের কিছুই বদলাবে না। ভুল কমান্ড লিখলে যে বার্তা আসে সেটিও মন দিয়ে পড়ুন। সব কমান্ডের তালিকা দেখতে help লিখুন।',
    checklistBn: [
      'cd দিয়ে অন্তত দুটি ফোল্ডারে গিয়েছি, আর cd .. দিয়ে ফিরে এসেছি',
      'নিজের পছন্দের নামে একটি ফোল্ডার বানিয়েছি (mkdir)',
      'ফাইলে echo দিয়ে নিজের লেখা ঢুকিয়েছি আর পড়ে দেখেছি',
      'Tab চেপে একটি নাম সম্পূর্ণ করেছি',
      'ইচ্ছে করে একটি ভুল বানান লিখে এরর বার্তা পড়েছি',
      'স্পেসওয়ালা নাম উদ্ধৃতি চিহ্নে লিখে দেখেছি, যেমন cd "Shopping List" বা cat "Shopping List.txt"',
    ],
  },

  quiz: [
    {
      id: 'q-prompt-win', osVariant: 'windows', type: 'clickTarget', questionBn: 'এই প্রম্পটে এখন কোন ফোল্ডারে আছেন সেটা কোন অংশ দেখাচ্ছে?   PS C:\\Users\\Anika\\Documents>',
      items: [
        { id: 'ps', labelBn: 'PS', icon: '🅿️' },
        { id: 'path', labelBn: 'C:\\Users\\Anika\\Documents', icon: '📁' },
        { id: 'gt', labelBn: '>', icon: '▶️' },
      ],
      correct: 'path',
      hintBn: 'ফোল্ডারের ঠিকানা (পথ) কোনটি, যেটি আগের মডিউলে শিখেছেন?',
      explanationBn: 'ঠিক! মাঝের পুরো পথটি দেখায় আপনি এখন কোথায় আছেন। cd দিয়ে ফোল্ডার বদলালে এটি বদলে যায়।',
    },
    {
      id: 'q-prompt-mac', osVariant: 'mac', type: 'clickTarget', questionBn: 'এই প্রম্পটে এখন কোন ফোল্ডারে আছেন সেটা কোন অংশ দেখাচ্ছে?   anika@Mac Documents %',
      items: [
        { id: 'user', labelBn: 'anika@Mac', icon: '👤' },
        { id: 'folder', labelBn: 'Documents', icon: '📁' },
        { id: 'pct', labelBn: '%', icon: '▶️' },
      ],
      correct: 'folder',
      hintBn: 'ফোল্ডারের নাম লেখা আছে কোন অংশে?',
      explanationBn: 'ঠিক! Mac-এ প্রম্পটে এখনকার ফোল্ডারের নাম দেখা যায়। হোম ফোল্ডারে থাকলে ~ দেখায়।',
    },
    {
      id: 'q-order', type: 'ordering', questionBn: 'টার্মিনালে হোম ফোল্ডারে coding নামে ফোল্ডার বানিয়ে তার ভেতরে একটি ফাইল বানানোর ধাপগুলো ঠিক ক্রমে সাজান।',
      items: [
        { id: '1', textBn: 'হোম ফোল্ডারে আছি কি না দেখে নিই (প্রম্পট বা pwd)' },
        { id: '2', textBn: 'mkdir coding লিখে Enter চাপি' },
        { id: '3', textBn: 'cd coding লিখে ফোল্ডারের ভেতরে ঢুকি' },
        { id: '4', textBn: 'ফাইল বানানোর কমান্ড লিখি, যেমন notes.txt নামে (touch বা ni)' },
      ],
      hintBn: 'ফোল্ডার না বানালে তাতে ঢোকা যায় না, আর ভেতরে না ঢুকলে ফাইল ওই ফোল্ডারে হবে না।',
      explanationBn: 'চমৎকার! আগে দেখা কোথায় আছি, তারপর ফোল্ডার বানানো, তাতে ঢোকা, শেষে ফাইল। ক্রমটি মনে রাখলে বাকি সব সহজ।',
    },
    {
      id: 'q-match-win', osVariant: 'windows', type: 'dragMatch', questionBn: 'কাজের সাথে Windows PowerShell-এর কমান্ড মিলিয়ে দিন।',
      pairs: [
        { id: 'folder', leftBn: 'নতুন ফোল্ডার বানানো', rightBn: 'mkdir coding' },
        { id: 'file', leftBn: 'নতুন খালি ফাইল বানানো', rightBn: 'ni notes.txt' },
        { id: 'read', leftBn: 'ফাইলের লেখা দেখা', rightBn: 'type notes.txt' },
        { id: 'clear', leftBn: 'পর্দা পরিষ্কার করা', rightBn: 'cls' },
      ],
      hintBn: 'ফোল্ডার বানানোর কমান্ডের নামেই “dir” আছে। type মানে এখানে লেখা দেখানো।',
      explanationBn: 'সবগুলো মিলেছে! মনে রাখবেন, Mac-এ এগুলোর নাম একটু আলাদা: touch, cat, clear।',
    },
    {
      id: 'q-match-mac', osVariant: 'mac', type: 'dragMatch', questionBn: 'কাজের সাথে Mac Terminal-এর কমান্ড মিলিয়ে দিন।',
      pairs: [
        { id: 'folder', leftBn: 'নতুন ফোল্ডার বানানো', rightBn: 'mkdir coding' },
        { id: 'file', leftBn: 'নতুন খালি ফাইল বানানো', rightBn: 'touch notes.txt' },
        { id: 'read', leftBn: 'ফাইলের লেখা দেখা', rightBn: 'cat notes.txt' },
        { id: 'clear', leftBn: 'পর্দা পরিষ্কার করা', rightBn: 'clear' },
      ],
      hintBn: 'ফোল্ডার বানানোর কমান্ডের নামেই “dir” আছে। touch মানে “ছুঁয়ে একটি ফাইল তৈরি করা”।',
      explanationBn: 'সবগুলো মিলেছে! Windows PowerShell-এ ফাইল বানাতে ni, পড়তে type, পর্দা পরিষ্কারে cls।',
    },
    {
      id: 'q-predict-win', osVariant: 'windows', type: 'predictOutput', language: 'shell',
      code: 'PS C:\\Users\\Anika> cd Documents\nPS C:\\Users\\Anika\\Documents> pwd',
      questionBn: 'pwd চালালে “Path” লেখার নিচের লাইনে কী ছাপা হবে? (পুরো পথটি লিখুন)',
      acceptedAnswers: ['C:\\Users\\Anika\\Documents'],
      ignoreCase: true,
      hintBn: 'হোমের পথের পরে \\ দিয়ে Documents বসান। C: থেকে শুরু করে পুরোটা লিখুন।',
      explanationBn: 'ঠিক! C:\\Users\\Anika\\Documents — মডিউল ৪-এ শেখা সম্পূর্ণ পথ।',
    },
    {
      id: 'q-predict-mac', osVariant: 'mac', type: 'predictOutput', language: 'shell',
      code: 'anika@Mac ~ % cd Documents\nanika@Mac Documents % pwd',
      questionBn: 'pwd চালালে কী ছাপা হবে? (পুরো পথটি লিখুন)',
      acceptedAnswers: ['/Users/anika/Documents'],
      hintBn: 'শুরু হয় সোজা দাঁড়ি (/) দিয়ে। হোম ফোল্ডার /Users/anika, তারপর /Documents।',
      explanationBn: 'ঠিক! /Users/anika/Documents — মডিউল ৪-এ শেখা সম্পূর্ণ পথ।',
    },
    {
      id: 'q-safety', type: 'multipleChoice', questionBn: 'একটি ওয়েবসাইটে লেখা আছে “কম্পিউটার দ্রুত করতে এই কমান্ডটি টার্মিনালে পেস্ট করুন: sudo rm -rf …”। আপনি কী করবেন?',
      options: [
        { id: 'a', textBn: 'কপি করে সাথে সাথে চালিয়ে দেব, ওয়েবসাইটে যখন লেখা আছে' },
        { id: 'b', textBn: 'চালাব না। কমান্ডের মানে না বুঝে চালানো বিপজ্জনক; আগে বুঝে নেব বা কাউকে জিজ্ঞেস করব' },
        { id: 'c', textBn: 'আগে Recycle Bin খালি করে তারপর চালাব' },
      ],
      correct: ['b'],
      hintBn: 'rm -rf আর sudo মিলে সব মুছে ফেলতে পারে, আর ফেরানোর সুযোগ থাকে না।',
      explanationBn: 'ঠিক! না বুঝে কপি-পেস্ট করা কমান্ডে বড় ক্ষতি হতে পারে। অচেনা লিংক বা বার্তায় সাবধান থাকার মডিউল ৯-এর শিক্ষা এখানেও খাটে।',
    },
  ],

  summaryCard: {
    titleBn: 'মনে রাখুন',
    pointsBn: [
      'টার্মিনাল হলো কম্পিউটারকে লিখে নির্দেশ দেওয়ার উপায়। ফাইল-ফোল্ডার একই, শুধু ক্লিকের বদলে টাইপ করা।',
      'প্রম্পটে এখনকার ফোল্ডার দেখা যায়। কোথায় আছি, না বুঝলে pwd।',
      'এখানে কী আছে: dir বা ls। ফোল্ডারে যাওয়া: cd নাম। ওপরে ফেরা: cd ..। হোমে: cd ~।',
      'বানানো: mkdir ফোল্ডার, ni ফাইল (Windows) বা touch ফাইল (Mac)। লেখা ঢোকানো: echo "লেখা" > ফাইল। পড়া: type (Windows) বা cat (Mac)।',
      'Tab দিয়ে নাম সম্পূর্ণ হয়, ↑ দিয়ে আগের কমান্ড ফেরে। ভুল হলে এরর শান্তভাবে পড়ুন।',
      'rm -rf, del /s, format, sudo-এর মতো কমান্ড Trash বা Recycle Bin ছাড়াই মুছে দেয়। না বুঝে কখনো কপি-পেস্ট করবেন না।',
    ],
  },

  realWorld: {
    titleBn: 'এবার আসল কম্পিউটারে চেষ্টা করুন। শুধু নিচের কমান্ডগুলো চালান, মোছার কোনো কমান্ড নয়।',
    tasksBn: [
      'pwd লিখে দেখুন আপনি কোন ফোল্ডারে আছেন। তারপর dir (Windows) বা ls (Mac) লিখে তালিকা দেখুন, আর File Explorer / Finder-এর সাথে মিলিয়ে নিন।',
      'cd Documents লিখে ঢুকুন, pwd দিয়ে পথ দেখুন, তারপর cd .. লিখে ফিরে আসুন।',
      'echo "hello" > hello.txt লিখে একটি ফাইল বানান, আর type hello.txt (Windows) বা cat hello.txt (Mac) দিয়ে পড়ুন। শুধু নিজের তৈরি ফাইলেই কাজ করুন।',
    ],
    windowsTasksBn: ['Start বোতাম চেপে PowerShell লিখে অ্যাপটি খুলুন। কাজ শেষে ওপরের ✕ চেপে বন্ধ করুন।'],
    macTasksBn: ['Cmd+Space চেপে Terminal লিখে Enter চাপুন। কাজ শেষে Cmd+Q চেপে বন্ধ করুন।'],
  },

  teacherTipBn:
    'টার্মিনাল অনেকের কাছে ভয়ের জিনিস; তাই প্রথমে বলুন, “এটি File Explorer/Finder-এর মতোই ফোল্ডার ঘোরা, শুধু টাইপ করে।” প্রম্পটের ফোল্ডার-অংশটি বারবার দেখাতে বলুন, আর প্রতিটি cd-র পরে pwd বা dir দিয়ে মিলিয়ে নিতে বলুন। ওঁর টাইপে ভুল হলে নিজে ঠিক করে দেবেন না, এরর বার্তাটি একসাথে পড়ুন। আসল কম্পিউটারে শুধু পড়ার আর নিজের বানানো ফাইলের কমান্ড অনুমতি দিন। rm, del, format, sudo নিয়ে আলাদা করে কথা বলুন, আর অনলাইন থেকে পাওয়া কমান্ড না বুঝে না চালানোর নিয়মটি পরিষ্কার করে দিন।',
}

export default lesson
