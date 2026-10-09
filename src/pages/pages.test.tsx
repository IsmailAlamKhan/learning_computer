import { act, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import Onboarding from './Onboarding'
import Settings from './Settings'
import Glossary from './Glossary'
import { store } from '../state/store'
import { INPUT_MANUAL_KEY } from '../lib/useInputDetection'

const ui = (el: React.ReactElement) => render(<MemoryRouter>{el}</MemoryRouter>)
const setNav = (o: Record<string, unknown>) => {
  for (const [k, v] of Object.entries(o)) vi.spyOn(navigator, k as never, 'get').mockReturnValue(v as never)
}

beforeEach(() => store.resetAll())
afterEach(() => vi.restoreAllMocks())

describe('Onboarding detection flow', () => {
  const toOs = async (u: ReturnType<typeof userEvent.setup>) => {
    await u.type(screen.getByLabelText(/আপনার নাম কী/), 'রুমা')
    await u.click(screen.getByRole('button', { name: /পরের ধাপ/ }))
  }
  it('Windows detected: shows the confirmation chip, never asks about touchpad or mouse', async () => {
    setNav({ userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', platform: 'Win32' })
    const u = userEvent.setup()
    ui(<Onboarding />)
    await toOs(u)
    expect(screen.getByTestId('detected-os').textContent).toContain('Windows')
    expect(screen.queryByRole('radio', { name: /Mac/ })).toBeNull()
    expect(document.body.textContent).not.toMatch(/টাচপ্যাড|মাউস/)
    await u.click(screen.getByRole('button', { name: /ঠিক নয়/ }))
    expect(screen.getByRole('radio', { name: 'Mac' })).toBeTruthy()
  })
  it('unknown OS: asks with two cards; saves profile with autoDetected', async () => {
    setNav({ userAgent: 'Mozilla/5.0 (X11; Linux x86_64)', platform: 'Linux x86_64' })
    const u = userEvent.setup()
    ui(<Onboarding />)
    await toOs(u)
    await u.click(screen.getByRole('radio', { name: 'Mac' }))
    await u.click(screen.getByRole('button', { name: /পরের ধাপ/ }))
    await u.click(screen.getByRole('button', { name: /পরের ধাপ/ }))
    await u.click(screen.getByRole('button', { name: 'চাকরির জন্য' }))
    await u.click(screen.getByRole('button', { name: /শুরু করি/ }))
    expect(store.getSnapshot().profile).toMatchObject({ name: 'রুমা', os: 'mac', autoDetected: true, motivation: 'চাকরির জন্য', onboarded: true })
  })
})

describe('Settings overrides', () => {
  it('shows the detected note and lets her override OS, pointing device and daily goal', async () => {
    store.setProfile({ onboarded: true, os: 'windows', input: 'mouse', autoDetected: true })
    const u = userEvent.setup()
    ui(<Settings />)
    expect(screen.getByTestId('auto-note').textContent).toContain('নিজে থেকেই চেনা হয়েছে')
    await u.click(screen.getByRole('radio', { name: /Mac/ }))
    expect(store.getSnapshot().profile.os).toBe('mac')
    await u.click(screen.getByRole('radio', { name: /টাচপ্যাড/ }))
    expect(store.getSnapshot().profile.input).toBe('touchpad')
    expect(store.getSnapshot().extras[INPUT_MANUAL_KEY]).toBe(true)
    expect(screen.queryByTestId('auto-note')).toBeNull()
    await u.click(screen.getByRole('radio', { name: /৩টি/ }))
    expect(store.getSnapshot().settings.dailyGoal).toBe(3)
  })
})

describe('Glossary', () => {
  it('flips a card and runs the flashcard flow with remembered known words', async () => {
    const u = userEvent.setup()
    const { container } = ui(<Glossary />)
    const first = container.querySelector('[data-testid="glossary-card"] .flip') as HTMLElement
    expect(first.dataset.flipped).toBe('false')
    await u.click(first.querySelector('button')!)
    expect(first.dataset.flipped).toBe('true')

    await u.click(screen.getByRole('button', { name: 'শব্দ ফ্ল্যাশকার্ড' }))
    const card = () => screen.getByTestId('flashcards').querySelector('.flip') as HTMLElement
    expect(card().dataset.flipped).toBe('false')
    fireEvent.keyDown(window, { key: ' ' })
    expect(card().dataset.flipped).toBe('true')
    await u.click(screen.getByRole('button', { name: /জানতাম/ }))
    expect((store.getSnapshot().extras.flashKnown as string[]).length).toBe(1)
    expect(card().dataset.flipped).toBe('false')
    act(() => void fireEvent.keyDown(window, { key: 'ArrowRight' }))
    await u.click(screen.getByRole('button', { name: /আবার দেখব/ }))
    expect((store.getSnapshot().extras.flashKnown as string[]).length).toBe(1)
  })
})
