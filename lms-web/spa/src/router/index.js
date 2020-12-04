import Vue from 'vue'
import Router from 'vue-router'
import AuthGuard from './auth-guard'


Vue.use(Router)

export default new Router({
  routes: [
    // route level code splitting, components are lazy loaded using import
    { path: '/', name:'landing', component: () => import('@/pages/Home') },
    { path: '/avatar', name:'avatar', component: () => import('@/pages/Avatar') },
    { path: '/login', name:'LogIn', component: () => import('@/pages/Login') },
    { path: '/signup', name:'Signup', component: () => import('@/pages/Signup') },
    { path: '/home', name:'PrivateHome', component: () => import('@/pages/PrivateHome'),  beforeEnter: AuthGuard},
    { path: '/profile', name:'UserProfile', component: () => import('@/pages/UserProfile'),  beforeEnter: AuthGuard},
    { path: '/course-create', name:'CourseCreate', component: () => import('@/pages/CourseCreation'),  beforeEnter: AuthGuard},
    { path: '/course', name:'Course', component: () => import('@/pages/Course'),  beforeEnter: AuthGuard},
    { path: '*', redirect: '/' }

  ],

  mode: 'history'
})
