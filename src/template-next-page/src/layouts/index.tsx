import { isUndefined } from '@minko-fe/lodash-pro'
import { type PropsWithChildren, type ReactNode } from 'react'
import DefaultFooter, { type FooterProps } from './components/Footer'
import DefaultHeader, { type HeaderProps } from './components/Header'

interface LayoutProps extends PropsWithChildren {
  header?: ReactNode
  footer?: ReactNode
  footerProps?: FooterProps
  headerProps?: HeaderProps
}

const Layout = (props: LayoutProps) => {
  const { header, footer, children, footerProps, headerProps } = props

  const Header = isUndefined(header) ? <DefaultHeader {...headerProps} /> : header || null

  const Footer = isUndefined(footer) ? <DefaultFooter {...footerProps} /> : footer || null

  return (
    <>
      {Header}
      {children}
      {Footer}
    </>
  )
}

export { Layout }
