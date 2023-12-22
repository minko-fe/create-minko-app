import { Grid } from 'antd'

const { useBreakpoint } = Grid

export function useScreenSize() {
  const screens = useBreakpoint()

  return {
    isSm: (screens.sm || screens.xs) && !screens.md,
    isMd: screens.md,
  }
}
