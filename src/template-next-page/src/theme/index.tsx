import { App, ConfigProvider, theme } from 'antd'
import { type PropsWithChildren } from 'react'

const WithTheme = ({ children }: PropsWithChildren) => {
  return (
    <ConfigProvider
      autoInsertSpaceInButton={false}
      input={{ autoComplete: 'off' }}
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          fontFamily: 'var(--font-family)',
        },
      }}
    >
      <App>{children}</App>
    </ConfigProvider>
  )
}

export default WithTheme
