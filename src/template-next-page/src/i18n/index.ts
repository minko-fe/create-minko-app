import { deepMerge, get, set } from '@minko-fe/lodash-pro'
import colors from 'picocolors'
import { isDev } from '@/utils/env'
import { FALLBACKLNG } from './setting'

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

export async function getLocale(locale: string, namespaces: string | string[], alwaysContain: string | string[] = []) {
  if (!Array.isArray(alwaysContain)) {
    alwaysContain = [alwaysContain]
  }
  if (!Array.isArray(namespaces)) {
    namespaces = [namespaces]
  }

  const defaultLocale = require(`../locales/${FALLBACKLNG}.json`)
  const currentLocale = require(`../locales/${locale}.json`)

  return deepMerge(
    getAll(defaultLocale, [...alwaysContain, ...namespaces], locale),
    getAll(currentLocale, [...alwaysContain, ...namespaces], locale),
  )
}