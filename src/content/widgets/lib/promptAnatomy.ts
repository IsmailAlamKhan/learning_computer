/** Pure data for the prompt-anatomy widget (parts of a terminal prompt on Windows PowerShell and the Mac Terminal). */
export type PromptOs = 'windows' | 'mac'
export type PromptFolder = 'home' | 'Documents' | 'coding'
export type PromptPartId = 'shell' | 'folder' | 'symbol'

export interface PromptPart {
  id: PromptPartId
  text: string
  titleBn: string
  descBn: string
}

export const PROMPT_FOLDERS: PromptFolder[] = ['home', 'Documents', 'coding']

export function folderPath(os: PromptOs, folder: PromptFolder): string {
  if (os === 'windows') return folder === 'home' ? 'C:\\Users\\Anika' : `C:\\Users\\Anika\\${folder}`
  return folder === 'home' ? '/Users/anika' : `/Users/anika/${folder}`
}

/** The prompt split into clickable parts, exactly as the practice terminal prints it. */
export function promptParts(os: PromptOs, folder: PromptFolder): PromptPart[] {
  if (os === 'windows') {
    return [
      { id: 'shell', text: 'PS', titleBn: 'PS — PowerShell চলছে', descBn: 'PS মানে PowerShell। এটি Windows-এর টার্মিনালের প্রোগ্রাম (শেল)। দেখলেই বুঝবেন, কমান্ড নেওয়ার জন্য প্রস্তুত।' },
      { id: 'folder', text: folderPath(os, folder), titleBn: `${folderPath(os, folder)} — এখনকার ফোল্ডার`, descBn: 'আপনি এই মুহূর্তে কোন ফোল্ডারে আছেন, তার পুরো পথ (Path)। cd দিয়ে ফোল্ডার বদলালে এই অংশটা বদলে যায়। মডিউল ৪-এর সম্পূর্ণ পথের মতোই।' },
      { id: 'symbol', text: '>', titleBn: '> — এবার লিখুন', descBn: 'এই চিহ্নের পরে আপনার কমান্ড লিখতে হয়। চিহ্নটি লিখতে হয় না, ওটা টার্মিনাল নিজেই দেখায়।' },
    ]
  }
  const label = folder === 'home' ? '~' : folder
  return [
    { id: 'shell', text: 'anika@Mac', titleBn: 'anika@Mac — কে, কোন কম্পিউটারে', descBn: 'আপনার ব্যবহারকারীর নাম আর কম্পিউটারের নাম। এখানে ওগুলো বদলায় না; শুধু বোঝায় টার্মিনাল চালু আছে।' },
    { id: 'folder', text: label, titleBn: `${label} — এখনকার ফোল্ডার`, descBn: 'আপনি এখন কোন ফোল্ডারে আছেন, শুধু তার নামটুকু। ~ চিহ্নের মানে হোম ফোল্ডার (/Users/anika)। পুরো পথ দেখতে pwd লিখুন।' },
    { id: 'symbol', text: '%', titleBn: '% — এবার লিখুন', descBn: 'এই চিহ্নের পরে আপনার কমান্ড লিখতে হয়। চিহ্নটি লিখতে হয় না, ওটা টার্মিনাল নিজেই দেখায়।' },
  ]
}

export function promptText(os: PromptOs, folder: PromptFolder): string {
  return promptParts(os, folder).map((p) => p.text).join(' ')
}
