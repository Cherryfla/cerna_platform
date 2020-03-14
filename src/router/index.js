import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../components/Home'
import Main from '../components/Main'
import Analyze from '../components/Feature/Analyze'
import Contract from '../components/Contract/Contract'
import About from '../components/About/About'
import Download from '../components/Feature/Download'
import FAQ from '../components/FAQ/FAQ'
import Register from '../components/User/Register'
import Login from '../components/User/Login'
import Profile from '../components/User/Profile'
import History from '../components/Feature/History'
import Administrator from '../components/Admin/Administrator'

// 解决router.push跳转到同一路径发生的NavigationDuplicated错误
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    component: Home,
    redirect: '/main',
    children: [
      {
        path:'/main',
        component: Main
      },
      {
        path: '/analyze',
        component: Analyze
      },
      {
        path: '/contract',
        component: Contract
      },
      {
        path: '/about',
        component: About
      },
      {
        path: '/download',
        component: Download
      },
      {
        path: '/faq',
        component: FAQ
      },
      {
        path: '/login',
        component: Login
      },
      {
        path: '/register',
        component: Register
      },
      {
        path: '/profile',
        component: Profile
      },
      {
        path: '/history',
        component: History
      },
      {
        path: '/admin',
        component: Administrator
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

//挂载路由导航守卫
router.beforeEach((to, from, next) => {
  let authPages = ['/profile', '/history', '/admin']
  if(! authPages.includes(to.path)) {
    return next()
  }
  const tokenStr = window.sessionStorage.getItem('token')
  if(!tokenStr) {
    return next('/login')
  }
  else{
    return next()
  }
})

export default router
