/** Where each everyday setting lives: Windows 11 Settings vs macOS System Settings (names as shown on screen). */
export interface SettingRow {
  id: string
  labelBn: string
  win: string
  mac: string
  noteBn?: string
}

export const SETTING_ROWS: SettingRow[] = [
  { id: 'wallpaper', labelBn: 'ডেস্কটপের ছবি (ওয়ালপেপার)', win: 'Settings → Personalization → Background', mac: 'System Settings → Wallpaper' },
  { id: 'dark', labelBn: 'ডার্ক মোড', win: 'Settings → Personalization → Colors → Choose your mode', mac: 'System Settings → Appearance → Dark' },
  { id: 'volume', labelBn: 'আওয়াজ ও মিউট', win: 'Settings → System → Sound (দ্রুত: টাস্কবারের ডানের আইকন)', mac: 'System Settings → Sound (দ্রুত: মেনু বারের Control Center)' },
  { id: 'brightness', labelBn: 'পর্দার উজ্জ্বলতা', win: 'Settings → System → Display → Brightness', mac: 'System Settings → Displays → Brightness' },
  { id: 'zoom', labelBn: 'লেখা ও আইকন বড় করা', win: 'Settings → System → Display → Scale; আর Accessibility → Text size', mac: 'System Settings → Displays; আর Accessibility → Display → Text size', noteBn: 'নামগুলো আপনার সংস্করণে একটু আলাদা হতে পারে।' },
  { id: 'wifi', labelBn: 'ওয়াই-ফাই', win: 'Settings → Network & internet → Wi‑Fi', mac: 'System Settings → Wi‑Fi' },
  { id: 'bluetooth', labelBn: 'ব্লুটুথ ও স্পিকার', win: 'Settings → Bluetooth & devices → Add device', mac: 'System Settings → Bluetooth' },
  { id: 'printer', labelBn: 'প্রিন্টার', win: 'Settings → Bluetooth & devices → Printers & scanners → Add device', mac: 'System Settings → Printers & Scanners → Add Printer, Scanner, or Fax…' },
  { id: 'time', labelBn: 'তারিখ, সময়, টাইমজোন', win: 'Settings → Time & language → Date & time', mac: 'System Settings → General → Date & Time' },
  { id: 'language', labelBn: 'ভাষা ও কিবোর্ড', win: 'Settings → Time & language → Language & region', mac: 'System Settings → Keyboard → Text Input → Input Sources' },
]

export const rowById = (id: string) => SETTING_ROWS.find((r) => r.id === id)
