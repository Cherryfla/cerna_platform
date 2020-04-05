/*项目发布阶段用到的插件babel*/
const prodPlugin = []

if(process.env.NODE_ENV === 'production'){
  prodPlugin.push('transform-remove-console')
}

module.exports = {
  'presets': [
    '@vue/cli-plugin-babel/preset'
  ],
  'plugins': [
    [
      'component',
      {
        'libraryName': 'element-ui',
        'styleLibraryName': 'theme-chalk'
      }
    ],
    //发布产品阶段的插件数组
    ...prodPlugin
  ]
}
