module.exports = {
  presets: [
    '@vue/app',
    [
      '@babel/preset-env',
      {
        'useBuiltIns': 'entry'
      }
    ]
  ],
  plugins: [
    // 组件按需引入
    [
      'import',
      {
        'libraryName': 'ant-design-vue',
        'libraryDirectory': 'es',
        'style': true
      }
    ]
  ]
}
