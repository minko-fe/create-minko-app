import { AxiosPro, CONTENT_TYPE } from '@minko-fe/axios-pro'
import { isBrowser } from '@minko-fe/lodash-pro'
import { isDev } from '@/utils/env'
import logger from './logger'

const requestServer = new AxiosPro({
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
      if (process.env.NODE_ENV && !isBrowser() && isDev()) {
        logger.info(`server request url: ${config.url}`)
      }

      config.headers = config.headers || {}

      return config
    },
    async responseInterceptorsCatch(e) {
      if (e.status) {
        if (process.env.NODE_ENV && !isBrowser()) {
          logger.error(e)
        }
      }
    },
    requestCatchHook: (error) => {
      const { response } = error || {}
      logger.error(error.message)
      return {
        success: false,
        result: response?.data || null,
        nativeResponse: response,
      }
    },
  },
})

export { requestServer }
