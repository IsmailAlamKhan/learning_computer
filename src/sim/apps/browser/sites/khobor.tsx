/** Simulated news website: https://khobor.example/ (fictional, neutral headlines). */
import { registerSite, type SiteProps } from '../sites'
import { registerSearchEntry } from '../searchIndex'

const HOME = 'https://khobor.example/'
const WEATHER = `${HOME}weather`

interface Story {
  id: string
  title: string
  body: string
}

export const STORIES: Story[] = [
  { id: 'library', title: 'পাড়ার লাইব্রেরি এখন সন্ধ্যা ৮টা পর্যন্ত খোলা', body: 'স্থানীয় পাঠাগার পড়ুয়াদের সুবিধার জন্য খোলার সময় বাড়িয়েছে। শনিবার থেকে নতুন সময় চালু হবে।' },
  { id: 'bus', title: 'দুই এলাকাকে জুড়ে নতুন বাস রুট চালু', body: 'সকাল ও সন্ধ্যায় প্রতি আধ ঘণ্টা পরপর বাস চলবে। ভাড়া আগের মতোই থাকছে।' },
  { id: 'science-fair', title: 'স্কুলের বিজ্ঞান মেলায় রেকর্ড দর্শক', body: 'শিক্ষার্থীদের বানানো সৌর-চুলা আর পানি পরিষ্কারের যন্ত্র দেখতে অভিভাবকরাও ভিড় করেছেন।' },
]

const path = (u: string) => u.replace(HOME, '')

function Khobor({ url, go }: SiteProps) {
  const p = path(url)
  const story = STORIES.find((s) => `news/${s.id}` === p)
  return (
    <div className="min-h-full bg-white text-gray-900" lang="bn">
      <header className="flex items-center gap-4 border-b-4 border-sky-700 bg-sky-50 px-5 py-3">
        <button type="button" data-coach="khobor-home" onClick={() => go(HOME)} className="min-h-9 text-2xl font-bold text-sky-900">
          খবর <span className="text-sm font-normal">· Khobor</span>
        </button>
        <button type="button" data-coach="khobor-weather-link" onClick={() => go(WEATHER)} className="min-h-9 rounded px-2 text-sm text-sky-800 hover:bg-sky-100">
          আবহাওয়া
        </button>
      </header>
      <main className="mx-auto max-w-2xl px-5 py-5">
        {p === 'weather' ? (
          <section data-coach="weather-page">
            <h1 className="text-2xl font-bold">ঢাকার আবহাওয়া (Dhaka weather)</h1>
            <p className="mt-2 text-4xl font-semibold">২৯°C <span className="text-base font-normal text-gray-600">আংশিক মেঘলা</span></p>
            <table className="mt-4 w-full border-collapse text-sm">
              <tbody>
                {[['সকাল', '২৬°C', 'পরিষ্কার'], ['দুপুর', '৩১°C', 'রোদ'], ['বিকেল', '২৯°C', 'হালকা মেঘ'], ['রাত', '২৬°C', 'সম্ভাব্য হালকা বৃষ্টি']].map(([a, b, c]) => (
                  <tr key={a} className="border-b border-gray-200">
                    <td className="py-2 font-medium">{a}</td>
                    <td>{b}</td>
                    <td className="text-gray-600">{c}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-3 text-xs text-gray-500">কাল্পনিক তথ্য — শেখার জন্য বানানো।</p>
          </section>
        ) : story ? (
          <article data-coach="news-story">
            <h1 className="text-2xl font-bold">{story.title}</h1>
            <p className="mt-3">{story.body}</p>
            <button type="button" onClick={() => go(HOME)} className="mt-5 min-h-10 rounded bg-sky-700 px-4 text-white">
              সব খবর
            </button>
          </article>
        ) : (
          <>
            <h1 className="text-xl font-bold">আজকের প্রধান খবর</h1>
            <ul className="mt-3 flex flex-col gap-2">
              {STORIES.map((s) => (
                <li key={s.id}>
                  <button type="button" data-coach={`news-${s.id}`} onClick={() => go(`${HOME}news/${s.id}`)} className="min-h-12 w-full rounded border border-gray-200 p-3 text-left font-medium hover:bg-sky-50">
                    {s.title}
                  </button>
                </li>
              ))}
              <li>
                <button type="button" data-coach="news-weather" onClick={() => go(WEATHER)} className="min-h-12 w-full rounded border border-gray-200 p-3 text-left font-medium hover:bg-sky-50">
                  ঢাকায় আজ আংশিক মেঘলা, রাতে হালকা বৃষ্টির সম্ভাবনা
                </button>
              </li>
            </ul>
            <aside className="mt-6 rounded border border-dashed border-gray-400 bg-gray-50 p-3 text-center" data-coach="news-ad">
              <div className="text-[10px] font-bold tracking-wide text-gray-600">ADVERTISEMENT · বিজ্ঞাপন</div>
              <button type="button" data-coach="news-ad-link" onClick={() => go('https://free-prize-claim.example/')} className="mt-1 min-h-10 text-lg font-bold text-fuchsia-700 underline">
                আপনি জিতেছেন! এখনই ক্লিক করুন
              </button>
            </aside>
          </>
        )}
      </main>
    </div>
  )
}

registerSite((u) => u === HOME || u === WEATHER || STORIES.some((s) => u === `${HOME}news/${s.id}`), Khobor, (u) => (u === WEATHER ? 'Dhaka weather – Khobor' : STORIES.find((s) => u === `${HOME}news/${s.id}`)?.title ?? 'Khobor – News'))

registerSearchEntry({
  url: HOME,
  title: 'খবর (Khobor) – আজকের প্রধান খবর',
  snippet: 'সহজ ভাষায় দিনের খবর, আবহাওয়া আর স্থানীয় সংবাদ। Latest news and headlines.',
  keywords: ['news', 'খবর', 'সংবাদ', 'headlines', 'khobor', 'today', 'আজকের'],
})
registerSearchEntry({
  url: WEATHER,
  title: 'ঢাকার আবহাওয়া – Dhaka weather today',
  snippet: 'আজকের তাপমাত্রা ও বৃষ্টির সম্ভাবনা। Weather forecast for Dhaka.',
  keywords: ['weather', 'আবহাওয়া', 'dhaka', 'ঢাকা', 'forecast', 'temperature', 'rain', 'বৃষ্টি'],
  rank: 1,
})
for (const s of STORIES) {
  registerSearchEntry({ url: `${HOME}news/${s.id}`, title: s.title, snippet: s.body, keywords: ['news', 'খবর', 'সংবাদ'] })
}
