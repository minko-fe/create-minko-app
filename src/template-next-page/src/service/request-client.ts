import { AxiosPro, CONTENT_TYPE } from '@minko-fe/axios-pro'
import Cookies from 'js-cookie'
import { LOCALE_COOKIE, LOCALE_MAP } from '@/i18n/setting'
import { isDev } from '@/utils/env'
import { CLIENT_LANGUAGE, LOGIN_CREDENTIAL, UA } from './const'

const requestClient = new AxiosPro({
  withCredentials: true,
  requestOptions: {
    apiUrl: process.env.NEXT_PUBLIC_API_URL,
    post: {
      headers: {
        'Content-Type': CONTENT_TYPE.JSON,
      },
    },
  },
  transform: {
    requestInterceptors(config) {
      config.headers = Object.assign({}, config.headers)
      config.headers.Accept = config.headers.accept

      try {
        const loginCredential = Cookies.get(LOGIN_CREDENTIAL)
        config.headers![LOGIN_CREDENTIAL] = loginCredential

        const locale = Cookies.get(LOCALE_COOKIE) || ''
        config.headers[CLIENT_LANGUAGE] = LOCALE_MAP[locale] || locale
      } catch {}

      return config
    },
    async responseInterceptorsCatch(e) {
      if (e.response.status === 401) {
        if (isDev()) return

        Cookies.remove(LOGIN_CREDENTIAL)
        // todo 重定向
        throw new Error(e.message)
      }
      return e
    },
  },
})

export { requestClient }
