import { StyleProvider, createCache, extractStyle, legacyLogicalPropertiesTransformer } from '@ant-design/cssinjs'
import manifest from '@root/public-typescript/manifest.json'
import Document, { type DocumentContext, Head, Html, Main, NextScript } from 'next/document'
import Script from 'next/script'
import { FALLBACKLNG } from '@/i18n/setting'
import { isDev, isTest } from '@/utils/env'

const AppDocument = (props: DocumentContext & { props: any }) => {
  return (
    <Html lang={props.locale || FALLBACKLNG}>
      <Head>
        <link rel='icon' href='/favicon.ico' />
        {!isDev() && <script id='flexible' src={manifest.flexible} />}
        <style type='text/css' data-style-name='ui-style' dangerouslySetInnerHTML={{ __html: props?.props?.style }} />
      </Head>
      <body id='body'>
        <Main />
        <NextScript />

        {isDev() && <Script strategy='beforeInteractive' src={manifest.flexible} />}
        <Script src={manifest['log-info']} strategy='afterInteractive'></Script>
        {isTest() && <Script strategy='afterInteractive' src={manifest.vconsole} />}
      </body>
    </Html>
  )
}

AppDocument.getInitialProps = async (ctx: DocumentContext) => {
  const cache = createCache()
  const originalRenderPage = ctx.renderPage
  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App) => (props) => (
        <StyleProvider cache={cache} transformers={[legacyLogicalPropertiesTransformer]}>
          <App {...props} />
        </StyleProvider>
      ),
    })

  const initialProps = await Document.getInitialProps(ctx)
  const style = extractStyle(cache)

  return {
    ...initialProps,
    props: {
      style,
    },
  }
}

export default AppDocument
