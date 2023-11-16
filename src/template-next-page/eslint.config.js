const { defineConfig } = require('@minko-fe/eslint-config')
const next = require('eslint-config-next/core-web-vitals')

module.exports = defineConfig({
  plugins: next,
})
