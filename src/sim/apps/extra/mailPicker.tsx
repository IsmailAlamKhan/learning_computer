/** "Attach file" dialog for the Mail app: browse folders of the virtual file system and pick a file (like the Open dialog). */
import { useState } from 'react'
import { useDesktop } from '../../DesktopContext'
import type { VNode } from '../../vfs'
import { FolderIcon, NodeIcon } from '../../ui/icons'

export function AttachPicker({ startFolder, onCancel, onChoose }: { startFolder: VNode; onCancel: () => void; onChoose: (file: VNode) => void }) {
  const { vfs, os } = useDesktop()
  const mac = os === 'mac'
  const [folder, setFolder] = useState<VNode>(startFolder)
  const [picked, setPicked] = useState<VNode | null>(null)
  const items = vfs.list(folder)
  return (
    <div className="absolute inset-0 z-[500] flex items-center justify-center bg-black/30 p-2" onKeyDown={(e) => e.key === 'Escape' && (e.stopPropagation(), onCancel())}>
      <div role="dialog" aria-modal="true" aria-label="Choose file to attach" data-coach="mail-picker" className={`flex max-h-full w-full max-w-xl flex-col bg-white text-sm text-gray-900 shadow-2xl ${mac ? 'rounded-xl' : 'rounded-lg border border-gray-300'}`}>
        <div className={`px-4 py-2.5 font-semibold ${mac ? 'text-center' : 'border-b border-gray-200'}`}>Choose file to attach</div>
        <div className="flex items-center gap-2 px-4 pt-3">
          <button type="button" data-coach="mail-picker-up" aria-label="Up one level" disabled={!folder.parent} onClick={() => folder.parent && (setFolder(folder.parent), setPicked(null))} className="min-h-9 min-w-9 rounded border border-gray-300 disabled:text-gray-400">
            ↑
          </button>
          <div data-coach="mail-picker-path" className="min-h-9 min-w-0 flex-1 truncate rounded border border-gray-300 bg-gray-50 px-2 leading-9">
            {vfs.displayPath(folder)}
          </div>
        </div>
        <div role="listbox" aria-label="Folders and files" className="mx-4 my-3 h-48 overflow-auto rounded border border-gray-300">
          {items.length === 0 && <div className="p-3 text-gray-500">This folder is empty.</div>}
          {items.map((n) => (
            <button
              key={n.id}
              type="button"
              role="option"
              aria-selected={picked === n}
              data-coach={n.kind === 'folder' ? `mail-picker-folder-${n.name}` : `mail-picker-file-${n.name}`}
              onClick={() => {
                if (n.kind === 'folder') {
                  setFolder(n)
                  setPicked(null)
                } else setPicked(n)
              }}
              onDoubleClick={() => n.kind === 'file' && onChoose(n)}
              className={`flex min-h-9 w-full items-center gap-2 px-2 text-left hover:bg-gray-100 ${picked === n ? 'bg-sky-100' : ''}`}
            >
              {n.kind === 'folder' ? <FolderIcon size={20} /> : <NodeIcon node={n} size={20} />}
              <span className="truncate">{n.name}</span>
            </button>
          ))}
        </div>
        <div className="px-4 text-gray-600">{picked ? `Selected: ${picked.name}` : 'Choose a file to attach.'}</div>
        <div className={`mt-3 flex justify-end gap-2 px-4 py-3 ${mac ? '' : 'bg-gray-100'}`}>
          <button type="button" data-coach="mail-picker-cancel" onClick={onCancel} className="min-h-9 rounded border border-gray-400 bg-white px-4">
            Cancel
          </button>
          <button type="button" data-coach="mail-picker-attach" disabled={!picked} onClick={() => picked && onChoose(picked)} className="min-h-9 rounded bg-blue-600 px-4 text-white disabled:opacity-50">
            Attach
          </button>
        </div>
      </div>
    </div>
  )
}
