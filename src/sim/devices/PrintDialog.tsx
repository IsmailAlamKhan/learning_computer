import { useState } from 'react'
import { useDesktop } from '../DesktopContext'
import { getDevices } from './store'
import { countPages, parsePageRange } from './printing'

/** The Print dialog of Notepad / TextEdit (Ctrl/Cmd+P or File → Print). Drawn inside the editor window. */
export function PrintDialog({ docName, text, onClose }: { docName: string; text: string; onClose: () => void }) {
  const d = useDesktop()
  const mac = d.os === 'mac'
  const store = getDevices(d)
  const printers = store.printers()
  const total = countPages(text)
  const [printer, setPrinter] = useState(printers[0])
  const [copies, setCopies] = useState('1')
  const [range, setRange] = useState('')
  const [err, setErr] = useState('')
  const field = 'min-h-9 rounded border border-gray-300 bg-white px-2'

  const print = () => {
    const n = Number(copies)
    if (!Number.isInteger(n) || n < 1 || n > 99) return setErr('Enter a number of copies from 1 to 99.')
    const pages = range.trim() === '' ? total : parsePageRange(range, total)
    if (pages === null) return setErr(`Enter pages like 1 or 1-${total}. This document has ${total} page${total === 1 ? '' : 's'}.`)
    store.addJob(docName, printer, n, pages)
    d.toast(`Sent “${docName}” to ${printer}`)
    onClose()
  }

  return (
    <div className="absolute inset-0 z-[500] flex items-center justify-center bg-black/30 p-2" onKeyDown={(e) => e.key === 'Escape' && (e.stopPropagation(), onClose())}>
      <div role="dialog" aria-modal="true" aria-label="Print" data-coach="print-dialog" className={`flex w-full max-w-md flex-col bg-white text-sm text-gray-900 shadow-2xl ${mac ? 'rounded-xl' : 'rounded-lg border border-gray-300'}`}>
        <div className={`px-4 py-2.5 font-semibold ${mac ? 'text-center' : 'border-b border-gray-200'}`}>Print</div>
        <div className="space-y-3 px-4 py-3">
          <label className="flex items-center gap-2">
            <span className="w-24 shrink-0 text-gray-600">{mac ? 'Printer:' : 'Select Printer'}</span>
            <select data-coach="print-printer" aria-label="Printer" value={printer} onChange={(e) => setPrinter(e.target.value)} className={`${field} min-w-0 flex-1`}>
              {printers.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-2">
            <span className="w-24 shrink-0 text-gray-600">Copies:</span>
            <input data-coach="print-copies" aria-label="Copies" type="number" min={1} max={99} value={copies} onChange={(e) => (setCopies(e.target.value), setErr(''))} className={`${field} w-24`} onKeyDown={(e) => e.stopPropagation()} />
          </label>
          <label className="flex items-center gap-2">
            <span className="w-24 shrink-0 text-gray-600">Pages:</span>
            <input data-coach="print-pages" aria-label="Pages" placeholder={`All (1-${total})`} value={range} onChange={(e) => (setRange(e.target.value), setErr(''))} className={`${field} min-w-0 flex-1`} onKeyDown={(e) => e.stopPropagation()} />
          </label>
          <div className="text-xs text-gray-500">
            Document: {docName} · {total} page{total === 1 ? '' : 's'}
          </div>
          {err && (
            <div role="alert" className="text-xs text-red-700" data-coach="print-error">
              {err}
            </div>
          )}
        </div>
        <div className={`flex justify-end gap-2 px-4 py-3 ${mac ? '' : 'bg-gray-100'}`}>
          <button type="button" data-coach="print-cancel-dialog" onClick={onClose} className="min-h-9 rounded border border-gray-400 bg-white px-4">
            Cancel
          </button>
          <button type="button" data-coach="print-go" onClick={print} className="min-h-9 rounded bg-blue-600 px-4 text-white">
            Print
          </button>
        </div>
      </div>
    </div>
  )
}
