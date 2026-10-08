import { describe, expect, it } from 'vitest'
import { absolutePath, buildTree, challengeChain, challengeSolved, convertChain, describeParts, homeChain, homePath, isFolder, nodeAt, relativePath } from './pathExplorer'

describe('pathExplorer logic', () => {
  it('builds absolute paths for both styles', () => {
    expect(absolutePath('windows', ['C:', 'Users', 'Anika', 'Documents'])).toBe('C:\\Users\\Anika\\Documents')
    expect(absolutePath('windows', ['C:'])).toBe('C:\\')
    expect(absolutePath('mac', ['Users', 'anika', 'Documents'])).toBe('/Users/anika/Documents')
    expect(absolutePath('mac', [])).toBe('/')
  })

  it('shortens to ~ inside the home folder only', () => {
    expect(homePath('mac', ['Users', 'anika', 'Documents', 'Family'])).toBe('~/Documents/Family')
    expect(homePath('mac', ['Users', 'anika'])).toBe('~')
    expect(homePath('windows', ['C:', 'Users', 'Anika', 'Pictures'])).toBe('~\\Pictures')
    expect(homePath('windows', ['C:', 'Windows'])).toBeNull()
  })

  it('computes relative paths with .. and .', () => {
    const docs = ['Users', 'anika', 'Documents']
    expect(relativePath('mac', docs, [...docs, 'Family', 'Birthdays.txt'])).toBe('Family/Birthdays.txt')
    expect(relativePath('mac', docs, ['Users', 'anika', 'Pictures', 'Flower.png'])).toBe('../Pictures/Flower.png')
    expect(relativePath('mac', docs, docs)).toBe('.')
    expect(relativePath('mac', [...docs, 'Family'], ['Users', 'anika'])).toBe('../..')
    const wdocs = ['C:', 'Users', 'Anika', 'Documents']
    expect(relativePath('windows', wdocs, ['C:', 'Windows'])).toBe('..\\..\\..\\Windows')
    expect(relativePath('windows', wdocs, [...wdocs, 'Recipe.txt'])).toBe('Recipe.txt')
  })

  it('looks nodes up in the practice disk', () => {
    expect(nodeAt('windows', ['C:', 'Users', 'Anika', 'Documents', 'Family', 'Birthdays.txt'])?.kind).toBe('file')
    expect(nodeAt('mac', ['Users', 'anika', 'Nope'])).toBeUndefined()
    expect(nodeAt('windows', ['D:'])).toBeUndefined()
    expect(isFolder('mac', ['Users'])).toBe(true)
    expect(buildTree('mac').name).toBe('')
  })

  it('labels the parts of a path (drive / folder / file)', () => {
    expect(describeParts('windows', ['C:', 'Users', 'Anika', 'Documents', 'Recipe.txt']).map((p) => p.role)).toEqual(['drive', 'folder', 'folder', 'folder', 'file'])
    expect(describeParts('mac', ['Users', 'anika']).map((p) => p.role)).toEqual(['folder', 'folder'])
  })

  it('converts a chain when switching style', () => {
    expect(convertChain(['C:', 'Users', 'Anika', 'Documents'], 'windows', 'mac')).toEqual(['Users', 'anika', 'Documents'])
    expect(convertChain(['Users', 'anika', 'Pictures'], 'mac', 'windows')).toEqual(['C:', 'Users', 'Anika', 'Pictures'])
    expect(convertChain(['C:', 'Windows'], 'windows', 'mac')).toEqual(homeChain('mac'))
  })

  it('checks the challenge', () => {
    expect(challengeSolved('windows', challengeChain('windows'))).toBe(true)
    expect(challengeSolved('mac', ['Users', 'anika', 'Documents', 'Family'])).toBe(false)
    expect(challengeSolved('mac', challengeChain('windows'))).toBe(false)
    expect(absolutePath('mac', challengeChain('mac'))).toBe('/Users/anika/Documents/Family/Birthdays.txt')
  })
})
