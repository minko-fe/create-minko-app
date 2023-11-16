import { StyleProvider, legacyLogicalPropertiesTransformer } from '@ant-design/cssinjs'
import { App, ConfigProvider, theme } from 'antd'
import { type FC, type PropsWithChildren } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

// svg 兼容处理，若不需要可以删除
const clipPathIdSet = new Set()
const clipPathPathTransformer = {
  visit: (cssObj) => {
    if ('clipPath' in cssObj && cssObj.clipPath.startsWith('path(')) {
      const path = cssObj.clipPath.slice(6, -2)
      const pathName = path.replaceAll(' ', '-')
      if (!clipPathIdSet.has(pathName)) {
        const div = document.createElement('div')
        div.innerHTML = renderToStaticMarkup(
          <svg height='0' width='0' data-desc='generate by clipPathPathTransformer'>
            <defs>
              <clipPath id={pathName}>
                <path d={path} />
              </clipPath>
            </defs>
          </svg>,
        )

        div.style.width = '0px'
        div.style.height = '0px'

        document.body.append(div)
        clipPathIdSet.add(pathName)
      }

      return { ...cssObj, clipPath: `url(#${pathName})` }
    }
    return cssObj
  },
}

const AntdConfigProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <StyleProvider hashPriority={'high'} transformers={[legacyLogicalPropertiesTransformer, clipPathPathTransformer]}>
      <ConfigProvider
        autoInsertSpaceInButton={false}
        input={{ autoComplete: 'off' }}
        theme={{
          hashed: false,
          algorithm: theme.darkAlgorithm,
          token: {},
        }}
      >
        <App>{children}</App>
      </ConfigProvider>
    </StyleProvider>
  )
}

export default AntdConfigProvider
