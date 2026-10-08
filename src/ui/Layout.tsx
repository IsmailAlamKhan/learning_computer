import { useEffect, useRef } from 'react'
import { NavLink, Outlet, Link, useLocation } from 'react-router-dom'
import { HelpButton } from './HelpButton'
import { PwaStatus } from './PwaStatus'
import { useProgress } from '../state/store'

const link = ({ isActive }: { isActive: boolean }) =>
  `inline-flex min-h-12 items-center rounded-xl px-4 font-medium ${isActive ? 'bg-brand text-brand-ink' : 'hover:bg-sunken'}`

export function Layout() {
  const { profile } = useProgress()
  const { pathname } = useLocation()
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
      <header className="no-print border-b" style={{ borderColor: 'var(--c-line)', background: 'var(--c-surface)' }}>
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-2">
          <Link to="/" className="flex items-center gap-2 text-lg font-bold">
            <span aria-hidden="true" className="text-2xl">💻</span> কম্পিউটার শিখি
          </Link>
          {profile.onboarded && (
            <nav aria-label="প্রধান মেনু" className="flex flex-wrap gap-1">
              <NavLink to="/" end className={link}>হোম</NavLink>
              <NavLink to="/glossary" className={link}>শব্দকোষ</NavLink>
              <NavLink to="/notebook" className={link}>নোটবুক</NavLink>
              <NavLink to="/cheatsheets" className={link}>চিট শিট</NavLink>
              <NavLink to="/settings" className={link}>সেটিংস</NavLink>
            </nav>
          )}
        </div>
      </header>
      <main id="main" tabIndex={-1} className="mx-auto max-w-6xl px-4 py-6 pb-28">
        <Outlet />
      </main>
      <PwaStatus />
      <HelpButton />
    </div>
  )
}
