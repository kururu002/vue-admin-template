import Vue from 'vue'
import Vuex from 'vuex'
import VueAxios from 'vue-axios'
import { VueAuthenticate } from 'vue-authenticate'
import axios from 'axios'

Vue.use(Vuex)
Vue.use(VueAxios, axios)

const vueAuth = new VueAuthenticate(Vue.prototype.$http, {
  baseUrl: 'http://localhost:5000', // Your API domain
  tokenName: 'access_token',
  storageType: 'cookieStorage',
  providers: {
    github: {
      clientId: '608910304b3d9bdd071a', // Application client ID
      redirectUri: 'http://localhost:9528/auth/callback' // Your client app URL
    }
  }
})

export default vueAuth
