import { type RoutesItemType } from '@minko-fe/react-route'

const routes: RoutesItemType[] = [
  {
    path: '/',
    component: () => import('@/pages/Home'),
  },
  {
    path: '*',
    component: () => import('@/pages/NotFound'),
  },
]

export default routes
