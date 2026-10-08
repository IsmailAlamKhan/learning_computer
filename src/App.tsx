import { Navigate, Route, Routes, Link } from 'react-router-dom'
import { Layout } from './ui/Layout'
import { useProgress } from './state/store'
import Onboarding from './pages/Onboarding'
import Home from './pages/Home'
import Settings from './pages/Settings'
import Glossary from './pages/Glossary'
import ModulePage from './pages/ModulePage'
import Teacher from './pages/Teacher'

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
        <Route path="/teacher" element={<Teacher />} />
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
