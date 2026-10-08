import { EditorIcon, FilesIcon } from './appIcons'
import { registerApp } from './registry'
import { BinApp, FilesApp } from './FileManager'
import { Editor } from './Editor'
import { Browser } from './Browser'
import { Settings } from './Settings'
import { Photos } from './Photos'
import { BrowserIcon, PhotosIcon, RecycleBinIcon, SettingsIcon } from '../ui/icons'

export { registerSite, normalizeInput } from './browser/sites'
export { useFmPrefs } from './fmPrefs'

const extras = import.meta.glob<{ register?: () => void }>('./extra/*.tsx', { eager: true })

/** Register File Explorer/Finder, Recycle Bin/Trash, Notepad/TextEdit, Browser, Settings and Photos (+ ./extra/*.tsx modules exporting `register()`). Safe to call repeatedly. */
export function registerBuiltinApps() {
  for (const m of Object.values(extras)) m.register?.()
  registerApp({
    id: 'files',
    title: (os) => (os === 'windows' ? 'File Explorer' : 'Finder'),
    descriptionBn: 'ফাইল ও ফোল্ডার দেখা, খোলা, নতুন বানানো আর গুছিয়ে রাখার প্রোগ্রাম',
    icon: FilesIcon,
    component: FilesApp,
    defaultSize: { w: 760, h: 460 },
  })
  registerApp({
    id: 'bin',
    title: (os) => (os === 'windows' ? 'Recycle Bin' : 'Trash'),
    descriptionBn: 'মুছে ফেলা ফাইল এখানে জমা থাকে, চাইলে আপনি সেগুলো ফিরিয়ে আনতে পারেন',
    icon: ({ size }) => <RecycleBinIcon size={size} />,
    component: BinApp,
    defaultSize: { w: 760, h: 460 },
  })
  registerApp({
    id: 'editor',
    title: (os) => (os === 'windows' ? 'Notepad' : 'TextEdit'),
    descriptionBn: 'সাধারণ লেখা টাইপ করা আর ফাইলে সেভ করে রাখার প্রোগ্রাম',
    icon: EditorIcon,
    component: Editor,
    defaultSize: { w: 620, h: 420 },
  })
  registerApp({
    id: 'browser',
    title: () => 'Web Browser',
    descriptionBn: 'ইন্টারনেটে ওয়েবসাইট দেখা আর কিছু খোঁজার প্রোগ্রাম',
    icon: ({ size }) => <BrowserIcon size={size} />,
    component: Browser,
    defaultSize: { w: 820, h: 500 },
  })
  registerApp({
    id: 'settings',
    title: (os) => (os === 'windows' ? 'Settings' : 'System Settings'),
    descriptionBn: 'আওয়াজ, উজ্জ্বলতা, ওয়াই-ফাই, ব্যাকগ্রাউন্ড ছবি ইত্যাদি ঠিক করার জায়গা',
    icon: ({ size }) => <SettingsIcon size={size} />,
    component: Settings,
    defaultSize: { w: 760, h: 500 },
  })
  registerApp({
    id: 'photos',
    title: () => 'Photos',
    descriptionBn: 'ছবি দেখার প্রোগ্রাম',
    icon: ({ size }) => <PhotosIcon size={size} />,
    component: Photos,
    defaultSize: { w: 640, h: 460 },
  })
}

