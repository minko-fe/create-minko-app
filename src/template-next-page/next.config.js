const path = require('node:path')
const { LOCALES, LOCALE_PLACEHOLDER } = require('./src/i18n/locale')

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  i18n: {
    locales: [LOCALE_PLACEHOLDER, ...LOCALES],
    defaultLocale: LOCALE_PLACEHOLDER,
    localeDetection: true,
  },
  swcMinify: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: [],
  },
  webpack(config) {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@root': __dirname,
      '@': path.resolve(__dirname, './src'),
    }
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    }
    config.module.rules.forEach((rule) => {
      const { oneOf } = rule
      if (oneOf) {
        oneOf.forEach((one) => {
          if (!`${one.issuer?.and}`.includes('_app')) return
          one.issuer.and = [path.resolve(__dirname)]
        })
      }
    })
    return config
  },
  pageExtensions: ['page.tsx', 'page.jsx', 'page.ts', 'page.js'],
}

const transformModules = require('next-transpile-modules')(['@minko-fe/react-component'])
module.exports = transformModules(nextConfig)
