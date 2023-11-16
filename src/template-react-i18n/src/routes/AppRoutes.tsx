import { CreateRoutes, type RoutesType } from '@minko-fe/react-route'
import { AnimatePresence, motion } from 'framer-motion'
import { type FC, type PropsWithChildren } from 'react'
import { useLocation } from 'react-router-dom'

interface AppRoutesProp {
  routes: RoutesType
}

const AnimateRouteWrapper = ({ children }: PropsWithChildren<Record<string, any>>) => {
  return (
    <motion.div
      initial={{
        translateX: 8,
        opacity: 0,
      }}
      animate={{ translateX: 0, opacity: 1 }}
      exit={{ translateX: -8, opacity: 0 }}
      transition={{ duration: 0.15 }}
    >
      {children}
    </motion.div>
  )
}

const Wrapper: FC<PropsWithChildren> = ({ children }) => {
  const location = useLocation()

  return (
    <AnimatePresence exitBeforeEnter initial={false}>
      <AnimateRouteWrapper key={location.pathname}>{children}</AnimateRouteWrapper>
    </AnimatePresence>
  )
}

const AppRoutes: React.FC<AppRoutesProp> = ({ routes }) => {
  return <CreateRoutes routes={routes} provider={<Wrapper />} />
}

export default AppRoutes
