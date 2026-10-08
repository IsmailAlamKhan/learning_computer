import { useDesktop } from '../DesktopContext'
import { Window } from './Window'

/** All open windows. Shells render this between the desktop surface and the taskbar/dock. */
export function WindowLayer() {
  const { wm } = useDesktop()
  return (
    <div className="pointer-events-none absolute inset-0" style={{ zIndex: 100 }}>
      <div className="pointer-events-none relative h-full w-full [&>*]:pointer-events-auto">
        {wm.windows.map((w) => (
          <Window key={w.id} win={w} />
        ))}
      </div>
    </div>
  )
}
