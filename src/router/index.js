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
import Retrieve from '../components/User/Retrieve'
import Login from '../components/User/Login'
import Profile from '../components/User/Profile'
import History from '../components/Feature/History'
import Summary from '../components/Feature/Summary'
import Data from '../components/Feature/Data'

// import Admin from '../components/Admin/Admin'
// import AdminUser from '../components/Admin/AdminUser'
// import AdminFaq from '../components/Admin/AdminFaq'
// import AdminFiles from '../components/Admin/AdminFiles'
// import Page404 from '../components/Error/Page404'
//路由懒加载
const Admin = ()=>import('../components/Admin/Admin')
const AdminUser = ()=>import('../components/Admin/AdminUser')
const AdminFaq = ()=>import('../components/Admin/AdminFaq')
const AdminFiles = ()=>import('../components/Admin/AdminFiles')
const Page404 = ()=>import('../components/Error/Page404')

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
        path: '/summary',
        component: Summary
      },
      {
        path: '/data/:id',
        component: Data
      },
      {
        path: '/retrieve',
        component: Retrieve
      },
      {
        path: '/admin',
        component: Admin,
        children: [
          {
            path: 'user',
            component: AdminUser
          },
          {
            path: 'faq',
            component: AdminFaq
          },
          {
            path: 'files',
            component: AdminFiles
          }
        ]
      }
    ],
  },
  {
    path: '*',
    component: Page404
  }
]

const router = new VueRouter({
  routes
})

//挂载路由导航守卫
router.beforeEach((to, from, next) => {
  let authPages = ['/profile', '/history', '/admin']
  if(! authPages.includes(to.path) && !to.path.includes('/admin')) {
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
