import './assets/sass/app.scss'
import Vue from 'vue'
import App from './App.vue'
// import './registerServiceWorker'
import router from './router'
import store from './store'
import axios from './axios'
import VueAxios from 'vue-axios'
import VueAuth from '@websanova/vue-auth'
import VueAuthDriver from '@websanova/vue-auth/drivers/auth/bearer.js'
import VueAuthAxios from '@websanova/vue-auth/drivers/http/axios.1.x.js'
import VueAuthRouter from '@websanova/vue-auth/drivers/router/vue-router.2.x.js'
import vuetify from './plugins/vuetify'
import './plugins/debounce'
import './plugins/mixins'
import './plugins/filters'
import './plugins/components'
import './plugins/string'

Vue.config.productionTip = false
Vue.router = router

Vue.use(VueAxios, axios)
Vue.use(VueAuth, {
  auth: VueAuthDriver,
  http: VueAuthAxios,
  router: VueAuthRouter
})

new Vue({
  data: () => ({
    drawer: true
  }),
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
