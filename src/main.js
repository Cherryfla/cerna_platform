import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import axios from 'axios'

//导入进度条包对应的js和css
import Nprogress from 'nprogress'
import 'nprogress/nprogress.css'

// 生成uuid
Vue.prototype.getUuid = function (){
  let s = [];
  let hexDigits = "0123456789abcdef";
  for (let i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = "4";
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
  s[8] = s[13] = s[18] = s[23] = "-";

  let uuid = s.join("");
  return uuid;
}

// cors
// axios.defaults.withCredentials = false;
axios.defaults.baseURL = 'http://121.41.85.40/api/'
Vue.prototype.$http = axios
//在request拦截器中展示进度条
axios.interceptors.request.use(config => {
  Nprogress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token')
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
