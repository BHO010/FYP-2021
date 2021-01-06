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
    { path: '/browse', name:'Browse', component: () => import('@/pages/Browse'),  beforeEnter: AuthGuard},
    { path: '/course/create', name:'CourseCreate', component: () => import('@/pages/course/CourseCreation'),  beforeEnter: AuthGuard},
    { path: '/course/edit', name:'CourseEdit', component: () => import('@/pages/course/CourseEdit'),  beforeEnter: AuthGuard},
    { path: '/course/:title', name:'Course', component: () => import('@/pages/course/Course'),  beforeEnter: AuthGuard},
    { path: '/courses-taken', name:'CoursesTaken', component: () => import('@/pages/course/CoursesTaken'),  beforeEnter: AuthGuard},
    { path: '/courses-created', name:'CoursesCreated', component: () => import('@/pages/course/CoursesCreated'),  beforeEnter: AuthGuard},
    { path: '/survey', name:'Survey', component: () => import('@/pages/survey/Survey'),  beforeEnter: AuthGuard},
    { path: '/survey/create', name:'SurveyCreate', component: () => import('@/pages/survey/SurveyCreate'),  beforeEnter: AuthGuard},
    { path: '/survey/edit', name:'SurveyEdit', component: () => import('@/pages/survey/SurveyEdit'),  beforeEnter: AuthGuard},
    { path: '*', redirect: '/' }

  ],

  mode: 'history'
})
