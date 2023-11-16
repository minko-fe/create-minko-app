import { type GetServerSidePropsContext } from 'next'
import { useTranslations } from 'next-intl'
import { _getServerSideProps } from '@/server/getServerSideProps'

export default function Home() {
  const t = useTranslations()

  return <div>{t('home.test')}</div>
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  try {
    return _getServerSideProps({
      messages: ['home'],
      tdk: '/',
    })(ctx)
  } catch (e) {
    console.error(e)
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }
}
