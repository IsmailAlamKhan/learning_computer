import { describe, expect, it } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderApp } from './testUtils'

describe('photos', () => {
  it('shows the image and steps through siblings', () => {
    const rig = renderApp('windows')
    const f = rig.d().vfs.resolve('~/Pictures/Flower.png')!
    rig.open('photos', { nodeId: f.id }, true)
    expect(rig.q('photos-name').textContent).toBe('Flower.png')
    fireEvent.click(rig.q('photos-next'))
    expect(rig.q('photos-name').textContent).toBe('River.jpg')
    fireEvent.click(rig.q('photos-prev'))
    expect(rig.q('photos-name').textContent).toBe('Flower.png')
    fireEvent.click(rig.q('photos-zoom-in'))
    expect(rig.q('photos-zoom').textContent).toBe('125%')
  })

  it('shows the Pictures folder as thumbnails without a file', () => {
    const rig = renderApp('mac', 'photos')
    fireEvent.click(rig.q('photos-thumb-River.jpg'))
    expect(rig.q('photos-name').textContent).toBe('River.jpg')
  })
})
