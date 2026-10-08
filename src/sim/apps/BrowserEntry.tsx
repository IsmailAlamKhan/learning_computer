// Lazy chunk for the simulated browser: the app plus every fictional site (sites self-register on import).
import.meta.glob('./browser/sites/*.tsx', { eager: true })
export { Browser } from './Browser'
