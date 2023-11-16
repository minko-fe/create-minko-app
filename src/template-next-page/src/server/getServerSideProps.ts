import { assign, isNil, isString } from '@minko-fe/lodash-pro'
import { type GetServerSidePropsContext } from 'next'
import normalizeUrl from 'normalize-url'
import parseUrl from 'parse-url'
import { type TDKProps } from '@/components/TDK'
import { getLocale } from '@/i18n'
import { X_URL } from '@/service/const'

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

function convertNilToEmptyString<T = Record<string, any>>(obj: T | undefined): T | undefined {
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
    let xUrl: ReturnType<typeof parseUrl>
    try {
      const nextRequestMeta =
        ctx.req[Reflect.ownKeys(ctx.req).find((s) => String(s) === 'Symbol(NextInternalRequestMeta)')]

      xUrl = parseUrl(ctx.req.cookies[X_URL] || nextRequestMeta.__NEXT_INIT_URL || process.env.NEXT_PUBLIC_LAGO_MAIN)
    } catch (e) {
      console.error(e)
    }

    const basicUrl = `${xUrl.protocols}://${xUrl.resource}:${xUrl.port}`

    const resolvedUrl = normalizeUrl(`${basicUrl}/${ctx.locale}/${ctx.resolvedUrl}` || ctx.resolvedUrl)

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
      if (isString(tdk)) {
        tdk = {} // 可从后端请求tdk
      }
    } catch {}

    globalThis.__NEXT_DATA_HEADERS__ = ctx.req.headers

    return {
      props: {
        messages: await getLocale(ctx.locale, messages),
        ctx: convertNilToEmptyString({
          _resolvedUrl: ctx.resolvedUrl,
          resolvedUrl,
          basicUrl,
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
export type ServerSideProps<T extends Record<string, any> = Record<string, any>> = Omit<
  RemovePromise<ReturnType<ReturnType<typeof _getServerSideProps>>>['props'],
  'x'
> & {
  x?: T
}
