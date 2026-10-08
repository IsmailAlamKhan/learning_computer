/**
 * Clearly fictional SUSPICIOUS sites for teaching: a prize-claim scam, a look-alike wallet login, and ad landing pages.
 * Nothing typed here is stored or sent anywhere. No real brands or logos.
 */
import { useState } from 'react'
import { registerSite, type SiteProps } from '../sites'
import { registerSearchEntry } from '../searchIndex'

export const PRIZE_URL = 'https://free-prize-claim.example/'
export const WALLET_URL = 'https://paypocket-secure1ogin.example/'
export const ADSHOP_URL = 'https://tasty-box-deals.example/'
export const FAKE_DOWNLOAD_URL = 'https://get-editor-fast.example/'

function Gotcha({ onClose, emit }: { onClose: () => void; emit?: (e: string) => void }) {
  return (
    <div role="alert" data-coach="scam-gotcha" className="mt-3 rounded-lg border-2 border-green-700 bg-green-50 p-3 text-sm text-green-900">
      <p className="font-semibold">এটি শেখার জন্য বানানো ভুয়া পাতা — আপনার কিছুই যায়নি।</p>
      <p>আসল জীবনে এমন পাতায় OTP, পাসওয়ার্ড বা PIN কখনো লিখবেন না। এখানে লেখা কিছুই কোথাও পাঠানো হয়নি।</p>
      <button type="button" className="mt-2 min-h-9 rounded bg-green-700 px-3 text-white" onClick={() => (emit?.('browser-scam-submit-warned'), onClose())}>
        বুঝেছি
      </button>
    </div>
  )
}

function PrizeSite({ go, emit }: SiteProps) {
  const [popup, setPopup] = useState(true)
  const [otp, setOtp] = useState('')
  const [warn, setWarn] = useState(false)
  return (
    <div className="relative min-h-full bg-yellow-200 p-5 text-center" lang="en">
      <h1 className="text-3xl font-black text-fuchsia-700" data-coach="scam-prize">
        CONGRATULATION!!! YOU ARE THE LUCKY WINER!!!
      </h1>
      <p className="mt-2 text-xl font-bold">You have won 50,000 Taka + a FREE phone</p>
      <p className="mt-2 text-lg font-bold text-red-600" data-coach="scam-urgent">
        URGENT!!! Claim in 10 minutes or your prize will be CANCELED forever!!!
      </p>
      <div className="mx-auto mt-4 max-w-sm rounded-lg border-2 border-red-600 bg-white p-4 text-left">
        <label className="block text-sm font-semibold" htmlFor="scam-otp-input">
          Verifiy your account: enter the OTP code or your wallet PIN
        </label>
        <input id="scam-otp-input" data-coach="scam-otp" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="OTP / PIN" className="mt-2 min-h-11 w-full rounded border border-gray-400 px-3" />
        <button type="button" data-coach="scam-claim" onClick={() => setWarn(true)} className="mt-3 min-h-11 w-full rounded bg-green-600 font-bold text-white">
          CLAIM PRIZE NOW
        </button>
        {warn && <Gotcha onClose={() => setWarn(false)} emit={emit} />}
      </div>
      <p className="mt-3 text-xs text-gray-700">Only 3 prizes left! 1,248 people are watching this page. Share with 10 friends to recieve your gift.</p>
      <button type="button" onClick={() => go('https://khobor.example/')} className="mt-3 min-h-9 text-xs underline">
        Leave this page
      </button>
      {popup && (
        <div className="absolute inset-0 z-10 flex items-start justify-center bg-black/50 pt-16" data-coach="scam-popup">
          <div className="relative w-72 rounded-lg border-4 border-red-600 bg-white p-4 text-center shadow-xl">
            <button type="button" aria-label="Close pop-up" data-coach="scam-popup-close" onClick={() => setPopup(false)} className="absolute top-1 right-1 min-h-9 min-w-9 rounded text-lg font-bold hover:bg-gray-200">
              ✕
            </button>
            <p className="text-xl font-black text-red-600">WARNING! Your phone has 5 VIRUSES!</p>
            <p className="mt-1 text-sm">Press OK to clean now.</p>
            <button type="button" data-coach="scam-popup-ok" onClick={() => {
                setWarn(true)
                setPopup(false)
              }} className="mt-2 min-h-10 w-full rounded bg-red-600 font-bold text-white">
              OK
            </button>
            <p className="mt-2 text-[10px] text-gray-600">(এটি একটি পপ-আপ। ভয় দেখানো পপ-আপে ক্লিক না করে ✕ দিয়ে বন্ধ করুন।)</p>
          </div>
        </div>
      )}
    </div>
  )
}

function WalletSite({ emit }: SiteProps) {
  const [phone, setPhone] = useState('')
  const [pin, setPin] = useState('')
  const [otp, setOtp] = useState('')
  const [warn, setWarn] = useState(false)
  return (
    <div className="min-h-full bg-sky-100 p-5" lang="en">
      <div className="mx-auto max-w-sm rounded-lg bg-white p-4 shadow">
        <h1 className="text-2xl font-bold text-sky-800">PayPocket</h1>
        <p className="text-sm text-gray-600">Mobile wallet — Secure Login</p>
        <p className="mt-2 text-sm font-bold text-red-600" data-coach="wallet-urgent">
          Your acount will be BLOCKED in 10 minutes! Login now to verifiy.
        </p>
        <input aria-label="Phone number" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone number" className="mt-3 min-h-11 w-full rounded border border-gray-400 px-3" />
        <input aria-label="PIN" data-coach="wallet-pin" value={pin} onChange={(e) => setPin(e.target.value)} placeholder="Wallet PIN" className="mt-2 min-h-11 w-full rounded border border-gray-400 px-3" />
        <input aria-label="OTP" data-coach="wallet-otp" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="OTP code we just sent you" className="mt-2 min-h-11 w-full rounded border border-gray-400 px-3" />
        <button type="button" data-coach="wallet-login" onClick={() => setWarn(true)} className="mt-3 min-h-11 w-full rounded bg-sky-700 font-bold text-white">
          Login
        </button>
        {warn && <Gotcha onClose={() => setWarn(false)} emit={emit} />}
      </div>
    </div>
  )
}

function AdShop({ go }: SiteProps) {
  return (
    <div className="min-h-full bg-orange-50 p-6" lang="en">
      <p className="text-xs font-bold text-gray-600">ADVERTISEMENT · বিজ্ঞাপন</p>
      <h1 className="mt-1 text-2xl font-bold text-orange-800">Tasty Box meal kits</h1>
      <p className="mt-2 text-gray-700">This is a pretend shop page. Ads are sellers paying to be shown first — they are not always the best answer.</p>
      <button type="button" onClick={() => go('https://search.example/')} className="mt-4 min-h-10 rounded bg-orange-700 px-4 text-white">
        Back to search
      </button>
    </div>
  )
}

function FakeDownload({ go, emit }: SiteProps) {
  const [warn, setWarn] = useState(false)
  return (
    <div className="min-h-full bg-gray-900 p-6 text-center text-white" lang="en">
      <p className="text-xs font-bold text-gray-400">ADVERTISEMENT · বিজ্ঞাপন</p>
      <h1 className="mt-2 text-3xl font-black text-lime-400">Fast Editor PRO — FREE DOWNLOAD</h1>
      <p className="mt-2 text-sm text-gray-300">100% FREE! No virus! Download now before it is gone!</p>
      <button type="button" data-coach="fakesite-download" onClick={() => (setWarn(true), emit?.('browser-ad-trap'))} className="mt-4 min-h-12 rounded bg-lime-500 px-6 text-lg font-black text-black">
        Download Now
      </button>
      {warn && (
        <div role="alert" className="mx-auto mt-4 max-w-md rounded border-2 border-green-600 bg-white p-3 text-left text-sm text-green-900" data-coach="fakesite-warning">
          <p className="font-semibold">থামুন! এটি বিজ্ঞাপনের পাতা — ফাইলটি ডাউনলোড করা হয়নি।</p>
          <p>অচেনা সাইটের ফাইলে ভাইরাস থাকতে পারে। প্রোগ্রাম সবসময় প্রোগ্রামটির নিজের আসল (অফিসিয়াল) সাইট থেকে নামান।</p>
          <button type="button" className="mt-2 min-h-9 rounded bg-green-700 px-3 text-white" onClick={() => go('https://download.official-editor.example/')}>
            আসল সাইটে যাই
          </button>
        </div>
      )}
    </div>
  )
}

registerSite(PRIZE_URL, PrizeSite, 'You won!!! – Claim')
registerSite(WALLET_URL, WalletSite, 'PayPocket – Secure Login')
registerSite(ADSHOP_URL, AdShop, 'Tasty Box deals')
registerSite(FAKE_DOWNLOAD_URL, FakeDownload, 'Fast Editor PRO – Download')

registerSearchEntry({
  url: PRIZE_URL,
  title: 'YOU WON!!! Claim your FREE prize now',
  snippet: 'Lucky winner! Free phone and cash prize. Claim now. পুরস্কার জিতেছেন।',
  keywords: ['prize', 'win', 'winner', 'lucky', 'free', 'পুরস্কার', 'lottery'],
})
registerSearchEntry({
  url: WALLET_URL,
  title: 'PayPocket Secure Login – verify your account',
  snippet: 'Login to your mobile wallet account now to avoid blocking.',
  keywords: ['wallet', 'paypocket', 'login', 'ওয়ালেট', 'mobile wallet'],
})
registerSearchEntry({
  url: FAKE_DOWNLOAD_URL,
  title: 'Fast Editor PRO – FREE Download Now!!!',
  snippet: '100% free text editor download. Fast and no virus. Download now.',
  keywords: ['editor', 'download', 'free', 'text', 'ডাউনলোড', 'এডিটর', 'software'],
  ad: true,
})
