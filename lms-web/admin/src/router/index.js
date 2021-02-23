import Vue from 'vue'
import Router from 'vue-router'
import AuthGuard from './auth-guard'

Vue.use(Router)

export default new Router({
  routes: [
    // route level code splitting, components are lazy loaded using import
    { path: '/login', name:'LogIn', component: () => import('@/pages/Login') },
    { path: '/home', name:'home', component: () => import('@/pages/Home'),  beforeEnter: AuthGuard},
    { path: '/users', name:'users', component: () => import('@/pages/Users'),  beforeEnter: AuthGuard},
    { path: '/instructors', name:'instructors', component: () => import('@/pages/Instructors'),  beforeEnter: AuthGuard},
    //{ path: '/instructorStatus', name:'instructorStatus', component: () => import('@/pages/Home'),  beforeEnter: AuthGuard},
    { path: '/reports', name:'reports', component: () => import('@/pages/Reports'),  beforeEnter: AuthGuard},
    //{ path: '/discussion/report', name:'report', component: () => import('@/pages/Home'),  beforeEnter: AuthGuard},
    { path: '*', redirect: '/login' }
  ],

  mode: 'history'
})
