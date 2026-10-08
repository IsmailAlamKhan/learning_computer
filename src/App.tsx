import { lazy, Suspense, type ReactNode } from 'react'
import { Navigate, Route, Routes, Link } from 'react-router-dom'
import { Layout } from './ui/Layout'
import { useProgress } from './state/store'
import Onboarding from './pages/Onboarding'
import Home from './pages/Home'
import Settings from './pages/Settings'
const Glossary = lazy(() => import('./pages/Glossary'))
const ModulePage = lazy(() => import('./pages/ModulePage'))
const Teacher = lazy(() => import('./pages/Teacher'))
const Certificate = lazy(() => import('./pages/Certificate'))
const NextSteps = lazy(() => import('./pages/NextSteps'))
const ToolsDemo = lazy(() => import('./pages/ToolsDemo'))
const Notebook = lazy(() => import('./pages/Notebook'))
const CheatSheetPage = lazy(() => import('./pages/CheatSheetPage'))
const CheatSheetList = lazy(() => import('./pages/CheatSheetPage').then((m) => ({ default: m.CheatSheetList })))

/** Gentle loading state while a page's code is fetched (usually a fraction of a second). */
function PageLoading() {
  return (
    <p role="status" className="card text-muted">
      একটু অপেক্ষা করুন, পাতাটি খুলছে…
    </p>
  )
}
const L = ({ children }: { children: ReactNode }) => <Suspense fallback={<PageLoading />}>{children}</Suspense>

export default function App() {
  const { profile } = useProgress()
  const ready = profile.onboarded
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/welcome" element={<Onboarding />} />
        <Route path="/" element={ready ? <Home /> : <Navigate to="/welcome" replace />} />
        <Route path="/module/:id" element={ready ? <L><ModulePage /></L> : <Navigate to="/welcome" replace />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/glossary" element={<L><Glossary /></L>} />
        <Route path="/notebook" element={<L><Notebook /></L>} />
        <Route path="/demo/tools" element={<L><ToolsDemo /></L>} />
        <Route path="/teacher" element={<L><Teacher /></L>} />
        <Route path="/certificate/:part" element={<L><Certificate /></L>} />
        <Route path="/next-steps" element={<L><NextSteps /></L>} />
        <Route path="/cheatsheets" element={<L><CheatSheetList /></L>} />
        <Route path="/cheatsheet/:id" element={<L><CheatSheetPage /></L>} />
        <Route
          path="*"
          element={
            <div className="card space-y-3">
              <h1 className="text-xl font-bold">পাতাটি পাওয়া যায়নি</h1>
              <Link to="/" className="btn">← হোমে ফিরুন</Link>
            </div>
          }
        />
      </Route>
    </Routes>
  )
}
