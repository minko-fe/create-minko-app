import node from '@astrojs/node'
import react from '@astrojs/react'
import tailwind from '@astrojs/tailwind'
import { defineConfig } from 'astro/config'
import { publicTypescript } from 'vite-plugin-public-typescript'

// https://astro.build/config
export default defineConfig({
  integrations: [react(), tailwind({
    nesting: true
  })],
  adapter: node({
    mode: 'standalone',
  }),
  output: 'server',
  vite: {
    resolve: {
      alias: {
        '@': '/src',
      },
    },
    build: {
      rollupOptions: {
        external: ['os', 'util', 'fs', 'assert', 'stream'],
      },
    },
    plugins: [
      publicTypescript({
        outputDir: '/lib',
        destination: 'file',
        babel: true,
      }),
    ],
  },
  server: {
    host: '0.0.0.0',
    port: 4200,
  },
})
