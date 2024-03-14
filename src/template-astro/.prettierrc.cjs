module.exports = {
  plugins: [require.resolve('prettier-plugin-astro')],
  singleQuote: true,
  trailingComma: 'all',
  tabWidth: 2,
  endOfLine: 'auto',
  printWidth: 120,
  semi: false,
  jsxSingleQuote: true,
  htmlWhitespaceSensitivity: 'strict',
  quoteProps: 'consistent',
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: 'always',
  vueIndentScriptAndStyle: true,
  overrides: [
    {
      files: '*.astro',
      options: {
        parser: 'astro',
      },
    },
  ],
}
