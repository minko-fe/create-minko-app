import { type NextRequest } from 'next/server'
import { createMiddleware } from './i18n/middleware'
import { i18n } from './i18n/setting'
import { X_URL } from './service/const'

export function middleware(request: NextRequest) {
  const xUrl = `${request.nextUrl.protocol}//${request.headers.get('host')}${request.nextUrl.pathname}${
    request.nextUrl.search
  }`

  request.headers.set(X_URL, xUrl)

  const res = createMiddleware({
    ...i18n,
    localePrefix: 'always',
    alternateLinks: true,
  })(request)

  res.cookies.set(X_URL, xUrl, { httpOnly: true })

  return res
}

export const config = {
  matcher: ['/((?!api|_next|favicon.ico|assets|pag|video).*)', '/'],
}
