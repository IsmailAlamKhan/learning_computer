/**
 * Names of the original flat illustrations ("art") and annotated mini-screenshots ("mocks") that lesson cards may use.
 * Lesson authors may ONLY use names listed here. Implementations live in art/*.tsx (ART registry) and mocks.tsx (MOCKS registry).
 */
export const ART_NAMES = [
  // hardware
  'laptop', 'desktop-pc', 'monitor', 'keyboard', 'mouse', 'touchpad', 'speaker', 'webcam', 'battery', 'charger', 'usb-stick',
  'power-button', 'plug', 'headphones', 'printer', 'phone', 'tablet', 'camera', 'microphone', 'router', 'hard-drive', 'chip', 'ram-stick',
  // files & operating system
  'desktop', 'window', 'folder', 'folder-open', 'file', 'document', 'image', 'music', 'video', 'zip', 'trash', 'almirah',
  'path-map', 'magnifier', 'bookmark', 'clipboard', 'copy', 'scissors', 'paste', 'undo', 'save-disk', 'pencil', 'notebook', 'taskbar', 'dock', 'start-button', 'cursor-arrow', 'hand-click',
  // internet & accounts & safety
  'globe', 'wifi', 'cloud', 'server', 'link', 'browser', 'tab', 'download', 'upload', 'envelope', 'inbox', 'paperclip', 'user', 'id-card',
  'lock', 'key', 'shield', 'warning', 'fishing-hook', 'sms', 'otp-code', 'wallet', 'bank', 'qr-code', 'chat-bubble', 'social-feed', 'video-play',
  // settings
  'gear', 'sun', 'moon', 'volume', 'bluetooth', 'clock', 'calendar', 'language', 'paint-palette', 'text-size',
  // troubleshooting
  'bug', 'wrench', 'refresh', 'power', 'freeze', 'lightbulb', 'question', 'check', 'cross', 'sos',
  // programming & thinking
  'code-brackets', 'terminal', 'brain', 'binary', 'robot', 'tea-cup', 'cooking-pot', 'book', 'flowchart', 'loop', 'branch', 'html-tag',
  'css-brush', 'python-snake', 'braces', 'package-box', 'rocket', 'puzzle', 'stairs', 'recipe-card',
  // rewards
  'trophy', 'star', 'medal', 'confetti', 'flame', 'heart', 'thumbs-up', 'sparkles', 'target', 'crown', 'gift', 'flag',
  // the mentor ("didi") — original character, several expressions
  'didi', 'didi-wave', 'didi-think', 'didi-cheer', 'didi-point',
] as const
export type ArtName = (typeof ART_NAMES)[number]

/** Annotated mini-screenshots of the simulated OS (SVG). `highlight` is one of the region names listed for the mock. */
export const MOCK_REGIONS = {
  'win-desktop': ['icons', 'taskbar', 'start', 'tray', 'recycle-bin'],
  'mac-desktop': ['icons', 'menubar', 'dock', 'trash'],
  'win-taskbar': ['start', 'search', 'apps', 'tray', 'clock'],
  'mac-dock': ['finder', 'launchpad', 'apps', 'trash'],
  'mac-menubar': ['system-menu', 'app-menu', 'status', 'clock'],
  'win-titlebar': ['title', 'minimize', 'maximize', 'close'],
  'mac-titlebar': ['close', 'minimize', 'zoom', 'title'],
  'win-start-menu': ['search', 'pinned', 'power'],
  'mac-launchpad': ['search', 'apps'],
  'file-explorer': ['sidebar', 'address-bar', 'files', 'new-button', 'view-menu'],
  'finder': ['sidebar', 'path-bar', 'files', 'toolbar'],
  'context-menu': ['new', 'rename', 'delete', 'copy', 'paste'],
  'save-dialog': ['folder', 'file-name', 'save-button'],
  'notepad': ['text', 'file-menu', 'title'],
  'browser': ['address-bar', 'tabs', 'back', 'search-box', 'padlock'],
  'mail': ['folders', 'compose', 'to', 'subject', 'attach'],
  'terminal-win': ['prompt', 'output'],
  'terminal-mac': ['prompt', 'output'],
  'code-editor': ['explorer', 'editor', 'run', 'preview', 'output'],
  'settings-win': ['sidebar', 'wifi', 'display', 'time'],
  'settings-mac': ['sidebar', 'wifi', 'display', 'keyboard'],
  'task-manager': ['processes', 'end-task'],
  'force-quit': ['app-list', 'force-quit-button'],
  'keyboard-keys': ['ctrl', 'cmd', 'alt', 'shift', 'tab', 'enter', 'esc', 'backspace', 'arrows'],
  'url-bar': ['protocol', 'domain', 'path'],
  'path-bar-win': ['drive', 'folders', 'file'],
  'path-bar-mac': ['root', 'folders', 'file'],
} as const
export type MockName = keyof typeof MOCK_REGIONS
export const MOCK_NAMES = Object.keys(MOCK_REGIONS) as MockName[]
