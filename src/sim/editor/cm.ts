/** CodeMirror 6 building blocks of the Code Editor: languages, light/dark themes, error-line marker. */
import { EditorState, RangeSet, StateEffect, StateField, type Extension } from '@codemirror/state'
import { Decoration, EditorView, GutterMarker, gutterLineClass, highlightActiveLine, highlightActiveLineGutter, keymap, lineNumbers, type DecorationSet } from '@codemirror/view'
import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands'
import { bracketMatching, HighlightStyle, indentOnInput, indentUnit, syntaxHighlighting } from '@codemirror/language'
import { closeBrackets, closeBracketsKeymap } from '@codemirror/autocomplete'
import { html } from '@codemirror/lang-html'
import { css } from '@codemirror/lang-css'
import { javascript } from '@codemirror/lang-javascript'
import { python } from '@codemirror/lang-python'
import { tags as t } from '@lezer/highlight'
import { fileKindOf } from './logic'

export function languageExtension(name: string): Extension {
  switch (fileKindOf(name)) {
    case 'html':
      return [html(), indentUnit.of('  ')]
    case 'css':
      return [css(), indentUnit.of('  ')]
    case 'javascript':
      return [javascript(), indentUnit.of('  ')]
    case 'python':
      return [python(), indentUnit.of('    ')]
    default:
      return indentUnit.of('  ')
  }
}

// No italics: slanted Bengali conjuncts are hard to read.
const lightHighlight = HighlightStyle.define([
  { tag: [t.keyword, t.controlKeyword, t.moduleKeyword, t.definitionKeyword, t.operatorKeyword], color: '#6a1fb0', fontWeight: '600' },
  { tag: [t.string, t.special(t.string), t.regexp], color: '#0a6a38' },
  { tag: [t.comment, t.lineComment, t.blockComment], color: '#566370' },
  { tag: [t.number, t.bool, t.null, t.atom], color: '#a84300' },
  { tag: [t.function(t.variableName), t.function(t.propertyName), t.definition(t.variableName)], color: '#0b4fa8' },
  { tag: [t.tagName, t.angleBracket], color: '#a4161a' },
  { tag: [t.attributeName, t.propertyName], color: '#0b4fa8' },
  { tag: [t.attributeValue], color: '#0a6a38' },
  { tag: [t.className, t.typeName, t.namespace], color: '#8a4b00' },
  { tag: [t.heading], fontWeight: '700' },
  { tag: [t.invalid], color: '#b00020' },
])
const darkHighlight = HighlightStyle.define([
  { tag: [t.keyword, t.controlKeyword, t.moduleKeyword, t.definitionKeyword, t.operatorKeyword], color: '#d8b4fe', fontWeight: '600' },
  { tag: [t.string, t.special(t.string), t.regexp], color: '#86efac' },
  { tag: [t.comment, t.lineComment, t.blockComment], color: '#a6b0bd' },
  { tag: [t.number, t.bool, t.null, t.atom], color: '#fdba74' },
  { tag: [t.function(t.variableName), t.function(t.propertyName), t.definition(t.variableName)], color: '#7dd3fc' },
  { tag: [t.tagName, t.angleBracket], color: '#fca5a5' },
  { tag: [t.attributeName, t.propertyName], color: '#7dd3fc' },
  { tag: [t.attributeValue], color: '#86efac' },
  { tag: [t.className, t.typeName, t.namespace], color: '#fcd34d' },
  { tag: [t.heading], fontWeight: '700' },
  { tag: [t.invalid], color: '#ff8a8a' },
])

const base = (dark: boolean) =>
  EditorView.theme(
    {
      '&': { height: '100%', color: dark ? '#e8eaed' : '#1b1f24', backgroundColor: dark ? '#1c1e26' : '#ffffff', fontSize: '15px' },
      '.cm-scroller': { fontFamily: 'var(--font-mono)', lineHeight: '1.6', overflow: 'auto' },
      '.cm-content': { caretColor: dark ? '#ffffff' : '#000000', userSelect: 'text', WebkitUserSelect: 'text', padding: '6px 0' },
      '.cm-line': { padding: '0 8px' },
      '&.cm-focused': { outline: '2px solid #2563eb', outlineOffset: '-2px' },
      '.cm-gutters': { backgroundColor: dark ? '#171921' : '#f3f4f6', color: dark ? '#a6b0bd' : '#5b6470', border: 'none', borderRight: `1px solid ${dark ? '#2e3140' : '#e2e5ea'}` },
      '.cm-activeLine': { backgroundColor: dark ? '#262a36' : '#eef4ff' },
      '.cm-activeLineGutter': { backgroundColor: dark ? '#262a36' : '#e4edfd', color: dark ? '#ffffff' : '#111827' },
      '.cm-selectionBackground, ::selection': { backgroundColor: dark ? '#3b5a9a !important' : '#b6d4fe !important' },
      '&.cm-focused .cm-selectionBackground, &.cm-focused ::selection': { backgroundColor: dark ? '#3b5a9a !important' : '#b6d4fe !important' },
      '.cm-matchingBracket': { backgroundColor: dark ? '#3f5f3f' : '#c8f0c8', outline: `1px solid ${dark ? '#86efac' : '#0a6a38'}` },
      '.cm-nonmatchingBracket': { backgroundColor: dark ? '#6b2b2b' : '#ffd5d5' },
      '.cm-errorLine': { backgroundColor: dark ? '#4a2326' : '#ffe3e3' },
      '.cm-errorGutter': { backgroundColor: dark ? '#7f2a30' : '#ffb4b4', color: dark ? '#fff' : '#7a0000', fontWeight: '700' },
    },
    { dark },
  )

export function themeExtension(dark: boolean): Extension {
  return [base(dark), syntaxHighlighting(dark ? darkHighlight : lightHighlight)]
}

// ---------- error line ----------
export const setErrorLine = StateEffect.define<number | null>()
class ErrMarker extends GutterMarker {
  elementClass = 'cm-errorGutter'
}
const errMarker = new ErrMarker()
interface ErrState {
  line: number | null
}
export const errorLineField = StateField.define<ErrState>({
  create: () => ({ line: null }),
  update(v, tr) {
    for (const e of tr.effects) if (e.is(setErrorLine)) return { line: e.value }
    if (tr.docChanged && v.line !== null) return { line: null }
    return v
  },
  provide: (f) => [
    EditorView.decorations.compute([f], (s): DecorationSet => {
      const { line } = s.field(f)
      if (!line || line < 1 || line > s.doc.lines) return Decoration.none
      return Decoration.set([Decoration.line({ class: 'cm-errorLine' }).range(s.doc.line(line).from)])
    }),
    gutterLineClass.compute([f], (s): RangeSet<GutterMarker> => {
      const { line } = s.field(f)
      if (!line || line < 1 || line > s.doc.lines) return RangeSet.empty
      return RangeSet.of([errMarker.range(s.doc.line(line).from)])
    }),
  ],
})

export interface BuildOpts {
  fileName: string
  dark: boolean
}

/** Extensions that do not depend on the file: line numbers, history, brackets, keymaps. */
export function coreExtensions(): Extension[] {
  return [
    lineNumbers(),
    highlightActiveLineGutter(),
    highlightActiveLine(),
    history(),
    indentOnInput(),
    bracketMatching(),
    closeBrackets(),
    EditorView.lineWrapping,
    errorLineField,
    keymap.of([...closeBracketsKeymap, ...defaultKeymap, ...historyKeymap, indentWithTab]),
    EditorState.tabSize.of(4),
    EditorView.contentAttributes.of({ 'aria-label': 'Code editor', spellcheck: 'false', autocorrect: 'off', autocapitalize: 'off' }),
  ]
}
