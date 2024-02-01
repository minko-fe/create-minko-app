import { defineConfig } from 'tsup'

export const tsup = defineConfig((option) => ({
  entry: ['src/index.ts'],
  target: 'node16',
  dts: true,
  clean: !option.watch,
  format: ['cjs', 'esm'],
  platform: 'node',
  splitting: false,
  treeshake: true,
  minify: !option.watch,
  sourcemap: !!option.watch,
}))
