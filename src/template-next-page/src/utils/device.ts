import { isBrowser } from '@minko-fe/lodash-pro'
import { device, os } from 'un-detector'

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
  isAndroid: os.isAndroid(getUA()),
  isIOS: () => os.isIOS(getUA()),
  isMac: () => os.isMac(getUA()),
  isWindows: () => os.isWindows(getUA()),
  isMobile: () => device.isMobile(getUA()),
}
