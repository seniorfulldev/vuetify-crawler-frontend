import Vue from 'vue'
import Vuetify from 'vuetify/lib'

Vue.use(Vuetify)

export default new Vuetify({
  preset: {
    icons: {
      iconfont: 'mdiSvg',
      values: {}
    }
  },
  theme: { light: true }
})
