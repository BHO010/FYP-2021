import Vue from 'vue'
import Router from 'vue-router'
import AuthGuard from './auth-guard'


Vue.use(Router)

export default new Router({
  routes: [
    // route level code splitting, components are lazy loaded using import
    { path: '/home', name:'Home', component: () => import('@/pages/Home') },
    { path: '/login', name:'LoginIn', component: () => import('@/pages/Login') },
    { path: '*', redirect: '/home' }

  ],

  mode: 'history'
})
