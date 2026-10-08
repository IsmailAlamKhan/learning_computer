/** Code Editor app (id `code`): window props `{ folder?: '~/coding', file?: '~/coding/index.html' }`. */
import { registerApp } from '../registry'
import { CodeEditor } from '../../editor/CodeEditor'
import { CodeIcon } from '../../editor/CodeIcon'

export function register() {
  registerApp({
    id: 'code',
    title: () => 'Code Editor',
    descriptionBn: 'প্রোগ্রামের কোড লেখা, সেভ করা, চালানো আর ওয়েবপেজের প্রিভিউ দেখার প্রোগ্রাম',
    icon: ({ size }) => <CodeIcon size={size} />,
    component: CodeEditor,
    defaultSize: { w: 880, h: 470 },
  })
}
