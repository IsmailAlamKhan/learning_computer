import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { ART_PART2 } from '../art/part2'
import type { ArtName } from '../names'

const PART2_NAMES: ArtName[] = [
  'globe', 'wifi', 'cloud', 'server', 'link', 'browser', 'tab', 'download', 'upload', 'envelope', 'inbox', 'paperclip', 'user', 'id-card',
  'lock', 'key', 'shield', 'warning', 'fishing-hook', 'sms', 'otp-code', 'wallet', 'bank', 'qr-code', 'chat-bubble', 'social-feed', 'video-play',
  'code-brackets', 'terminal', 'brain', 'binary', 'robot', 'tea-cup', 'cooking-pot', 'book', 'flowchart', 'loop', 'branch', 'html-tag',
  'css-brush', 'python-snake', 'braces', 'package-box', 'rocket', 'puzzle', 'stairs', 'recipe-card',
  'trophy', 'star', 'medal', 'confetti', 'flame', 'heart', 'thumbs-up', 'sparkles', 'target', 'crown', 'gift', 'flag',
  'didi', 'didi-wave', 'didi-think', 'didi-cheer', 'didi-point',
]

describe('art part 2', () => {
  it.each(PART2_NAMES)('%s renders an accessible 200x200 svg', (name) => {
    const Art = ART_PART2[name]
    expect(Art).toBeDefined()
    const { container } = render(Art!({ size: 64 }) as never)
    const svg = container.querySelector('svg[role="img"]')
    expect(svg).not.toBeNull()
    expect(svg!.getAttribute('viewBox')).toBe('0 0 200 200')
    expect((svg!.getAttribute('aria-label') ?? '').trim().length).toBeGreaterThan(0)
  })
  it('honours a custom title', () => {
    const Art = ART_PART2.didi!
    const { container } = render(<Art title="কোচ" />)
    expect(container.querySelector('svg')!.getAttribute('aria-label')).toBe('কোচ')
  })
})
