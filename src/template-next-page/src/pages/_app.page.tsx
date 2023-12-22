import { type NextPage } from 'next'
import { type AppProps } from 'next/app'
import Head from 'next/head'
import { NextIntlProvider } from 'next-intl'
import Client from '@/components/Client'
import TDK from '@/components/TDK'
import GlobalContext from '@/contexts/GlobalContext'
import { LOCALES } from '@/i18n/setting'
import { type AppPropsFromServer } from '@/server/getServerSideProps'
import WithTheme from '@/theme'
import '@/assets/fonts/iconfont.css'
import '@/styles/globals.css'
import '@/styles/tailwind.css'

export type NextPageWithLayout<P = {}> = NextPage<P> & {
  getLayout?: (page: React.ReactElement) => React.ReactNode
}

type AppPropsWithLayout<P = PageProps> = AppProps<P> & {
  Component: NextPageWithLayout<P>
}

const Enable_Alternate_Sites = ['/', '/some-page/']
function getAlternates(pathname: string) {
  function isEnable(pathname: string) {
    for (let i = 0; i < Enable_Alternate_Sites.length; i++) {
      const x = Enable_Alternate_Sites[i]
      const reg = new RegExp(`^(?:/\\w+)(${x})(?:[^/])*$`)
      if (reg.test(pathname)) {
        return reg.exec(pathname)?.[1]
      }
    }
  }

  if (isEnable(pathname)) {
    return LOCALES.map((lang) => ({
      lang,
      href: `${process.env.NEXT_PUBLIC_DOMAIN}/${lang}${isEnable(pathname)}`,
    }))
  }

  return []
}

export default function App({ Component, pageProps }: AppPropsWithLayout<AppPropsFromServer>) {
  if (!pageProps?.ctx) {
    pageProps = {} as any
    pageProps!.ctx = {} as any
  }

  const getLayout = Component.getLayout ?? ((page) => page)

  const alternates = getAlternates(pageProps!.ctx?.pathname || '')

  return (
    <>
      <Head>
        <meta
          name='viewport'
          content='width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=0'
        />
        <meta name='renderer' content='webkit' />
        <meta httpEquiv='X-UA-Compatible' content='IE=edge' />

        {pageProps!.ctx?.pathname && (
          <link rel='canonical' href={`${process.env.NEXT_PUBLIC_DOMAIN}${pageProps!.ctx.pathname}`}></link>
        )}
        {alternates.length ? (
          <>
            <link rel='alternate' href={alternates[0].href} hrefLang='X-default' />
            {alternates.map((alt, index) => (
              <link rel='alternate' href={alt.href} key={index} hrefLang={alt.lang} />
            ))}
          </>
        ) : null}
      </Head>

      <TDK {...pageProps?.tdk} />

      <NextIntlProvider locale={pageProps!.ctx?.locale} messages={pageProps?.messages}>
        <WithTheme>
          <GlobalContext.Provider>{getLayout(<Component {...pageProps!} />)}</GlobalContext.Provider>
        </WithTheme>
        <Client locale={pageProps?.ctx?.locale} messages={pageProps?.messages} />
      </NextIntlProvider>
    </>
  )
}
