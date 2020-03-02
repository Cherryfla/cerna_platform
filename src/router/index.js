import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../components/Home'
import Main from '../components/Main'
import Analyze from '../components/Feature/Analyze'
import Contract from '../components/Contract/Contract'
import About from '../components/About/About'
import Download from '../components/Feature/Download'
import FAQ from '../components/FAQ/FAQ'

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
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
