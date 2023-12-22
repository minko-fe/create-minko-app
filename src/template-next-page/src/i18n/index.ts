import { deepMerge, get, set } from '@minko-fe/lodash-pro'
import colors from 'picocolors'
import { isDev } from '@/utils/env'
import { FALLBACKLNG, LOCALE_PLACEHOLDER } from './setting'

function getAll(record: Record<string, any>, keys: string[], locale: string) {
  const result: Record<string, any> = {}
  for (const key of keys) {
    if (!key) continue
    const value = get(record, key)
    if (value) {
      set(result, key, value)
    } else if (isDev()) {
      console.warn(
        colors.yellow(`[i18n warning]: "${key}" is not found in locale "${locale}", fallback to "${FALLBACKLNG}"`),
      )
    }
  }
  return result
}

function ensureArray<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value]
}

export async function getLocale(
  locale: string = FALLBACKLNG,
  namespaces: string | string[],
  alwaysContain: string | string[] = ['common'], // 所有页面都包含的翻译加在这里
) {
  alwaysContain = ensureArray(alwaysContain)
  namespaces = ensureArray(namespaces)

  const defaultLocale = require(`../locales/${FALLBACKLNG}.json`)

  if (locale === FALLBACKLNG || locale === LOCALE_PLACEHOLDER) {
    return getAll(defaultLocale, [...alwaysContain, ...namespaces], locale)
  }

  const currentLocale = require(`../locales/${locale}.json`)

  return deepMerge(
    getAll(defaultLocale, [...alwaysContain, ...namespaces], locale),
    getAll(currentLocale, [...alwaysContain, ...namespaces], locale),
  )
}
