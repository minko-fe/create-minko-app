import { assign, isNil, isString } from '@minko-fe/lodash-pro'
import { type GetServerSidePropsContext } from 'next'
import parseUrl from 'parse-url'
import { type TDKProps } from '@/components/TDK'
import { getLocale } from '@/i18n'

type InServerSideProps = {
  messages: string[]
  tdk?: TDKProps | string
  x?: Record<string, any>
  auth?: boolean
}

export const DEFAULT_TDK = {
  title: 'title',
  description: 'description',
  keywords: 'keywords',
}

function convertNilToEmptyString<T = Record<string, any>>(obj: T | undefined): T | null {
  if (!obj) return null
  Object.keys(obj).forEach((k) => {
    if (isNil(obj[k])) {
      obj[k] = ''
    }
  })
  return obj
}

export function _getServerSideProps(props: InServerSideProps) {
  const { messages, x, auth } = props

  let { tdk } = props

  return async function getServerSideProps(ctx: GetServerSidePropsContext) {
    let xUrl: ReturnType<typeof parseUrl> = {} as any

    try {
      const protocol = ctx.req.headers['x-forwarded-proto']
      const host = ctx.req.headers['host']

      xUrl = parseUrl(`${protocol}://${host}/${ctx.locale}${ctx.resolvedUrl}`)
    } catch (e) {
      console.error(e)
    }

    if (auth) {
      const authorized = true // 自行检查权限
      if (!authorized) {
        return {
          redirect: {
            destination: '/tmp-login', // 自定义重定向
            permanent: false,
          },
        }
      }
    }

    try {
      if (tdk && isString(tdk)) {
        tdk = {} // 可从后端请求tdk
      }
    } catch {}

    globalThis.__NEXT_DATA_HEADERS__ = ctx.req.headers

    return {
      props: {
        messages: await getLocale(ctx.locale, messages),
        ctx: convertNilToEmptyString({
          pathname: xUrl.pathname,

          /* ------------------ Nextjs ------------------ */
          resolvedUrl: ctx.resolvedUrl,
          query: ctx.query,
          locale: ctx.locale,
          defaultLocale: ctx.defaultLocale,
          locales: ctx.locales,
          headers: ctx.req.headers,
          cookies: ctx.req.cookies,
        }),
        tdk: convertNilToEmptyString(assign(DEFAULT_TDK, tdk as TDKProps)),
        x: convertNilToEmptyString(x),
      },
    }
  }
}

type RemovePromise<T> = T extends Promise<infer U> ? U : T

export type AppPropsFromServer = RemovePromise<ReturnType<ReturnType<typeof _getServerSideProps>>>['props']

export type ServerSideProps<T extends Record<string, any> = Record<string, any>> = Omit<AppPropsFromServer, 'x'> & {
  x: T
}
