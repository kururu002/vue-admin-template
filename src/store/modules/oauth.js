import vueAuth from '@/oauth'
import { resetRouter } from '@/router'
const state = {
  isAuthenticated: false
}
const getters = {
  isAuthenticated(state) {
    return state.isAuthenticated
  }
}
const mutations = {
  isAuthenticated(state, payload) {
    state.isAuthenticated = payload.isAuthenticated
  }
}

const actions = {
  // Perform VueAuthenticate login using Vuex actions
  login(context, payload) {
    vueAuth.login(payload.user, payload.requestOptions).then((response) => {
      context.commit('isAuthenticated', {
        isAuthenticated: vueAuth.isAuthenticated()
      })
    })
  },
  logout({ commit }) {
    return new Promise((resolve, reject) => {
      commit('isAuthenticated', { isAuthenticated: false })
      vueAuth.logout().then(() => {
        resetRouter()
        resolve()
      }).catch(error => { reject(error) })
    })
  },
  authenticate(context, provider) {
    if (vueAuth.isAuthenticated()) {
      context.dispatch('logout')
    }
    return new Promise((resolve, reject) => {
      vueAuth.authenticate(provider).then(function(authResponse) {
        context.commit('isAuthenticated', { isAuthenticated: true })

        if (provider === 'github') {
          vueAuth.$http.get('https://api.github.com/user').then(response => { resolve(response) })
        } else if (provider === 'facebook') {
          vueAuth.$http.get('https://graph.facebook.com/v2.5/me', {
            params: { access_token: vueAuth.$auth.getToken() }
          }).then(response => response)
        } else if (provider === 'google') {
          vueAuth.$http.get('https://www.googleapis.com/plus/v1/people/me/openIdConnect').then(response => response
          )
        } else if (provider === 'twitter') {
          return authResponse
        } else if (provider === 'instagram') {
          return authResponse
        } else if (provider === 'bitbucket') {
          vueAuth.$http.get('https://api.bitbucket.org/2.0/user').then(response => response)
        } else if (provider === 'linkedin') {
          return authResponse
        } else if (provider === 'live') {
          return authResponse
        }
      }).catch(function(err) {
        vueAuth.isAuthenticated = false
        context.commit('isAuthenticated', { isAuthenticated: false })
        reject(err)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}

