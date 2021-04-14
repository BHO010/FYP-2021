import Vue from 'vue'
import Router from 'vue-router'
import AuthGuard from './auth-guard'

 
Vue.use(Router)

export default new Router({
  routes: [
    // route level code splitting, components are lazy loaded using import
    //{ path: '/', name:'landing', component: () => import('@/pages/Home') },
    { path: '/avatar', name:'avatar', component: () => import('@/pages/Avatar') },
    { path: '/login', name:'LogIn', component: () => import('@/pages/Login') },
    { path: '/signup', name:'Signup', component: () => import('@/pages/Signup') },
    { path: '/reset-pw', name:'ResetPW', component: () => import('@/pages/ResetPW') },
    { path: '/home', name:'PrivateHome', component: () => import('@/pages/PrivateHome'),  beforeEnter: AuthGuard},
    { path: '/profile', name:'UserProfile', component: () => import('@/pages/UserProfile'),  beforeEnter: AuthGuard},
    { path: '/profile/:email', name:'ViewProfile', component: () => import('@/pages/ViewProfile'),  beforeEnter: AuthGuard},
    { path: '/browse', name:'Browse', component: () => import('@/pages/Browse'),  beforeEnter: AuthGuard},
    { path: '/discussion', name:'Discussion', component: () => import('@/pages/Discussion'),  beforeEnter: AuthGuard},
    { path: '/discussion/thread', name:'Threads', component: () => import('@/pages/Thread'),  beforeEnter: AuthGuard},
    { path: '/students', name:'Students', component: () => import('@/pages/Students'),  beforeEnter: AuthGuard},
    { path: '/classes', name:'Classes', component: () => import('@/pages/Classes'),  beforeEnter: AuthGuard},
    { path: '/classes/thread/:type', name:'CThread', component: () => import('@/pages/CThread'),  beforeEnter: AuthGuard},
    { path: '/classes/quiz/list', name:'QuizResults', component: () => import('@/pages/QuizResults'),  beforeEnter: AuthGuard},
    { path: '/classes/quiz/stats', name:'QuizStats', component: () => import('@/pages/QuizStats'),  beforeEnter: AuthGuard},
    { path: '/settings', name:'Settings', component: () => import('@/pages/Settings'),  beforeEnter: AuthGuard},
    { path: '/statistics', name:'Statistics', component: () => import('@/pages/Statistics'),  beforeEnter: AuthGuard},
    { path: '/achievements', name:'Achievements', component: () => import('@/pages/Achievements'),  beforeEnter: AuthGuard},
    { path: '/course/create', name:'CourseCreate', component: () => import('@/pages/course/CourseCreation'),  beforeEnter: AuthGuard},
    //{ path: '/course/survey', name:'CourseSurvey', component: () => import('@/pages/course/CoursesSurvey'),  beforeEnter: AuthGuard},
    { path: '/course/edit', name:'CourseEdit', component: () => import('@/pages/course/CourseEdit'),  beforeEnter: AuthGuard},
    { path: '/course/:reference', name:'Course', component: () => import('@/pages/course/Course'),  beforeEnter: AuthGuard},
    { path: '/courses-taken', name:'CoursesTaken', component: () => import('@/pages/course/CoursesTaken'),  beforeEnter: AuthGuard},
    { path: '/courses-created', name:'CoursesCreated', component: () => import('@/pages/course/CoursesCreated'),  beforeEnter: AuthGuard},
    { path: '/survey', name:'Survey', component: () => import('@/pages/survey/Survey'),  beforeEnter: AuthGuard},
    { path: '/survey/create', name:'SurveyCreate', component: () => import('@/pages/survey/SurveyCreate'),  beforeEnter: AuthGuard},
    { path: '/survey/edit', name:'SurveyEdit', component: () => import('@/pages/survey/SurveyEdit'),  beforeEnter: AuthGuard},
    { path: '/survey/result', name:'SurveyResult', component: () => import('@/pages/survey/SurveyResults'),  beforeEnter: AuthGuard},
    { path: '*', redirect: '/login' }

  ],

  mode: 'history'
})
