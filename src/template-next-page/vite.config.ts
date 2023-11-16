import { defineConfig, loadEnv } from 'vite'
import { publicTypescript } from 'vite-plugin-public-typescript'

export default defineConfig(() => {
  const nextEnv = loadEnv(process.env.NODE_ENV, '', 'NEXT_')

  const env = Object.keys(nextEnv).reduce((acc, key) => {
    acc[`process.env.${key}`] = JSON.stringify(nextEnv[key])
    return acc
  }, {})

  return {
    build: {
      write: false,
    },
    define: {
      ...env,
    },
    plugins: [
      publicTypescript({
        outputDir: `/assets/js`,
        destination: 'file',
        cacheDir: 'public-typescript',
        base: nextEnv.NEXT_PUBLIC_BASEURL,
        babel: true,
      }),
    ],
    logLevel: 'silent',
  }
})
