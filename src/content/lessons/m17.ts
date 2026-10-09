import type { ExpectedAction, Lesson, OsFlavor, Step } from '../../engine/types'
import type { SimSetup } from '../../engine/types'

/**
 * Module 17 — the first terminal lesson, in the cards format. Three units:
 *  (1) আমি কোথায়? — prompt, pwd, ls/dir, cd Documents, cd ..
 *  (2) ফোল্ডার ও ফাইল বানানো — mkdir, Tab, touch/ni, echo >, cat/type, clear
 *  (3) নিরাপদ থাকা — ↑ history, the blocked rm/del, the Files app link
 * Step targets / expected actions are the same as the old guided practice; only the words changed.
 * Each unit starts a fresh simulation: units 1 and 2 begin in the home folder, unit 3 gets ~/coding/notes.txt ("hello").
 */

const TI = 'terminal-input'

/** Every accepted way to type "cd <name>" (also the form Tab-completion leaves behind). */
function cdForms(name: string, os: OsFlavor): string[] {
  const base = [`cd ${name}`, `cd ${name}/`, `cd ./${name}`]
  return os === 'windows'
    ? [...base, `cd ${name}\\`, `cd .\\${name}`, `cd ${name.toLowerCase()}`, `cd ${name.toLowerCase()}\\`, `Set-Location ${name}`, `sl ${name}`]
    : base
}

type Maker = (id: string, titleBn: string, explanationBn: string, expectedAction: ExpectedAction, hintBn: string, successMessageBn?: string, target?: string) => Step

function maker(os: OsFlavor): Maker {
  const p = os === 'windows' ? 'w' : 'm'
  return (id, titleBn, explanationBn, expectedAction, hintBn, successMessageBn, target = TI) => ({
    id: `${p}-${id}`, titleBn, explanationBn, target, expectedAction, hintBn, successMessageBn, osVariant: os,
  })
}

// ---------- unit 1: আমি কোথায়? ----------
function steps1(os: OsFlavor): Step[] {
  const win = os === 'windows'
  const t = maker(os)
  return [
    t('pwd', 'আমি এখন কোথায়?', 'লেখার ঘরে **pwd** লিখে Enter চাপুন।',
      { type: 'typeCommand', command: win ? ['pwd', 'gl', 'Get-Location'] : ['pwd'] },
      'ছোট হাতের অক্ষরে p, w, d লিখে Enter চাপুন।', 'এখনকার ঠিকানা এসেছে!'),
    t('ls', 'এখানে কী কী আছে?', win ? '**dir** লিখে Enter চাপুন। তালিকা আসবে।' : '**ls** লিখে Enter চাপুন। তালিকা আসবে।',
      { type: 'typeCommand', command: win ? ['dir', 'ls', 'gci', 'Get-ChildItem'] : ['ls'], match: 'prefix' },
      win ? 'd, i, r লিখে Enter চাপুন।' : 'l আর s লিখে Enter চাপুন।', 'তালিকা এসেছে!'),
    t('cd-docs', 'অন্য ফোল্ডারে যান', '**cd Documents** লিখে Enter চাপুন।',
      { type: 'typeCommand', command: cdForms('Documents', os) },
      'cd, একটি স্পেস, তারপর Documents। D বড় হাতের অক্ষরে।', 'ঢুকে পড়েছেন!'),
    t('pwd2', 'প্রম্পট আর pwd মেলান', 'প্রম্পট বদলেছে। আবার **pwd** লিখে Enter চাপুন।',
      { type: 'typeCommand', command: ['pwd', 'gl', 'Get-Location'] },
      'আগের মতোই pwd লিখে Enter চাপুন।', 'পথ মিলেছে!'),
    t('cd-up', 'এক ধাপ ওপরে', '**cd ..** লিখে Enter চাপুন।',
      { type: 'typeCommand', command: ['cd ..', 'cd ../', 'cd ..\\', 'cd ~', 'cd'] },
      'cd, স্পেস, তারপর পরপর দুটি বিন্দু।', 'ফিরে এসেছেন!'),
  ]
}

// ---------- unit 2: ফোল্ডার ও ফাইল বানানো ----------
function steps2(os: OsFlavor): Step[] {
  const win = os === 'windows'
  const t = maker(os)
  return [
    t('mkdir', 'নতুন ফোল্ডার বানান', '**mkdir coding** লিখে Enter চাপুন।',
      { type: 'fileExists', path: '~/coding', kind: 'folder' },
      'mkdir, একটি স্পেস, তারপর coding।', 'ফোল্ডার তৈরি!'),
    t('cd-coding', 'ট্যাব দিয়ে ঢুকুন', '**cd cod** লিখে **Tab** চাপুন, তারপর Enter।',
      { type: 'typeCommand', command: cdForms('coding', os) },
      'নাম নিজে পূর্ণ না হলে পুরো cd coding লিখুন।', 'ট্যাব জাদু করেছে!'),
    win
      ? t('file', 'খালি ফাইল বানান', '**ni notes.txt** লিখে Enter চাপুন।',
          { type: 'fileExists', path: '~/coding/notes.txt', kind: 'file' },
          'ni, স্পেস, notes.txt। বিন্দুও লিখবেন।', 'ফাইল তৈরি!')
      : t('file', 'খালি ফাইল বানান', '**touch notes.txt** লিখে Enter চাপুন।',
          { type: 'fileExists', path: '~/coding/notes.txt', kind: 'file' },
          'touch, স্পেস, notes.txt। বিন্দুও লিখবেন।', 'ফাইল তৈরি!'),
    t('echo', 'ফাইলে লেখা ঢোকান', '**echo "hello" > notes.txt** লিখে Enter চাপুন।',
      { type: 'fileContains', path: '~/coding/notes.txt', text: 'hello' },
      'উদ্ধৃতি-চিহ্নসহ। > পাবেন Shift ধরে কমা-র পাশের বিন্দু বোতামে।', 'লেখা ঢুকেছে!'),
    t('cat', 'ফাইলের লেখা পড়ুন', win ? '**type notes.txt** লিখে Enter চাপুন।' : '**cat notes.txt** লিখে Enter চাপুন।',
      { type: 'typeCommand', command: win ? ['type notes.txt', 'cat notes.txt', 'gc notes.txt', 'Get-Content notes.txt'] : ['cat notes.txt'] },
      win ? 'type, স্পেস, notes.txt।' : 'cat, স্পেস, notes.txt।', 'hello দেখা গেছে!'),
    t('clear', 'পর্দা পরিষ্কার', win ? '**cls** লিখে Enter চাপুন। কিছু মুছবে না।' : '**clear** লিখে Enter চাপুন। কিছু মুছবে না।',
      { type: 'typeCommand', command: win ? ['cls', 'clear', 'Clear-Host'] : ['clear'] },
      win ? 'c, l, s লিখে Enter।' : 'c, l, e, a, r লিখে Enter।', 'পর্দা ঝকঝকে!'),
  ]
}

// ---------- unit 3: নিরাপদ থাকা ----------
function steps3(os: OsFlavor): Step[] {
  const win = os === 'windows'
  const p = win ? 'w' : 'm'
  const t = maker(os)
  return [
    t('cd-coding-2', 'coding ফোল্ডারে ঢুকুন', '**cd coding** লিখে Enter চাপুন।',
      { type: 'typeCommand', command: cdForms('coding', os) },
      'cd, স্পেস, তারপর coding। Tab-ও চাপতে পারেন।', 'ঢুকেছেন!'),
    t('cat-2', 'ফাইলটি পড়ুন', win ? '**type notes.txt** লিখে Enter চাপুন।' : '**cat notes.txt** লিখে Enter চাপুন।',
      { type: 'typeCommand', command: win ? ['type notes.txt', 'cat notes.txt', 'gc notes.txt', 'Get-Content notes.txt'] : ['cat notes.txt'] },
      win ? 'type, স্পেস, notes.txt।' : 'cat, স্পেস, notes.txt।', 'hello এসেছে!'),
    {
      id: `${p}-history`, titleBn: 'আগের কমান্ড ফিরিয়ে আনুন',
      explanationBn: 'ঘর খালি রেখে কিবোর্ডের **↑** চাপুন। তারপর “বুঝেছি” চাপুন।',
      target: TI, expectedAction: { type: 'continue' },
      hintBn: 'ঘরে একবার ক্লিক করে ↑ চাপুন। ভুল হলে Ctrl+C চাপুন।',
      osVariant: os,
    },
    t('rm', 'মোছার কমান্ড — নিরাপদে', win ? '**del notes.txt** লিখে Enter চাপুন। বার্তাটি পড়ুন।' : '**rm notes.txt** লিখে Enter চাপুন। বার্তাটি পড়ুন।',
      { type: 'typeCommand', command: win ? ['del', 'rm', 'erase', 'Remove-Item', 'ri'] : ['rm'], match: 'prefix' },
      win ? 'del, স্পেস, notes.txt। কিছুই মুছবে না।' : 'rm, স্পেস, notes.txt। কিছুই মুছবে না।', 'অনুশীলনে সব নিরাপদ!'),
    win
      ? t('open-files', 'ক্লিক করে একই ফোল্ডার দেখুন', 'টাস্কবারের হলুদ ফোল্ডার আইকনে (File Explorer) ক্লিক করুন।',
          { type: 'openApp', app: 'files' }, 'টাস্কবারের নিচের সারিতে হলুদ ফোল্ডারের মতো আইকন।', 'File Explorer খুলেছে!', 'taskbar-app-files')
      : t('open-files', 'ক্লিক করে একই ফোল্ডার দেখুন', 'ডকের একদম বাঁ দিকের Finder আইকনে ক্লিক করুন।',
          { type: 'openApp', app: 'files' }, 'ডকের প্রথম আইকন — নীল-সাদা মুখের মতো।', 'Finder খুলেছে!', 'dock-files'),
    {
      id: `${p}-see-folder`, titleBn: 'coding ফোল্ডারটি খুঁজুন',
      explanationBn: `${win ? 'File Explorer' : 'Finder'}-এ হোম খুলে coding ফোল্ডারটি দেখুন। দেখা হলে “বুঝেছি” চাপুন।`,
      expectedAction: { type: 'continue' },
      hintBn: 'বাঁ পাশের তালিকা থেকে হোম ফোল্ডারটি বেছে নিন।',
      osVariant: os,
    },
  ]
}

/** unit 3 starts with the folder and file the learner made in unit 2 */
const unit3Setup: SimSetup = {
  openApps: ['terminal'],
  vfs: (vfs) => {
    const existing = vfs.resolve('~/coding')
    const dir = existing && existing.kind === 'folder' ? existing : vfs.mkdir(vfs.home, 'coding')
    if (!vfs.resolve('~/coding/notes.txt')) vfs.createFile(dir, 'notes.txt', 'hello\n')
  },
}

const lesson: Lesson = {
  module: 17,
  part: 2,
  id: 'm17',
  titleBn: 'টার্মিনালের প্রথম পাঠ',
  oneLineBn: 'টার্মিনালে লিখে ফোল্ডার ঘোরা, ফোল্ডার-ফাইল বানানো — আর বিপজ্জনক কমান্ড চেনা।',
  minutes: 9,
  glossaryIds: [
    'term-terminal', 'term-command-line', 'term-shell', 'term-powershell', 'term-zsh', 'term-command', 'term-argument', 'term-prompt',
    'term-current-directory', 'term-pwd', 'term-ls', 'term-cd', 'term-mkdir', 'term-touch', 'term-cat', 'term-echo', 'term-clear',
    'term-tab-completion', 'term-history', 'term-redirect', 'term-dangerous-command',
  ],

  units: [
    // =====================================================================================================
    {
      id: 'where-am-i',
      titleBn: 'আমি কোথায়?',
      hook: {
        id: 'h-terminal',
        type: 'hook',
        textBn: 'ক্লিক নয়, **লিখে** কম্পিউটারকে বলা — এই কালো উইন্ডোর নাম টার্মিনাল!',
        visual: { kind: 'art', name: 'terminal', captionBn: 'কম্পিউটারের সাথে লিখে কথা' },
      },
      cards: [
        {
          id: 'c-prompt-win',
          type: 'visual',
          osVariant: 'windows',
          textBn: 'প্রতিটি লাইনের শুরুর অংশের নাম **প্রম্পট**। এতে লেখা থাকে আপনি এখন কোন ফোল্ডারে।',
          visual: { kind: 'mock', name: 'terminal-win', os: 'windows', highlight: 'prompt' },
          chipsBn: ['PS = PowerShell', 'পথ = ফোল্ডার'],
          learnMoreBn: 'Windows-এ Start চেপে PowerShell লিখে টার্মিনাল খোলে। প্রম্পট দেখতে PS C:\\Users\\Anika>-এর মতো; পুরো পথ দেখা যায়, পথে উল্টো দাঁড়ি (\\)। কমান্ডের বড়-ছোট হাতের অক্ষরে তফাত হয় না। কমান্ড লিখে Enter চাপলে উত্তর (আউটপুট) আসে প্রম্পটের ওপরে। ভুল হলে শুধু ছোট একটা লেখা (এরর) আসে — শান্তভাবে পড়ুন।',
        },
        {
          id: 'c-prompt-mac',
          type: 'visual',
          osVariant: 'mac',
          textBn: 'প্রতিটি লাইনের শুরুর অংশের নাম **প্রম্পট**। এতে লেখা থাকে আপনি এখন কোন ফোল্ডারে।',
          visual: { kind: 'mock', name: 'terminal-mac', os: 'mac', highlight: 'prompt' },
          chipsBn: ['~ = হোম ফোল্ডার', '% এর পরে লিখুন'],
          learnMoreBn: 'Mac-এ Cmd+Space চেপে Terminal লিখে খোলে। প্রম্পট দেখতে anika@Mac ~ %-এর মতো; শুধু ফোল্ডারের নাম দেখা যায় (~ মানে হোম)। পথে সোজা দাঁড়ি (/)। কমান্ড ছোট হাতের অক্ষরে লিখতে হয়: ls চলে, LS চলে না। কমান্ড লিখে Return চাপলে উত্তর (আউটপুট) আসে প্রম্পটের ওপরে। ভুল হলে শুধু ছোট একটা লেখা (এরর) আসে — শান্তভাবে পড়ুন।',
        },
        {
          id: 'c-widget-prompt',
          type: 'visual',
          textBn: 'পারেন? প্রম্পটের কোন অংশ ফোল্ডার দেখায়, ছুঁয়ে খুঁজে বের করুন।',
          visual: { kind: 'widget', widget: 'prompt-anatomy' },
        },
        {
          id: 'c-ls-compare',
          type: 'compare',
          textBn: 'তালিকা দেখার কমান্ড দুই কম্পিউটারে আলাদা: **dir** আর **ls**। কাজ একই।',
          visual: {
            kind: 'compare',
            left: { visual: { kind: 'mock', name: 'terminal-win', os: 'windows', highlight: 'output' }, labelBn: 'Windows', captionBn: 'dir (ls-ও চলে)' },
            right: { visual: { kind: 'mock', name: 'terminal-mac', os: 'mac', highlight: 'output' }, labelBn: 'Mac', captionBn: 'ls' },
            vs: 'বনাম',
          },
          learnMoreBn: 'pwd দুই কম্পিউটারেই চলে। ফোল্ডারের নামে স্পেস থাকলে উদ্ধৃতি চিহ্নে লিখুন: cd "My Photos"।',
        },
        {
          id: 'c-cd-code',
          type: 'code',
          textBn: 'ঘোরার তিন উপায়। **cd** মানে “ফোল্ডার বদলাও”, মডিউল ৪-এর পথের মতোই।',
          visual: {
            kind: 'code',
            lang: 'shell',
            lines: [
              { code: 'cd Documents', noteBn: 'Documents-এ ঢুকি' },
              { code: 'cd ..', noteBn: 'এক ধাপ ওপরে' },
              { code: 'cd ~', noteBn: 'সোজা হোমে' },
            ],
          },
          learnMoreBn: 'pwd যে পথ দেখায় (C:\\Users\\Anika\\Documents বা /Users/anika/Documents), সেটি মডিউল ৪-এ শেখা সম্পূর্ণ পথ। টার্মিনাল আর File Explorer/Finder একই ফোল্ডার দেখে।',
        },
      ],
      steps: [...steps1('windows'), ...steps1('mac')],
      setup: { openApps: ['terminal'] },
      quiz: [
        {
          id: 'q-pwd',
          type: 'multipleChoice',
          questionBn: '**pwd** লিখলে টার্মিনাল কী জানায়?',
          options: [
            { id: 'a', textBn: 'এখন কোন ফোল্ডারে আছি' },
            { id: 'b', textBn: 'কম্পিউটারের পাসওয়ার্ড' },
            { id: 'c', textBn: 'ইন্টারনেটের স্পিড' },
          ],
          correct: ['a'],
          hintBn: 'pwd = প্রিন্ট ওয়ার্কিং ডিরেক্টরি, মানে এখনকার ঠিকানা।',
          explanationBn: 'ঠিক! pwd এখনকার ফোল্ডারের পুরো পথ দেখায়।',
        },
        {
          id: 'q-cd-up',
          type: 'multipleChoice',
          questionBn: '**cd ..** লিখলে কী হয়?',
          options: [
            { id: 'a', textBn: 'এক ধাপ ওপরের ফোল্ডারে যাই' },
            { id: 'b', textBn: 'ফোল্ডার মুছে যায়' },
            { id: 'c', textBn: 'টার্মিনাল বন্ধ হয়' },
          ],
          correct: ['a'],
          hintBn: 'দুটি বিন্দুর মানে “ওপরের ফোল্ডার”।',
          explanationBn: 'ঠিক! .. মানে ওপরের (পেরেন্ট) ফোল্ডার।',
        },
        {
          id: 'q-match-nav',
          type: 'dragMatch',
          questionBn: 'কমান্ডের সাথে কাজ মিলিয়ে দিন।',
          pairs: [
            { id: 'pwd', leftBn: 'কোথায় আছি দেখা', rightBn: 'pwd' },
            { id: 'ls', leftBn: 'এখানে কী আছে দেখা', rightBn: 'ls / dir' },
            { id: 'cd', leftBn: 'অন্য ফোল্ডারে যাওয়া', rightBn: 'cd Documents' },
            { id: 'up', leftBn: 'ওপরে ফেরা', rightBn: 'cd ..' },
          ],
          hintBn: 'cd = change directory, মানে ফোল্ডার বদলানো।',
          explanationBn: 'সব মিলেছে! এই চারটি দিয়েই টার্মিনালে ঘোরা যায়।',
        },
      ],
      recapBn: ['pwd = আমি কোথায়', 'ls / dir = কী আছে', 'cd = যাওয়া, cd .. = ফেরা'],
      freeTryBn: 'cd Pictures লিখে ঢুকুন, তারপর cd .. দিয়ে ফিরুন।',
    },

    // =====================================================================================================
    {
      id: 'make-things',
      titleBn: 'ফোল্ডার ও ফাইল বানানো',
      hook: {
        id: 'h-make',
        type: 'hook',
        textBn: 'ডান ক্লিক ছাড়াই ফোল্ডার-ফাইল বানানো যায় — শুধু একটা লাইনে!',
        visual: { kind: 'art', name: 'folder-open', captionBn: 'mkdir coding' },
      },
      cards: [
        {
          id: 'c-mkdir',
          type: 'code',
          textBn: '**mkdir** নতুন ফোল্ডার বানায়, **cd** তাতে ঢোকায়। নামে স্পেস না দেওয়াই ভালো।',
          visual: {
            kind: 'code',
            lang: 'shell',
            lines: [
              { code: 'mkdir coding', noteBn: 'ফোল্ডার বানাও' },
              { code: 'cd coding', noteBn: 'ভেতরে ঢোকো' },
            ],
          },
        },
        {
          id: 'c-tab',
          type: 'visual',
          textBn: 'নামের প্রথম কটা অক্ষর লিখে **Tab** চাপুন — বাকিটা টার্মিনাল নিজে লিখে দেয়।',
          visual: { kind: 'demo', gesture: 'keys', keys: 'Tab', captionBn: 'cd cod + Tab = cd coding' },
          learnMoreBn: 'Tab চাপলে নাম পূর্ণ হয়, বানান ভুলও কমে। কিবোর্ডের বাঁ দিকে, Caps Lock-এর ওপরে। একাধিক নাম মিললে আরও কয়েকটি অক্ষর লিখে আবার Tab চাপুন।',
        },
        {
          id: 'c-cmd-compare',
          type: 'compare',
          textBn: 'ফাইলের কাজে নাম আলাদা — Windows-এ **ni · type · cls**, Mac-এ **touch · cat · clear**।',
          visual: {
            kind: 'compare',
            left: { visual: { kind: 'mock', name: 'terminal-win', os: 'windows', highlight: 'prompt' }, labelBn: 'Windows', captionBn: 'ni · type · cls' },
            right: { visual: { kind: 'mock', name: 'terminal-mac', os: 'mac', highlight: 'prompt' }, labelBn: 'Mac', captionBn: 'touch · cat · clear' },
            vs: 'বনাম',
          },
          learnMoreBn: 'ni হলো PowerShell-এর New-Item, মানে “নতুন কিছু বানাও”। PowerShell-এ cat আর clear-ও চলে। Mac-এ ni বা type চলে না। mkdir আর echo দুই কম্পিউটারেই একই।',
        },
        {
          id: 'c-echo',
          type: 'code',
          textBn: '**echo** লেখা দেখায়। শেষে **>** দিলে লেখা পর্দার বদলে ফাইলে চলে যায়।',
          visual: {
            kind: 'code',
            lang: 'shell',
            lines: [
              { code: 'echo "hello" > notes.txt', noteBn: 'hello ঢোকাও ফাইলে' },
              { code: 'cat notes.txt', noteBn: 'ফাইল পড়ো (Windows: type)' },
            ],
            output: ['hello'],
          },
          learnMoreBn: '> চিহ্নটি পাবেন Shift ধরে কমা-র (,) পাশের বিন্দু (.) বোতামে। > একই ফাইলে আবার লিখলে আগের লেখা বদলে যায়।',
        },
      ],
      steps: [...steps2('windows'), ...steps2('mac')],
      setup: { openApps: ['terminal'] },
      quiz: [
        {
          id: 'q-order',
          type: 'ordering',
          questionBn: 'coding ফোল্ডার বানিয়ে ভেতরে ফাইল বানানোর ধাপগুলো সাজান।',
          items: [
            { id: '1', textBn: 'হোমে আছি কি না দেখি' },
            { id: '2', textBn: 'mkdir coding লিখি' },
            { id: '3', textBn: 'cd coding লিখে ঢুকি' },
            { id: '4', textBn: 'ফাইল বানানোর কমান্ড লিখি' },
          ],
          hintBn: 'ফোল্ডার না বানালে ঢোকা যায় না, না ঢুকলে ফাইল ভুল জায়গায় হয়।',
          explanationBn: 'চমৎকার! দেখা, বানানো, ঢোকা, তারপর ফাইল।',
        },
        {
          id: 'q-match-make',
          type: 'dragMatch',
          questionBn: 'কমান্ডের সাথে কাজ মিলিয়ে দিন।',
          pairs: [
            { id: 'mk', leftBn: 'নতুন ফোল্ডার', rightBn: 'mkdir coding' },
            { id: 'echo', leftBn: 'ফাইলে লেখা ঢোকানো', rightBn: 'echo "hi" > a.txt' },
            { id: 'tab', leftBn: 'নাম নিজে পূর্ণ করা', rightBn: 'Tab চাপা' },
            { id: 'clr', leftBn: 'পর্দা পরিষ্কার', rightBn: 'clear / cls' },
          ],
          hintBn: '> চিহ্ন লেখাকে ফাইলে পাঠায়।',
          explanationBn: 'সব মিলেছে! সময় বাঁচাতে Tab ভুলবেন না।',
        },
        {
          id: 'q-new-file',
          type: 'multipleChoice',
          questionBn: 'কোন কমান্ড নতুন খালি ফাইল বানায়?',
          options: [
            { id: 'a', textBn: 'touch (Mac) বা ni (Windows)' },
            { id: 'b', textBn: 'clear বা cls' },
            { id: 'c', textBn: 'pwd' },
          ],
          correct: ['a'],
          hintBn: 'ni = New-Item, মানে নতুন কিছু।',
          explanationBn: 'ঠিক! touch আর ni দুটোই খালি ফাইল বানায়।',
        },
      ],
      recapBn: ['mkdir = ফোল্ডার, touch/ni = ফাইল', 'echo "লেখা" > ফাইল', 'Tab = নাম নিজে পূর্ণ'],
      freeTryBn: 'নিজের পছন্দের নামে আরেকটা ফোল্ডার বানান।',
    },

    // =====================================================================================================
    {
      id: 'stay-safe',
      titleBn: 'নিরাপদ থাকা',
      hook: {
        id: 'h-safe',
        type: 'hook',
        textBn: 'টার্মিনালে মোছা ফাইল ঝুড়িতে যায় না — তাই **আগে বুঝি**, তারপর চালাই।',
        visual: { kind: 'art', name: 'shield', captionBn: 'আগে বুঝি, তারপর চালাই' },
      },
      cards: [
        {
          id: 'c-history',
          type: 'visual',
          textBn: 'একই কমান্ড আবার লিখবেন? কিবোর্ডের **↑** চাপুন, আগের কমান্ড ফিরে আসবে।',
          visual: { kind: 'demo', gesture: 'keys', keys: '↑', captionBn: 'আগের কমান্ড ফেরত' },
          learnMoreBn: 'আবার ↑ চাপলে তারও আগেরটি আসে। Enter চাপলে কমান্ডটি আবার চলে। ভুল কিছু এলে Ctrl+C চাপলে লাইনটি বাতিল হয়ে যায়।',
        },
        {
          id: 'c-danger',
          type: 'visual',
          textBn: '**rm** (Mac) আর **del** (Windows) ফাইল মোছে — Trash বা Recycle Bin-এ না গিয়ে!',
          visual: { kind: 'art', name: 'warning', captionBn: 'rm · del · format · sudo' },
          chipsBn: ['ফেরানো কঠিন', 'না বুঝে নয়'],
          learnMoreBn: 'rm -rf (Mac), del /s (Windows), format বা sudo-এর মতো কমান্ডে সত্যিকারের ফাইল চিরতরে হারাতে পারে। ইন্টারনেট বা কারও পাঠানো কমান্ড না বুঝে কপি-পেস্ট করবেন না। এটি মডিউল ৯-এর শিক্ষার সাথে মেলে: অচেনা জিনিস না বুঝে চালাতে নেই।',
        },
        {
          id: 'c-sandbox',
          type: 'visual',
          textBn: 'এই অনুশীলন-টার্মিনালে এসব কমান্ড **বন্ধ** করা আছে। চালালে শান্ত একটা বার্তা পাবেন।',
          visual: { kind: 'art', name: 'lock', captionBn: 'এখানে কিছুই মুছবে না' },
        },
        {
          id: 'c-same-folder',
          type: 'compare',
          textBn: 'টার্মিনালে বানানো ফোল্ডার ক্লিক করেও দেখা যায় — **একই** ফোল্ডার, দুই পথ।',
          visual: {
            kind: 'compare',
            left: { visual: { kind: 'art', name: 'terminal' }, labelBn: 'টার্মিনাল', captionBn: 'লিখে দেখা' },
            right: { visual: { kind: 'art', name: 'folder-open' }, labelBn: 'File Explorer / Finder', captionBn: 'ক্লিক করে দেখা' },
            vs: 'আর',
          },
          learnMoreBn: 'pwd যে পথ দেখায়, মডিউল ৪-এ শেখা সেই পথই File Explorer বা Finder-এর ঠিকানা বারে থাকে। উল্টোটাও সত্যি: ক্লিক করে বানানো ফোল্ডার টার্মিনালেও দেখা যায়।',
        },
      ],
      steps: [...steps3('windows'), ...steps3('mac')],
      setup: unit3Setup,
      quiz: [
        {
          id: 'q-history',
          type: 'multipleChoice',
          questionBn: 'আগের লেখা কমান্ড ফিরিয়ে আনতে কোন বোতাম চাপবেন?',
          options: [
            { id: 'a', textBn: '↑ (ওপরের তীর)' },
            { id: 'b', textBn: 'Caps Lock' },
            { id: 'c', textBn: 'Esc দুবার' },
          ],
          correct: ['a'],
          hintBn: 'তীরচিহ্নের বোতামগুলোর একটি।',
          explanationBn: 'ঠিক! ↑ চাপলে আগের কমান্ড ফিরে আসে।',
        },
        {
          id: 'q-safety',
          type: 'multipleChoice',
          questionBn: 'ওয়েবসাইটে লেখা: “দ্রুত করতে এটি টার্মিনালে পেস্ট করুন: sudo rm -rf …”। কী করবেন?',
          options: [
            { id: 'a', textBn: 'কপি করে সাথে সাথে চালাব' },
            { id: 'b', textBn: 'চালাব না; আগে বুঝব বা কাউকে জিজ্ঞেস করব' },
            { id: 'c', textBn: 'আগে Recycle Bin খালি করব' },
          ],
          correct: ['b'],
          hintBn: 'rm -rf আর sudo মিলে সব মুছে দিতে পারে।',
          explanationBn: 'ঠিক! না বুঝে চালানো কমান্ডে বড় ক্ষতি হতে পারে।',
        },
        {
          id: 'q-same',
          type: 'multipleChoice',
          questionBn: 'টার্মিনালে বানানো coding ফোল্ডার কি File Explorer বা Finder-এ দেখা যাবে?',
          options: [
            { id: 'a', textBn: 'হ্যাঁ, ওটা একই ফোল্ডার' },
            { id: 'b', textBn: 'না, টার্মিনালের ফোল্ডার আলাদা' },
            { id: 'c', textBn: 'শুধু রাতে দেখা যায়' },
          ],
          correct: ['a'],
          hintBn: 'ফাইল-ফোল্ডার একটাই, দেখার পথ দুটি।',
          explanationBn: 'ঠিক! একই ফোল্ডার, শুধু দেখার পথ আলাদা।',
        },
      ],
      recapBn: ['↑ = আগের কমান্ড', 'rm / del = চিরতরে মোছা', 'টার্মিনাল আর Files একই ফোল্ডার'],
      freeTryBn: 'help লিখে অনুশীলন-টার্মিনালের কমান্ডের তালিকা দেখুন।',
    },
  ],

  realWorld: {
    titleBn: 'আসল কম্পিউটারে শুধু নিচের নিরাপদ কমান্ডগুলো চালান।',
    tasksBn: [
      'pwd লিখে দেখুন কোন ফোল্ডারে আছেন, তারপর dir (Windows) বা ls (Mac) লিখুন।',
      'cd Documents দিয়ে ঢুকে pwd দেখুন, তারপর cd .. দিয়ে ফিরুন।',
      'echo "hello" > hello.txt লিখে ফাইল বানান; type (Windows) বা cat (Mac) দিয়ে পড়ুন।',
    ],
    windowsTasksBn: ['Start চেপে PowerShell লিখে খুলুন। শেষে ✕ চেপে বন্ধ করুন।'],
    macTasksBn: ['Cmd+Space চেপে Terminal লিখে খুলুন। শেষে Cmd+Q চাপুন।'],
  },

  teacherTipBn:
    'টার্মিনাল অনেকের কাছে ভয়ের জিনিস; তাই প্রথমে বলুন, “এটি File Explorer/Finder-এর মতোই ফোল্ডার ঘোরা, শুধু টাইপ করে।” প্রম্পটের ফোল্ডার-অংশটি বারবার দেখাতে বলুন, আর প্রতিটি cd-র পরে pwd বা dir দিয়ে মিলিয়ে নিতে বলুন। শিক্ষার্থীর টাইপে ভুল হলে নিজে ঠিক করে দেবেন না, এরর বার্তাটি একসাথে পড়ুন। আসল কম্পিউটারে শুধু পড়ার আর নিজের বানানো ফাইলের কমান্ড অনুমতি দিন। rm, del, format, sudo নিয়ে আলাদা করে কথা বলুন, আর অনলাইন থেকে পাওয়া কমান্ড না বুঝে না চালানোর নিয়মটি পরিষ্কার করে দিন।',
}

export default lesson
