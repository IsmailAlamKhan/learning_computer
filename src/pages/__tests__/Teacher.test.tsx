import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Teacher from '../Teacher'
import { store } from '../../state/store'
import m02 from '../../content/lessons/m02'

const ui = () => (
  <MemoryRouter>
    <Teacher />
  </MemoryRouter>
)

const downloads: { name: string; text: string }[] = []
let anchorClick: ReturnType<typeof vi.spyOn>

beforeEach(() => {
  store.resetAll()
  downloads.length = 0
  URL.createObjectURL = vi.fn(() => 'blob:x')
  URL.revokeObjectURL = vi.fn()
  anchorClick = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (this: HTMLAnchorElement) {
    downloads.push({ name: this.download, text: '' })
  })
})
afterEach(() => {
  anchorClick.mockRestore()
  store.resetAll()
})

const seed = () => {
  const ids = m02.steps.filter((s) => s.osVariant !== 'mac').map((s) => s.id)
  store.setProfile({ name: 'রুমা', os: 'windows', motivation: 'ওয়েবসাইট বানাতে চাই', onboarded: true })
  store.visitModule(2)
  for (const id of ids.slice(0, 3)) store.markStepDone(2, 'windows', id)
  store.recordQuiz(2, { score: 1, total: m02.quiz.length, wrongByQuestion: { [m02.quiz[0].id]: 2, [m02.quiz[1].id]: 1 } })
  store.setRealWorldChecked(2, 0, true)
  store.markFreePracticeDone(2)
  store.completeModule(1)
  store.upsertNote({ id: 'n1', title: 'নোট', body: 'ক' })
}

describe('Teacher dashboard', () => {
  it('shows the empty state for a fresh profile', async () => {
    render(ui())
    expect(screen.getByRole('heading', { level: 1, name: 'শিক্ষকের পাতা' })).toBeTruthy()
    expect(screen.getByText(/শুধু এই কম্পিউটারের এই ব্রাউজারেই জমা/)).toBeTruthy()
    expect(screen.getByRole('heading', { name: /০\/২০ পাঠ সম্পন্ন/ })).toBeTruthy()
    expect(screen.getByText(/এখনো কোনো সনদ পাওয়া হয়নি/)).toBeTruthy()
    expect(screen.getByText(/এখনো কোনো পাঠ খোলা হয়নি/)).toBeTruthy()
    await waitFor(() => expect(screen.queryByText(/লোড হচ্ছে/)).toBeNull())
    expect(screen.getByText(/বিশেষ সমস্যা ধরা পড়েনি/)).toBeTruthy()
  })

  it('has an accessible 20-row table with caption and column/row headers, and status text (not colour only)', async () => {
    seed()
    render(ui())
    const table = screen.getByTestId('module-table')
    expect(within(table).getByText(/প্রতিটি পাঠের অবস্থা/).tagName).toBe('CAPTION')
    expect(table.querySelectorAll('thead th[scope="col"]').length).toBe(9)
    expect(table.querySelectorAll('tbody tr').length).toBe(20)
    expect(table.querySelectorAll('tbody th[scope="row"]').length).toBe(20)
    const rows = table.querySelectorAll('tbody tr')
    expect(rows[0].textContent).toContain('সম্পন্ন')
    expect(rows[1].textContent).toContain('চলছে')
    expect(rows[2].textContent).toContain('শুরু হয়নি')
  })

  it('shows overall progress, parts, and progress bars', () => {
    seed()
    render(ui())
    expect(screen.getByRole('heading', { name: /১\/২০ পাঠ সম্পন্ন/ })).toBeTruthy()
    const bars = screen.getAllByRole('progressbar')
    expect(bars).toHaveLength(3)
    expect(bars[0].getAttribute('aria-valuenow')).toBe('5')
    expect(bars[1].getAttribute('aria-valuenow')).toBe('8') // 1 of 13
    expect(bars[2].getAttribute('aria-valuenow')).toBe('0')
  })

  it('shows per-module step counts using real lesson data, quiz score and retries', async () => {
    seed()
    render(ui())
    const total = m02.steps.filter((s) => s.osVariant !== 'mac').length
    const totalMac = m02.steps.filter((s) => s.osVariant !== 'windows').length
    const table = screen.getByTestId('module-table')
    const row = () => table.querySelectorAll('tbody tr')[1]
    await waitFor(() => expect(row().textContent).toContain(`৩/${String(total).replace(/\d/g, (d) => '০১২৩৪৫৬৭৮৯'[Number(d)])}`))
    expect(row().textContent).toContain(`০/${String(totalMac).replace(/\d/g, (d) => '০১২৩৪৫৬৭৮৯'[Number(d)])}`)
    expect(row().textContent).toContain('সেরা ১/')
    expect(row().textContent).toContain('ভুল চেষ্টা ৩')
    expect(row().textContent).toContain('৬০%-এর কম')
    expect(row().textContent).toContain('✓ হয়েছে')
  })

  it('lists weak topics with question text, module link and suggestion', async () => {
    seed()
    render(ui())
    await waitFor(() => expect(screen.getAllByText(m02.quiz[0].questionBn).length).toBeGreaterThan(0))
    const weakTable = screen.getByText(/যেসব কুইজ-প্রশ্নে/).closest('table') as HTMLTableElement
    const rows = weakTable.querySelectorAll('tbody tr')
    expect(rows).toHaveLength(2)
    expect(rows[0].textContent).toContain(m02.quiz[0].questionBn) // most missed first
    expect(rows[0].textContent).toContain('২ বার')
    expect(rows[0].textContent).toContain('এই পাঠটি আবার দেখুন')
    expect(rows[0].querySelector('a')?.getAttribute('href')).toBe('/module/2')
    expect(screen.getByText(/যে পাঠগুলো আবার দেখা ভালো/)).toBeTruthy()
  })

  it('shows recent activity, notebook count', () => {
    seed()
    render(ui())
    const recent = screen.getByRole('heading', { name: 'সাম্প্রতিক কাজ' }).closest('section')!
    expect(within(recent).getByRole('link', { name: /২\. ডেস্কটপ ও স্ক্রিন/ })).toBeTruthy()
    expect(screen.getAllByText(/নোটবুকে নোট: ১টি/).length).toBeGreaterThan(0)
  })

  it('shows certificates earned', () => {
    store.setProfile({ name: 'রুমা', onboarded: true })
    store.addCertificate(1)
    render(ui())
    expect(screen.getByText(/পর্ব ১-এর সনদ — রুমা/)).toBeTruthy()
  })

  it('exports the JSON backup and the HTML report as downloads', async () => {
    seed()
    render(ui())
    fireEvent.click(screen.getByRole('button', { name: /ব্যাকআপ নামান/ }))
    fireEvent.click(screen.getByRole('button', { name: /রিপোর্ট নামান/ }))
    expect(downloads.map((d) => d.name.replace(/\d{4}-\d{2}-\d{2}/, 'DATE'))).toEqual([
      'computer-shikhi-backup-DATE.json',
      'computer-shikhi-report-DATE.html',
    ])
    expect(screen.getAllByRole('status').length).toBeGreaterThan(0)
  })

  it('print button calls window.print', () => {
    const print = vi.spyOn(window, 'print').mockImplementation(() => {})
    render(ui())
    fireEvent.click(screen.getByRole('button', { name: /ছাপুন/ }))
    expect(print).toHaveBeenCalled()
    print.mockRestore()
  })

  it('mentions how to back up', () => {
    render(ui())
    expect(screen.getByText(/ব্যাকআপ নামান” বোতামে চেপে/)).toBeTruthy()
    expect(screen.getByRole('link', { name: 'সেটিংস' }).getAttribute('href')).toBe('/settings')
  })
})
