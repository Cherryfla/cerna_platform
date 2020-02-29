import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import axios from 'axios'

//导入进度条包对应的js和css
import Nprogress from 'nprogress'
import 'nprogress/nprogress.css'

// cors
// axios.defaults.withCredentials = false;

axios.defaults.baseURL = 'http://121.41.85.40/api/'
Vue.prototype.$http = axios
//在request拦截器中展示进度条
axios.interceptors.request.use(config => {
  Nprogress.start()
  return config
})
//在response拦截器中隐藏进度条
axios.interceptors.response.use(config => {
  Nprogress.done()
  return config
})
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
