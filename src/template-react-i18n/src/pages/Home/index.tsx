import { useTranslation } from '@minko-fe/react-locale'
export default function Home() {
  const { t } = useTranslation()

  return (
    <div>
      home
      <div>{t('test.v')}</div>
    </div>
  )
}
