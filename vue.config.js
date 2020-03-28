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
  chainWebpack: (config) => {
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
