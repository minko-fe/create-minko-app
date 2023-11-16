import { Grid } from 'antd'

const { useBreakpoint } = Grid

export function useSm() {
  const screens = useBreakpoint()

  return {
    isSm: (screens.sm || screens.xs) && !screens.md,
  }
}
