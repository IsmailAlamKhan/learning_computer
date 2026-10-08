/** Practice terminal (PowerShell-style on Windows, zsh-style on Mac) working on the shared virtual file system. */
import { registerApp } from '../registry'
import { TerminalIcon } from '../../ui/icons'
import { TerminalApp } from '../../terminal/TerminalApp'

export function register() {
  registerApp({
    id: 'terminal',
    title: () => 'Terminal',
    descriptionBn: 'কমান্ড লিখে কম্পিউটারকে কাজ করানোর অনুশীলন-জানালা (আসল কম্পিউটারের কিছুই বদলায় না)',
    icon: ({ size }) => <TerminalIcon size={size} />,
    component: TerminalApp,
    defaultSize: { w: 700, h: 440 },
    singleInstance: true,
  })
}
