import { Dialog, toast } from '@minko-fe/react-component'
import { useIsomorphicLayoutEffect } from '@minko-fe/react-hook'
import { NextIntlProvider } from 'next-intl'
import { useRef } from 'react'
import { FALLBACKLNG } from '@/i18n/setting'
import WithTheme from '@/theme'

export default function Client({ messages, locale }: { messages?: Record<string, any>; locale?: string }) {
  const inited = useRef(false)

  if (!inited.current) {
    toast.setDefaultOptions({
      keepOnHover: true,
    })

    Dialog.setDefaultOptions({
      overlay: true,
      render: (children) => (
        <NextIntlProvider locale={locale || FALLBACKLNG} messages={messages}>
          <WithTheme>{children}</WithTheme>
        </NextIntlProvider>
      ),
    })
  }

  inited.current = true

  useIsomorphicLayoutEffect(() => {
    if (window && window.resize) {
      window.resize()
    }
  }, [locale])

  return null
}
