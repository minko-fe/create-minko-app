import { type NextPage } from 'next'
import { type AppProps } from 'next/app'
import Head from 'next/head'
import { NextIntlProvider } from 'next-intl'
import Client from '@/components/Client'
import TDK from '@/components/TDK'
import GlobalContext from '@/contexts/GlobalContext'
import { FALLBACKLNG, LOCALES } from '@/i18n/setting'
import { type AppPropsFromServer } from '@/server/getServerSideProps'
import WithTheme from '@/theme'
import '@/assets/fonts/iconfont.css'
import '@/assets/styles/globals.css'
import '@/assets/styles/tailwind.css'

export type NextPageWithLayout<P = {}> = NextPage<P> & {
  getLayout?: (page: React.ReactElement) => React.ReactNode
}

type AppPropsWithLayout<P = PageProps> = AppProps<P> & {
  Component: NextPageWithLayout<P>
}

function getAlternates(url: string | undefined, basicUrl: string | undefined) {
  if (url === '/') {
    // index
    return LOCALES.map((lang) => ({
      lang,
      href: basicUrl ? `${basicUrl}/${lang}/` : `/${lang}/`,
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

  const alternates = getAlternates(pageProps!.ctx?._resolvedUrl, pageProps!.ctx?.basicUrl)

  return (
    <>
      <Head>
        <meta
          name='viewport'
          content='width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=0'
        />
        <meta name='renderer' content='webkit' />
        <meta httpEquiv='X-UA-Compatible' content='IE=edge' />
        {pageProps!.ctx?.resolvedUrl && <link rel='canonical' href={pageProps!.ctx.resolvedUrl}></link>}

        {alternates.length ? (
          <>
            <link rel='alternate' href={`${pageProps!.ctx?.basicUrl}/${FALLBACKLNG}/`} hrefLang='X-default' />
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
