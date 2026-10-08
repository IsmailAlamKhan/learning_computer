/** Print queue window: shows the waiting / printing jobs and lets the learner cancel one. */
import { registerApp } from '../registry'
import { useDesktop } from '../../DesktopContext'
import { useDevices, type PrintJob } from '../../devices/store'
import { PrinterIcon } from '../../ui/icons'

function statusText(j: PrintJob, mac: boolean): string {
  switch (j.status) {
    case 'queued':
      return mac ? 'Waiting' : 'Spooling'
    case 'printing':
      return `Printing ${Math.round(j.progress)}%`
    case 'done':
      return 'Completed'
    case 'cancelled':
      return mac ? 'Canceled' : 'Canceling'
  }
}

export function PrintQueue() {
  const d = useDesktop()
  const mac = d.os === 'mac'
  const { store, state } = useDevices(d)
  const printer = store.printers()[0]
  return (
    <div className="flex h-full flex-col bg-white text-sm text-gray-900" data-coach="printqueue">
      <div className="flex shrink-0 items-center gap-2 border-b border-gray-200 bg-[#f3f3f3] px-3 py-2">
        <PrinterIcon size={22} />
        <span className="font-medium">{printer}</span>
        <span className="text-xs text-gray-500">{state.jobs.some((j) => j.status === 'printing') ? 'Printing' : 'Ready'}</span>
      </div>
      <div className="grid shrink-0 grid-cols-[minmax(0,2fr)_minmax(0,1fr)_60px_90px] gap-2 border-b border-gray-200 px-3 py-1 text-xs font-semibold text-gray-600">
        <span>Document Name</span>
        <span>Status</span>
        <span>Pages</span>
        <span />
      </div>
      <div className="min-h-0 flex-1 overflow-auto">
        {state.jobs.length === 0 && <div className="p-6 text-center text-gray-500" data-coach="pq-empty">There are no documents waiting to print.</div>}
        {state.jobs.map((j) => (
          <div key={j.id} data-coach={`pq-job-${j.doc}`} className="grid min-h-12 grid-cols-[minmax(0,2fr)_minmax(0,1fr)_60px_90px] items-center gap-2 border-b border-gray-100 px-3">
            <span className="truncate">{j.doc}</span>
            <span className="truncate" data-testid="job-status">
              {statusText(j, mac)}
            </span>
            <span>{j.pages * j.copies}</span>
            <button type="button" data-coach={`pq-cancel-${j.doc}`} disabled={j.status === 'done' || j.status === 'cancelled'} onClick={() => store.cancelJob(j.id)} className="min-h-9 rounded border border-gray-400 bg-white px-3 hover:bg-gray-100 disabled:opacity-40">
              Cancel
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export function register() {
  registerApp({
    id: 'printqueue',
    title: (os) => (os === 'windows' ? 'Print Queue' : 'Print Queue'),
    descriptionBn: 'কোন কোন ডকুমেন্ট প্রিন্টের অপেক্ষায় আছে তা দেখা এবং দরকারে বাতিল করার জায়গা',
    icon: ({ size }) => <PrinterIcon size={size} />,
    component: PrintQueue,
    defaultSize: { w: 560, h: 320 },
  })
}
