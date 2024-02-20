import normalize from 'normalize-path'

export function getBase() {
  let p

  if (import.meta.env?.PUBLIC_BASEURL) {
    p = import.meta.env.PUBLIC_BASEURL
  } else if (typeof process !== 'undefined') {
    p = process.env.PUBLIC_BASEURL
  }
  return normalize(`${`${p}` ?? '/'}`, false)
}

export function getLibAssets(url: string) {
  return normalize(`${getBase()}${url}`)
}

export function isBrowser() {
  return typeof window !== 'undefined' && typeof window.scrollY === 'number'
}
