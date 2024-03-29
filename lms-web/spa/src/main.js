'use strict'
import Vue from 'vue'
import VueNativeSock from 'vue-native-websocket'
import i18n from './lang'
import { store } from './store'
import router from './router'
import App from './App'
import CKEditor from 'ckeditor4-vue';
 
import vuetify from '@/plugins/vuetify'
import VueCrudX from 'ext-lib/webpacked/VueCrudX.vue' // Vuetify
import VueApexCharts from 'vue-apexcharts'
import TimePicker from 'ext-lib/webpacked/TimePicker.vue'
import DatePicker from 'ext-lib/webpacked/DatePicker.vue'
import FileUpload from 'ext-lib/webpacked/FileUpload.vue'

import ReviewSection from './components/ReviewSection.vue'
import CourseCard from './components/CourseCard.vue'
import DiscussionCard from './components/DiscussionCard.vue'
import ClassesCard from './components/ClassesCard.vue'
import SurveyBuilder from './components/SurveyBuilder.vue'
import SurveyViewer from './components/SurveyViewer.vue'
import SurveyAnalysis from './components/SurveyAnalysis.vue'
import QuizMarker from './components/QuizMarker.vue'
import QuizAnalysis from './components/QuizAnalysis.vue'
import AchievementCard from './components/AchievementCard.vue'


Vue.config.productionTip = false

import { WS_URL } from '@/config'
if (WS_URL) {
  Vue.use(VueNativeSock, WS_URL, {
    // connectManually: true,
    protocol: '', // default is empty string
    reconnection: true, // (Boolean) whether to reconnect automatically (false)
    // reconnectionAttempts: 5, // (Number) number of reconnection attempts before giving up (Infinity),
    reconnectionDelay: 5000, // (Number) how long to initially wait before attempting a new (1000)
    // store: store, // VUEX Store
    format: 'json'
  })
} else {
  // console.log('NO WS...')
}
Vue.use( CKEditor );
Vue.component('app-date-picker', DatePicker)
Vue.component('app-time-picker', TimePicker)
Vue.component('app-file-upload', FileUpload)
Vue.component('vue-crud-x', VueCrudX)
Vue.component('apexchart', VueApexCharts)

Vue.component('review-section', ReviewSection)
Vue.component('course-card', CourseCard)
Vue.component('discussion-card', DiscussionCard)
Vue.component('classes-card', ClassesCard)
Vue.component('achievement-card', AchievementCard)

Vue.component('survey-builder', SurveyBuilder)
Vue.component('survey-viewer', SurveyViewer)
Vue.component('survey-analysis', SurveyAnalysis)
Vue.component('quiz-marker', QuizMarker)
Vue.component('quiz-analysis', QuizAnalysis)

/* eslint-disable no-new */
export const app = new Vue({
  el: '#app',
  i18n,
  vuetify,
  router,
  store,
  render: h => h(App),
  created () { }
})