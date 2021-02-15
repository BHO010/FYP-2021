import Vue from 'vue'
import Router from 'vue-router'
import AuthGuard from './auth-guard'

Vue.use(Router)

export default new Router({
  routes: [
    // route level code splitting, components are lazy loaded using import
    { path: '/', name:'landing', component: () => import('@/pages/Home') },
    { path: '/login', name:'LogIn', component: () => import('@/pages/Login') },
    { path: '/home', name:'home', component: () => import('@/pages/Home'),  beforeEnter: AuthGuard},
    { path: '*', redirect: '/' }
  ],

  mode: 'history'
})
