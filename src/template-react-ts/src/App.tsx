import { ErrorBoundary } from 'react-error-boundary'
import { BrowserRouter } from 'react-router-dom'
import routes from '@/routes'
import AntdConfigProvider from './components/AntdConfigProvider'
import ErrorFallback from './components/ErrorFallback'
import GlobalContext from './contexts/GlobalContext'
import AppRoutes from './routes/AppRoutes'
import './style/index.css'

function App() {
  return (
    <BrowserRouter>
      <AntdConfigProvider>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <GlobalContext.Provider>
            <AppRoutes routes={routes} />
          </GlobalContext.Provider>
        </ErrorBoundary>
      </AntdConfigProvider>
    </BrowserRouter>
  )
}

export default App
