import { NavLink, Outlet, Link } from 'react-router-dom'
import { HelpButton } from './HelpButton'
import { useProgress } from '../state/store'

const link = ({ isActive }: { isActive: boolean }) =>
  `inline-flex min-h-12 items-center rounded-xl px-4 font-medium ${isActive ? 'bg-brand text-brand-ink' : 'hover:bg-sunken'}`

export function Layout() {
  const { profile } = useProgress()
  return (
    <div className="min-h-screen">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded focus:bg-surface focus:p-3">
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
              <NavLink to="/settings" className={link}>সেটিংস</NavLink>
            </nav>
          )}
        </div>
      </header>
      <main id="main" className="mx-auto max-w-6xl px-4 py-6 pb-28">
        <Outlet />
      </main>
      <HelpButton />
    </div>
  )
}
