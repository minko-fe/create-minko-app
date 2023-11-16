import { setupI18n } from '@minko-fe/react-locale'
import ReactDOM from 'react-dom/client'
import App from './App'
import { FALLBACKLANG, LOOKUPTARGET } from './locales'
import './style/index.css'

const root = ReactDOM.createRoot(document.querySelector('#root') as HTMLElement)

setupI18n({
  onInited: () => {
    root.render(<App />)
  },
  fallbackLng: FALLBACKLANG,
  lookupTarget: LOOKUPTARGET,
  lowerCaseLng: true,
})
