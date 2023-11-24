import { match } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'
import { type RequestCookies } from 'next/dist/server/web/spec-extension/cookies'
import { type NextRequest, NextResponse } from 'next/server'
import { LOCALE_COOKIE } from './setting'

type MiddlewareConfigWithDefaults = MiddlewareConfig & {
  alternateLinks: boolean
  localePrefix: LocalePrefix
  localeDetection: boolean
}

type LocalePrefix = 'as-needed' | 'always' | 'never'
type DomainConfig = Omit<RoutingBaseConfig, 'locales' | 'localePrefix'> & {
  /** The domain name (e.g. "example.com", "www.example.com" or "fr.example.com"). Note that the `x-forwarded-host` or alternatively the `host` header will be used to determine the requested domain. */
  domain: string
  // Optional here
  locales?: RoutingBaseConfig['locales']
}
type RoutingBaseConfig = {
  /** A list of all locales that are supported. */
  locales: Array<string>

  /* Used by default if none of the defined locales match. */
  defaultLocale: string

  /** The default locale can be used without a prefix (e.g. `/about`). If you prefer to have a prefix for the default locale as well (e.g. `/en/about`), you can switch this option to `always`.
   */
  localePrefix?: LocalePrefix
}

type MiddlewareConfig = RoutingBaseConfig & {
  /** Can be used to change the locale handling per domain. */
  domains?: Array<DomainConfig>

  /** By setting this to `false`, the `accept-language` header will no longer be used for locale detection. */
  localeDetection?: boolean

  /** Sets the `Link` response header to notify search engines about content in other languages (defaults to `true`). See https://developers.google.com/search/docs/specialty/international/localized-versions#http */
  alternateLinks?: boolean
}

export const HEADER_LOCALE_NAME = 'X-NEXT-INTL-LOCALE'
const BASE_PATH = process.env.NEXT_PUBLIC_BASEURL || ''

function getUnprefixedUrl(config: MiddlewareConfig, request: NextRequest) {
  const url = new URL(request.url)
  if (!url.pathname.endsWith('/')) {
    url.pathname += '/'
  }

  url.pathname = url.pathname.replace(new RegExp(`^/(${config.locales.join('|')})/`), '/')

  // Remove trailing slash
  if (url.pathname !== '/') {
    url.pathname = url.pathname.slice(0, -1)
  }

  return url.toString()
}

function getAlternateEntry(url: string, locale: string) {
  return `<${url}>; rel="alternate"; hreflang="${locale}"`
}

function getAlternateLinksHeaderValue(config: MiddlewareConfigWithDefaults, request: NextRequest) {
  const unprefixedUrl = getUnprefixedUrl(config, request)

  const links = config.locales.flatMap((locale) => {
    function localizePathname(url: URL) {
      if (url.pathname === '/') {
        url.pathname = `/${locale}`
      } else {
        url.pathname = `/${locale}${url.pathname}`
      }
      return url
    }

    const url = new URL(unprefixedUrl)
    if (locale !== config.defaultLocale || config.localePrefix === 'always') {
      localizePathname(url)
    }

    return getAlternateEntry(url.toString(), locale)
  })

  const url = new URL(unprefixedUrl)
  links.push(getAlternateEntry(url.toString(), 'x-default'))

  return links.join(', ')
}

function receiveConfig(config: MiddlewareConfig) {
  const result: MiddlewareConfigWithDefaults = {
    ...config,
    alternateLinks: config.alternateLinks ?? true,
    localePrefix: config.localePrefix ?? 'as-needed',
    localeDetection: config.localeDetection ?? true,
  }

  return result
}

const ROOT_URL = '/'

function getLocaleFromPathname(pathname: string) {
  return pathname.split('/')[1]
}

function getAcceptLanguageLocale(requestHeaders: Headers, locales: Array<string>, defaultLocale: string) {
  let locale: string = ''

  const languages = new Negotiator({
    headers: {
      'accept-language': requestHeaders.get('accept-language') || undefined,
    },
  }).languages()
  try {
    locale = match(languages, locales, defaultLocale)
  } catch (e) {
    // Invalid language
  }

  return locale
}

function resolveLocaleFromPrefix(
  { defaultLocale, localeDetection, locales }: MiddlewareConfigWithDefaults,
  requestHeaders: Headers,
  requestCookies: RequestCookies,
  pathname: string,
) {
  let locale: string = ''

  // Prio 1: Use route prefix
  if (pathname) {
    const pathLocale = getLocaleFromPathname(pathname)
    if (locales.includes(pathLocale)) {
      locale = pathLocale
    }
  }

  // Prio 2: Use the `accept-language` header
  if (!locale && localeDetection && requestHeaders) {
    locale = getAcceptLanguageLocale(requestHeaders, locales, defaultLocale)
  }

  // Prio 3: Use existing cookie
  if (!locale && localeDetection && requestCookies) {
    if (requestCookies.has(LOCALE_COOKIE)) {
      const value = requestCookies.get(LOCALE_COOKIE)?.value
      if (value && locales.includes(value)) {
        locale = value
      }
    }
  }

  // Prio 4: Use default locale
  if (!locale) {
    locale = defaultLocale
  }

  return locale
}

function resolveLocale(
  config: MiddlewareConfigWithDefaults,
  requestHeaders: Headers,
  requestCookies: RequestCookies,
  pathname: string,
): { locale: string } {
  return {
    locale: resolveLocaleFromPrefix(config, requestHeaders, requestCookies, pathname),
  }
}

export function createMiddleware(config: MiddlewareConfig) {
  const configWithDefaults = receiveConfig(config)

  return function middleware(request: NextRequest) {
    const { pathname } = new URL(request.nextUrl.href)

    const { locale } = resolveLocale(configWithDefaults, request.headers, request.cookies, pathname)

    const isRoot = pathname === ROOT_URL

    const hasMatchedDefaultLocale = locale === configWithDefaults.defaultLocale

    function getResponseInit() {
      const responseInit = {
        request: {
          headers: request.headers,
        },
        nextConfig: {
          basePath: BASE_PATH,
        },
      }

      responseInit.request.headers = new Headers(responseInit.request.headers)
      responseInit.request.headers.set(HEADER_LOCALE_NAME, locale)

      return responseInit
    }

    function rewrite(url: string) {
      return NextResponse.rewrite(new URL(url, request.url))
    }

    function next() {
      return NextResponse.next(getResponseInit())
    }

    function redirect(url: string, host?: string) {
      const urlObj = new URL(url, request.url)

      if (host) {
        urlObj.host = host
      }

      return NextResponse.redirect(`${urlObj.toString()}`, getResponseInit())
    }

    let response: NextResponse

    if (isRoot) {
      let pathWithSearch = `/${locale}`
      if (request.nextUrl.search) {
        pathWithSearch += request.nextUrl.search
      }
      if (hasMatchedDefaultLocale) {
        response = next()
      } else if (
        configWithDefaults.localePrefix === 'never' ||
        (hasMatchedDefaultLocale && configWithDefaults.localePrefix === 'as-needed')
      ) {
        response = rewrite(pathWithSearch)
      } else {
        response = redirect(pathWithSearch)
      }
    } else {
      const pathLocaleCandidate = getLocaleFromPathname(pathname)

      const pathLocale = configWithDefaults.locales.includes(pathLocaleCandidate) ? pathLocaleCandidate : null
      const hasLocalePrefix = pathLocale != null

      let pathWithSearch = pathname

      if (request.nextUrl.search) {
        pathWithSearch += request.nextUrl.search
      }

      if (hasLocalePrefix) {
        const basePath = pathWithSearch.replace(`/${pathLocale}`, '') || '/'
        if (pathLocale === locale) {
          if (hasMatchedDefaultLocale && configWithDefaults.localePrefix === 'as-needed') {
            response = redirect(`${BASE_PATH}/${basePath}`)
          } else {
            response = next()
          }
        } else {
          response = redirect(`${BASE_PATH}/${locale}${basePath}`)
        }
      } else if (hasMatchedDefaultLocale && configWithDefaults.localePrefix === 'as-needed') {
        response = rewrite(`${BASE_PATH}/${locale}${pathWithSearch}`)
      } else {
        response = redirect(`${BASE_PATH}/${locale}${pathWithSearch}`)
      }
    }

    response.cookies.set(LOCALE_COOKIE, locale, {
      sameSite: 'strict',
      httpOnly: false,
    })

    if (configWithDefaults.alternateLinks && configWithDefaults.locales.length > 1) {
      response.headers.set('Link', getAlternateLinksHeaderValue(configWithDefaults, request))
    }

    return response
  }
}
