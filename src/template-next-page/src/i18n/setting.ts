import { type NextConfig } from 'next'
const { FALLBACKLNG: _FALLBACKLNG, LOCALES: _LOCALES } = require('./locale')

const FALLBACKLNG = _FALLBACKLNG as string
const LOCALES = _LOCALES as string[]

export { FALLBACKLNG, LOCALES }

export const i18n: NonNullable<NextConfig['i18n']> = {
  defaultLocale: FALLBACKLNG,
  locales: [...LOCALES],
}

export const LOCALE_COOKIE = 'NEXT_LOCALE'
