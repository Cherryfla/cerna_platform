const path = require('path');
function resolve(dir) {
  return path.join(__dirname, dir)
}
module.exports = {
  outputDir: 'dist',
  configureWebpack: {
    // 配置alias
    resolve: {
      alias: {
        '@': resolve('src')
      }
    }
  },
  //配置favicon
  pwa: {
    iconPaths: {
      favicon32: 'favicon.ico',
      favicon16: 'favicon.ico',
      appleTouchIcon: 'favicon.ico',
      maskIcon: 'favicon.ico',
      msTileImage: 'favicon.ico'
    }
  },
  chainWebpack: (config) => {
    //发布模式
    config.when(process.env.NODE_ENV === 'production', config => {
      config.entry('app').clear().add('./src/main-prod.js')

      config.set('externals', {
        vue: 'Vue',
        'vue-router': 'VueRouter',
        axios: 'axios',
        echarts: 'echarts',
        nprogress: 'NProgress'
      })

      config.plugin('html').tap(args => {
        args[0].isProd = true
        return args
      })
    })
    // 开发模式
    config.when(process.env.NODE_ENV === 'development', config => {
      config.entry('app').clear().add('./src/main-dev.js')

      config.plugin('html').tap(args => {
        args[0].isProd = false
        return args
      })
    })
    // 删除之前所有svg规则
    config.module.rules.delete("svg");
    config.module
      .rule('svg')
      .test(/\.svg$/)
      .include
      .add(resolve('src/icons/svg'))  //指定.svg存放目录,对于不需要指定的.svg可以使用exclude
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'  // 规定每个图元的id,可修改,只要use时是#id的形式即可
      })
  }
}
