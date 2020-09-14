import Vue from 'vue'
import Vuex from 'vuex'
import jwtDecode from 'jwt-decode'
import actions from '@/store/actions'
import { http } from '@/axios'
import { HTTPONLY_TOKEN } from '@/config'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    layout: 'layout-default',
    user: null,
    loading: false,
    error: null,
    networkError: false,
  },
  mutations: {
    signUserUp(state, payload) { }, // DISABLED
    setLayout(state, payload) { state.layout = payload },
    setUser(state, payload) {
      if (payload && payload.token) {
        const decoded = jwtDecode(payload.token)
        if (decoded) {
          payload.id = decoded.id
          payload.verified = decoded.verified
        }
        payload.loginType = 'rest'
      }
      state.user = payload
      if (payload) {
        if (!HTTPONLY_TOKEN) http.defaults.headers.common['Authorization'] = 'Bearer ' + payload.token
        const { token, refresh_token, ...noTokens } = payload
        localStorage.setItem('session', JSON.stringify(HTTPONLY_TOKEN ? noTokens : payload))
      } else {
        localStorage.removeItem('session')
        if (!HTTPONLY_TOKEN) delete http.defaults.headers.common['Authorization']
      }
    },
    setLoading(state, payload) { state.loading = payload },
    setError(state, payload) { state.error = payload },
    setStep(state, payload) { state.step = payload },
    mutateNetworkError(state, payload) { state.networkError = payload }
  },
  getters: {
    loading(state) { return state.loading }
  },
  actions: {
    ...actions 
  },
  modules: {
  }
})
