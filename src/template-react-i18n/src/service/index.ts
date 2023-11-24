import { AxiosPro, type AxiosTransform, type CreateAxiosOptions } from '@minko-fe/axios-pro'

export * from '@minko-fe/axios-pro'

const transform: AxiosTransform = {
  requestInterceptors: (config) => {
    config.headers = Object.assign({}, config.headers)
    config.headers.Accept = config.headers.accept

    try {
      if (window.LoginCredential) {
        config.headers!['Login-Credential'] = window.LoginCredential
      }
    } catch {}

    return config
  },
}

function createRequest(opt?: Partial<CreateAxiosOptions>) {
  return new AxiosPro(opt || {})
}

export const request = createRequest({
  transform,
  withCredentials: true,
  requestOptions: {
    urlPrefix: import.meta.env.VITE_API_ORIGIN,
  },
})
