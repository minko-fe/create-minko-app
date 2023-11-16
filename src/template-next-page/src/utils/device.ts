import { isBrowser } from '@minko-fe/lodash-pro'
import { detect } from 'un-detector'

function getUA() {
  let useragent = ''
  if (isBrowser()) {
    useragent = navigator.userAgent
  } else {
    useragent = globalThis.__NEXT_DATA_HEADERS__?.['user-agent'] || ''
  }
  return useragent
}

export const OS = {
  isAndroid: () => detect(getUA()).isAndroid,
  isIOS: () => detect(getUA()).isIOS,
  isMac: () => detect(getUA()).isMac,
  isWindows: () => detect(getUA()).isWindows,
  isMobile: () => detect(getUA()).isMobile,
}
