import { useDesktop } from '../DesktopContext'
import { FilesAppIcon, FinderAppIcon, NotepadIcon, TextEditIcon } from '../ui/icons'

// OS-specific icons (rendered as components, so they may read the desktop's OS)
export const FilesIcon = ({ size }: { size?: number }) => (useDesktop().os === 'mac' ? <FinderAppIcon size={size} /> : <FilesAppIcon size={size} />)
export const EditorIcon = ({ size }: { size?: number }) => (useDesktop().os === 'mac' ? <TextEditIcon size={size} /> : <NotepadIcon size={size} />)
