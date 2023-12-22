import { type NextConfig } from 'next'
const { FALLBACKLNG: _FALLBACKLNG, LOCALES: _LOCALES, LOCALE_PLACEHOLDER: _LOCALE_PLACEHOLDER } = require('./locale')

export const FALLBACKLNG = _FALLBACKLNG as string
export const LOCALES = _LOCALES as string[]
export const LOCALE_PLACEHOLDER = _LOCALE_PLACEHOLDER as string

export const i18n: NonNullable<NextConfig['i18n']> = {
  defaultLocale: FALLBACKLNG,
  locales: [...LOCALES],
}

export const LOCALE_COOKIE = 'NEXT_LOCALE'
