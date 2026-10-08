/** Simulated recipe website: https://rannaghor.example/ (fictional). */
import { registerSite, type SiteProps } from '../sites'
import { registerSearchEntry } from '../searchIndex'

const HOME = 'https://rannaghor.example/'

interface Recipe {
  slug: string
  titleBn: string
  titleEn: string
  introBn: string
  time: string
  ingredients: string[]
  steps: string[]
  keywords: string[]
}

export const RECIPES: Recipe[] = [
  {
    slug: 'dal',
    titleBn: 'মসুর ডালের সহজ রেসিপি',
    titleEn: 'Easy Dal Recipe',
    introBn: 'রোজকার ভাতের সাথে মানানসই সাদামাটা, সুন্দর গন্ধের মসুর ডাল।',
    time: '২৫ মিনিট',
    ingredients: ['মসুর ডাল – ১ কাপ', 'পেঁয়াজ কুচি – ১টি', 'কাঁচা লঙ্কা – ২টি', 'হলুদ গুঁড়া – আধা চা-চামচ', 'লবণ – স্বাদমতো', 'সরিষার তেল – ২ চা-চামচ', 'পানি – ৩ কাপ'],
    steps: ['ডাল ধুয়ে পানি, হলুদ আর লবণ দিয়ে সেদ্ধ করুন।', 'ডাল নরম হলে হাতা দিয়ে একটু ঘেঁটে নিন।', 'অন্য পাত্রে তেলে পেঁয়াজ ও লঙ্কা হালকা ভেজে ডালে ঢেলে দিন।', 'আরও ২ মিনিট ফুটিয়ে নামিয়ে নিন।'],
    keywords: ['dal', 'ডাল', 'মসুর', 'lentil', 'recipe', 'রেসিপি', 'রান্না', 'cooking'],
  },
  {
    slug: 'khichuri',
    titleBn: 'বৃষ্টির দিনের খিচুড়ি',
    titleEn: 'Khichuri Recipe',
    introBn: 'চাল আর ডাল একসাথে রান্না — এক হাঁড়িতেই পুরো খাবার।',
    time: '৪০ মিনিট',
    ingredients: ['চাল – ১ কাপ', 'মুগ ডাল – ১ কাপ', 'আলু – ১টি', 'পেঁয়াজ কুচি – ১টি', 'আদা বাটা – ১ চা-চামচ', 'হলুদ গুঁড়া ও লবণ – স্বাদমতো', 'তেল বা ঘি – ২ টেবিল-চামচ', 'পানি – ৫ কাপ'],
    steps: ['চাল ও ডাল একসাথে ধুয়ে নিন।', 'হাঁড়িতে তেলে পেঁয়াজ, আদা বাটা ও মশলা কষান।', 'চাল, ডাল ও আলু দিয়ে নেড়ে পানি ঢালুন।', 'ঢেকে মৃদু আঁচে ২৫ মিনিট রান্না করুন।'],
    keywords: ['khichuri', 'khichdi', 'খিচুড়ি', 'recipe', 'রেসিপি', 'rice', 'চাল', 'রান্না', 'cooking'],
  },
  {
    slug: 'aloo-bhorta',
    titleBn: 'আলু ভর্তা',
    titleEn: 'Aloo Bhorta Recipe',
    introBn: 'ভাতের সাথে সবচেয়ে সহজ ভর্তা — পাঁচ মিনিটেই তৈরি।',
    time: '১৫ মিনিট',
    ingredients: ['সেদ্ধ আলু – ২টি', 'পেঁয়াজ কুচি – আধখানা', 'কাঁচা লঙ্কা – ২টি', 'সরিষার তেল – ১ চা-চামচ', 'লবণ – স্বাদমতো'],
    steps: ['আলু সেদ্ধ করে খোসা ছাড়ান।', 'সব উপকরণ একসাথে হাতে বা চামচে মেখে নিন।', 'ভাতের সাথে পরিবেশন করুন।'],
    keywords: ['aloo', 'alu', 'আলু', 'ভর্তা', 'bhorta', 'potato', 'recipe', 'রেসিপি', 'রান্না'],
  },
]

const slugOf = (url: string) => /^https:\/\/rannaghor\.example\/recipe\/([a-z-]+)\/?$/.exec(url)?.[1]

function Rannaghor({ url, go }: SiteProps) {
  const recipe = RECIPES.find((r) => r.slug === slugOf(url))
  return (
    <div className="min-h-full bg-amber-50 text-gray-900" lang="bn">
      <header className="border-b border-amber-200 bg-amber-100 px-5 py-3">
        <button type="button" data-coach="rannaghor-home" onClick={() => go(HOME)} className="min-h-9 text-xl font-bold text-amber-900">
          রান্নাঘর <span className="text-sm font-normal">· Rannaghor</span>
        </button>
      </header>
      <main className="mx-auto max-w-2xl px-5 py-5">
        {recipe ? (
          <article data-coach="recipe-page">
            <h1 className="text-2xl font-bold">{recipe.titleBn}</h1>
            <p className="mt-1 text-sm text-gray-600">{recipe.introBn} · সময়: {recipe.time}</p>
            <h2 className="mt-4 text-lg font-semibold">উপকরণ</h2>
            <ul className="list-disc pl-6" data-coach="recipe-ingredients">
              {recipe.ingredients.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
            <h2 className="mt-4 text-lg font-semibold">পদ্ধতি</h2>
            <ol className="list-decimal pl-6">
              {recipe.steps.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ol>
            <button type="button" onClick={() => go(HOME)} className="mt-5 min-h-10 rounded bg-amber-700 px-4 text-white">
              আরও রেসিপি দেখুন
            </button>
          </article>
        ) : (
          <>
            <h1 className="text-2xl font-bold">আজ কী রান্না করবেন?</h1>
            <p className="text-sm text-gray-600">ঘরোয়া রেসিপির সহজ সংগ্রহ</p>
            <ul className="mt-4 flex flex-col gap-3">
              {RECIPES.map((r) => (
                <li key={r.slug}>
                  <button type="button" data-coach={`recipe-${r.slug}`} onClick={() => go(`${HOME}recipe/${r.slug}`)} className="min-h-14 w-full rounded-xl border border-amber-200 bg-white p-3 text-left hover:bg-amber-100">
                    <div className="font-semibold">{r.titleBn}</div>
                    <div className="text-xs text-gray-600">{r.titleEn} · {r.time}</div>
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
      </main>
    </div>
  )
}

registerSite((u) => u === HOME || slugOf(u) !== undefined, Rannaghor, (u) => RECIPES.find((r) => r.slug === slugOf(u))?.titleEn ?? 'Rannaghor – Recipes')

registerSearchEntry({
  url: HOME,
  title: 'রান্নাঘর (Rannaghor) – ঘরোয়া রেসিপি',
  snippet: 'ডাল, খিচুড়ি, ভর্তা — সহজ বাংলা রেসিপির সংগ্রহ। Easy home recipes.',
  keywords: ['recipe', 'recipes', 'রেসিপি', 'রান্না', 'রান্নাঘর', 'rannaghor', 'cooking', 'food'],
})
for (const r of RECIPES) {
  registerSearchEntry({
    url: `${HOME}recipe/${r.slug}`,
    title: `${r.titleBn} – ${r.titleEn}`,
    snippet: `${r.introBn} উপকরণ ও পদ্ধতি। Ingredients and steps, ${r.time}.`,
    keywords: r.keywords,
    rank: 1,
  })
}
// A sponsored result: it is an advertisement, not the best answer.
registerSearchEntry({
  url: 'https://tasty-box-deals.example/',
  title: 'Tasty Box – 50% off meal kits! Order today',
  snippet: 'Ready-made cooking boxes delivered to your door. Limited time offer.',
  keywords: ['recipe', 'রেসিপি', 'cooking', 'রান্না', 'dal', 'khichuri', 'খিচুড়ি', 'ডাল'],
  ad: true,
})
