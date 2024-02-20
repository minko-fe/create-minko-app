const { definePlugins } = require('@minko-fe/postcss-config')

module.exports = {
  plugins: definePlugins({
    'postcss-preset-env': false,
    'postcss-pxtorem': {
      rootValue: 16,
      replace: true,
      minPixelValue: 1,
      atRules: false,
      propList: ['*'],
      unitToConvert: 'px',
      exclude(file) {
        return file.includes('node_modules/antd') || file.includes('node_modules/@minko-fe/react-component')
      },
      convertUnitOnEnd: {
        sourceUnit: /px$/i,
        targetUnit: 'px',
      },
    },
  }).normal,
}
