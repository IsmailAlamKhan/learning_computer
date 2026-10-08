import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import SignupForm from '../signup-form'
import EmailParts from '../email-parts'
import { passwordRules, signupProblems, usernameProblem } from '../lib/signupLogic'
import { addressParts } from '../lib/emailParts'

describe('signup logic', () => {
  it('password rules', () => {
    expect(passwordRules('abc').some((r) => !r.ok)).toBe(true)
    expect(passwordRules('rice2024bhat').every((r) => r.ok)).toBe(true)
    expect(passwordRules('mypassword1').find((r) => r.id === 'name')?.ok).toBe(false)
    expect(passwordRules('anika12345', 'anika').find((r) => r.id === 'name')?.ok).toBe(false)
  })
  it('username and whole-form problems', () => {
    expect(usernameProblem('has space')).toBeTruthy()
    expect(usernameProblem('ab')).toBeTruthy()
    expect(usernameProblem('anika_r')).toBeNull()
    expect(Object.keys(signupProblems({ name: '', email: 'x', username: '', password: '' })).sort()).toEqual(['email', 'name', 'password', 'username'])
    expect(signupProblems({ name: 'Anika', email: 'anika@mail.example', username: 'anika_r', password: 'rice2024bhat' })).toEqual({})
  })
  it('splits addresses', () => {
    expect(addressParts('a.b@mail.example')).toEqual({ name: 'a.b', domain: 'mail.example', valid: true })
    expect(addressParts('nope').valid).toBe(false)
    expect(addressParts('a@b').valid).toBe(false)
  })
})

describe('widgets', () => {
  it('signup: shows friendly errors, then the verification email, then verified', () => {
    render(<SignupForm />)
    fireEvent.click(screen.getByTestId('signup-submit'))
    expect(screen.getAllByRole('alert').length).toBeGreaterThan(0)
    fireEvent.change(screen.getByTestId('signup-name'), { target: { value: 'Anika Rahman' } })
    fireEvent.change(screen.getByTestId('signup-email'), { target: { value: 'anika@mail.example' } })
    fireEvent.change(screen.getByTestId('signup-username'), { target: { value: 'anika_r' } })
    fireEvent.change(screen.getByTestId('signup-password'), { target: { value: 'rice2024bhat' } })
    fireEvent.click(screen.getByTestId('signup-submit'))
    expect(screen.getByTestId('signup-inbox')).toBeInTheDocument()
    fireEvent.click(screen.getByTestId('signup-verify'))
    expect(screen.getByTestId('signup-done')).toBeInTheDocument()
  })
  it('email parts reacts to typing', () => {
    render(<EmailParts />)
    fireEvent.change(screen.getByLabelText('Email address'), { target: { value: 'rina@school.example' } })
    expect(screen.getByTestId('email-parts-view').textContent).toContain('school.example')
    expect(screen.getByTestId('email-parts-verdict').textContent).toMatch(/ঠিক গড়নের/)
  })
})
