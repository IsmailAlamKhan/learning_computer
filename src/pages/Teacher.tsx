import { Link } from 'react-router-dom'
import { MODULES } from '../content/modules'
import { useProgress } from '../state/store'
import { useFmt } from '../ui/useFmt'

/** Local-only overview for the teacher. Expanded in the final stage. */
export default function Teacher() {
  const data = useProgress()
  const { n } = useFmt()
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">শিক্ষকের পাতা</h1>
      <p className="text-muted">এখানকার তথ্য শুধু এই কম্পিউটারেই আছে — কোথাও পাঠানো হয় না।</p>
      <ul className="space-y-2">
        {MODULES.map((m) => {
          const p = data.modules[m.module]
          return (
            <li key={m.module} className="card flex flex-wrap justify-between gap-2">
              <span>
                পাঠ {n(m.module)}: {m.titleBn}
              </span>
              <span className="text-muted">
                {p?.completed ? '✓ সম্পন্ন' : m.status === 'soon' ? 'শীঘ্রই আসছে' : 'চলছে / শুরু হয়নি'}
                {p?.bestQuizScore !== undefined && p.quiz ? ` · কুইজ ${n(p.bestQuizScore)}/${n(p.quiz.total)}` : ''}
              </span>
            </li>
          )
        })}
      </ul>
      <Link to="/settings" className="btn btn-outline">ব্যাকআপ নিতে সেটিংসে যান</Link>
    </div>
  )
}
