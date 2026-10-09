import { useEffect, useRef } from 'react'
import { NavLink, Outlet, Link, useLocation } from 'react-router-dom'
import { HelpButton } from './HelpButton'
import { PwaStatus } from './PwaStatus'
import { useProgress } from '../state/store'
import { useFmt } from './useFmt'
import { useInputDetection } from '../lib/useInputDetection'
import { dayKey, streakAlive } from '../state/gamification'

const link = 'nav-link'

const TABS = [
  { to: '/', end: true, label: 'হোম', icon: '🏠' },
  { to: '/glossary', end: false, label: 'শব্দকোষ', icon: '📖' },
  { to: '/notebook', end: false, label: 'নোটবুক', icon: '📝' },
  { to: '/cheatsheets', end: false, label: 'চিট শিট', icon: '📋' },
  { to: '/settings', end: false, label: 'সেটিংস', icon: '⚙️' },
]

/** 🔥 streak (dim when not done today/yesterday) and ⭐ XP, shown in the header. */
export function StatPills() {
  const { streak, xp } = useProgress()
  const { n } = useFmt()
  const alive = streakAlive(streak, dayKey())
  const count = alive ? streak.count : 0
  return (
    <div className="flex items-center gap-2">
      <span role="img" className="stat-pill" data-dim={!alive} data-testid="streak-pill" aria-label={`টানা ${n(count)} দিন`} title="টানা কত দিন শিখেছেন">
        <span aria-hidden="true" className="flame" data-alive={alive}>🔥</span>
        <span aria-hidden="true">{n(count)}</span>
      </span>
      <span role="img" className="stat-pill" data-testid="xp-pill" aria-label={`${n(xp)} এক্সপি`} title="আপনার পয়েন্ট (XP)">
        <span aria-hidden="true">⭐</span>
        <span aria-hidden="true">{n(xp)}</span>
      </span>
    </div>
  )
}

export function Layout() {
  const { profile } = useProgress()
  const { pathname } = useLocation()
  useInputDetection()
  const first = useRef(true)
  // After navigating to another page, move focus to its heading so keyboard and screen-reader users start at the top.
  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    const target = document.querySelector<HTMLElement>('main h1') ?? document.getElementById('main')
    if (!target) return
    target.setAttribute('tabindex', '-1')
    target.focus({ preventScroll: true })
    window.scrollTo({ top: 0 })
  }, [pathname])
  return (
    <div className="min-h-screen">
      <a
        href="#main"
        onClick={(e) => {
          // HashRouter owns location.hash, so move focus ourselves instead of following the anchor
          e.preventDefault()
          const m = document.getElementById('main')
          m?.focus()
          m?.scrollIntoView()
        }}
        className="sr-only focus:not-sr-only focus:fixed focus:left-2 focus:top-2 focus:z-50 focus:rounded-xl focus:border-2 focus:bg-surface focus:px-4 focus:py-3 focus:font-bold">
        মূল অংশে যান
      </a>
      <header className="app-header no-print">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-3 gap-y-1 px-4 py-2">
          <Link to="/" className="flex items-center gap-2 whitespace-nowrap text-base font-extrabold sm:text-lg">
            <span aria-hidden="true" className="grid h-10 w-10 place-items-center rounded-xl text-xl" style={{ background: 'var(--c-brand)' }}>💻</span>
            <span>কম্পিউটার শিখি</span>
          </Link>
          {profile.onboarded && (
            <>
              <nav aria-label="প্রধান মেনু" className="top-nav flex flex-wrap gap-1">
                {TABS.map((t) => (
                  <NavLink key={t.to} to={t.to} end={t.end} className={link}>{t.label}</NavLink>
                ))}
              </nav>
              <StatPills />
            </>
          )}
        </div>
      </header>
      <main id="main" tabIndex={-1} className="has-tabbar mx-auto max-w-6xl px-4 py-6 pb-28">
        <Outlet />
      </main>
      {profile.onboarded && (
        <nav aria-label="নিচের মেনু" className="tabbar no-print">
          {TABS.map((t) => (
            <NavLink key={t.to} to={t.to} end={t.end}>
              <span className="tab-ico" aria-hidden="true">{t.icon}</span>
              <span>{t.label}</span>
            </NavLink>
          ))}
        </nav>
      )}
      <PwaStatus />
      <HelpButton />
    </div>
  )
}
