import { type PAGInit } from 'libpag'
import { type ServerSideProps } from '@/server/getServerSideProps'

declare global {
  interface Window {
    gtag: (
      tagName: string,
      action: string,
      eventVal: {
        event_category: string
        [key: string]: any
      },
    ) => void
    dataLayer?: any
    LoginCredential?: string
    libpag: {
      PAGInit: PAGInit
      _PAG: PAGInit
    }
    fbq: any
  }

  type PageProps<T = Record<string, any>> = ServerSideProps<T>
}

export {}
