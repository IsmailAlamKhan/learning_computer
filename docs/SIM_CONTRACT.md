# Simulation contract (src/sim)

Read these first: `src/sim/DesktopContext.tsx` (state hub, `useDesktop()`), `src/sim/bus.ts` (SimEvent), `src/sim/vfs.ts`,
`src/sim/windowManager.ts`, `src/sim/dnd.tsx`, `src/sim/ui/*` (Window, WindowLayer, DesktopSurface, ContextMenu, SimDialog, Tooltip, icons, Overlays), `src/sim/Frame.tsx`, `src/sim/SimStage.tsx`.

## Rules
- Simulated OS UI text is **English**, exactly as a real English-language OS shows it (Start, File Explorer, Recycle Bin, Finder, Dock, Trash…). Bengali explanations are added only through `Tooltip bn=…` or in the lesson coach. Bengali TEXT the learner types or file names must render fine.
- **No logos / trademarked artwork.** Use the generic icons in `ui/icons.tsx` (add new generic ones there if needed). Don't name products in UI beyond generic role names ("Web Browser", "Text Editor" is OK as the app title only where shown as `Notepad` / `TextEdit` — those names are fine as plain text).
- Sim controls should be at least ~36px tall (the surrounding lesson UI uses 48px). Keyboard accessible where reasonable; focus-visible outlines are global.
- No network requests ever. No external images/fonts.
- Never break `data-coach` ids below: lessons depend on them. Any clickable thing a lesson might point at needs one. Dynamic ids use the item's visible name.
- Everything the learner does that a lesson could expect must reach the bus: clicks/double/right clicks/typing on `[data-coach]` elements are captured automatically by `Frame`; file operations are emitted by the VFS; `openApp`/`closeApp` by `DesktopContext`; drags by `useDrag(... onDragEvent: d.emit)`; settings via `setSim` (emits `selectOption` with target `setting-<key>`). Emit extra `{type:'custom', event:'...'}` events for app-specific milestones.
- Use `useWindowCombos(win.id, combo => boolean)` for app shortcuts (works for both real keys and the on-screen shortcut pad). Combo strings are canonical: `ctrl+c`, `cmd+c`, `alt+tab`, `delete`, `f2`, `enter`…
- Window ids: `files`, `editor`, … (first instance), `files#2` for more. `win.app` is the app id. Coach ids for chrome use `win-<appId>-…`.
- Bengali neutrality (if you write any Bengali): religion-neutral wording only; never নমস্কার/আদাব/সালাম.

## Coach (data-coach) ids
Common: `desktop` (empty desktop area), `icon-<visible name>` (desktop icons, e.g. `icon-Recycle Bin`, `icon-Welcome.txt`, `icon-Practice`), `ctx-menu`, `ctx-<item id>` (context menu items), `rename-input`, `dialog`.
Window chrome (Window.tsx): `win-<app>`, `-titlebar`, `-minimize`, `-maximize`, `-close`, `-content`, `-resize-{n,s,e,w,ne,nw,se,sw}`.

Windows shell: `taskbar`, `start-button`, `start-menu`, `start-search` (input), `start-app-<appId>` (items in Start menu pinned/all apps), `start-power`, `taskbar-search`, `taskbar-app-<appId>` (taskbar buttons for pinned+open apps), `tray`, `tray-wifi`, `tray-volume`, `tray-battery`, `tray-clock`, `show-desktop`, `quick-settings`.
Mac shell: `menubar`, `menu-system` (leftmost menu), `menu-app` (bold app-name menu), `menu-file`, `menu-edit`, `menu-view`, `menu-window`, `menu-help`, `menu-item-<id>`, `menubar-wifi`, `menubar-volume`, `menubar-battery`, `menubar-clock`, `menubar-search` (Spotlight), `control-center`, `dock`, `dock-<appId>`, `dock-trash`, `launchpad` (overlay), `launchpad-app-<appId>`, `launchpad-search`, `spotlight` (overlay), `spotlight-input`, `spotlight-result-<n>`.
Files app: `fm-sidebar-<Name>`, `fm-item-<name>`, `fm-address` (path/address bar), `fm-back`, `fm-forward`, `fm-up`, `fm-search`, `fm-new-folder`, `fm-new`, `fm-rename`, `fm-delete`, `fm-copy`, `fm-paste`, `fm-view`, `fm-content` (empty area), `fm-empty-bin`, `fm-restore`.
Editor app: `editor-text` (textarea), `editor-save`, `editor-menu-file`, `editor-save-as`, `save-dialog-name`, `save-dialog-save`, `save-dialog-folder-<name>`.
Browser: `browser-address`, `browser-tab-<n>`, `browser-back`, `browser-forward`, `browser-reload`, `browser-content`.
Settings: `settings-nav-<id>`, `settings-<key>` (controls).

## Combos handled by Frame/DesktopContext (system) — see `shortcuts.ts`
Windows: Alt+Tab, Alt+F4, Win+D, Win+Up/Down, Win (Start), Ctrl+Esc, Win+L. Mac: Cmd+Tab, Cmd+W, Cmd+M, Cmd+Q, Cmd+Space, Ctrl+Cmd+Q, F4 (Launchpad).

Power screen (both shells): `power-overlay`, `power-on-button`, `wake-button`, `power-restarting`; custom events `power-shutdown`, `power-sleep`, `power-wake`, `power-restart`, `power-on`.
