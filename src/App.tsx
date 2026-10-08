import { Navigate, Route, Routes, Link } from 'react-router-dom'
import { Layout } from './ui/Layout'
import { useProgress } from './state/store'
import Onboarding from './pages/Onboarding'
import Home from './pages/Home'
import Settings from './pages/Settings'
import Glossary from './pages/Glossary'
import ModulePage from './pages/ModulePage'
import Teacher from './pages/Teacher'
import Certificate from './pages/Certificate'
import NextSteps from './pages/NextSteps'
import ToolsDemo from './pages/ToolsDemo'
import Notebook from './pages/Notebook'
import CheatSheetPage, { CheatSheetList } from './pages/CheatSheetPage'

export default function App() {
  const { profile } = useProgress()
  const ready = profile.onboarded
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/welcome" element={<Onboarding />} />
        <Route path="/" element={ready ? <Home /> : <Navigate to="/welcome" replace />} />
        <Route path="/module/:id" element={ready ? <ModulePage /> : <Navigate to="/welcome" replace />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/glossary" element={<Glossary />} />
        <Route path="/notebook" element={<Notebook />} />
        <Route path="/demo/tools" element={<ToolsDemo />} />
        <Route path="/teacher" element={<Teacher />} />
        <Route path="/certificate/:part" element={<Certificate />} />
        <Route path="/next-steps" element={<NextSteps />} />
        <Route path="/cheatsheets" element={<CheatSheetList />} />
        <Route path="/cheatsheet/:id" element={<CheatSheetPage />} />
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
