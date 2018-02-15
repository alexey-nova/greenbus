import Vue from 'vue'
import store from './store/index'
import router from './routes'
import './plugins'
import VueSocketio from 'vue-socket.io'

/*
* Config
*/
Vue.config.productionTip = false

// Vue.use(VueSocketio, 'http://localhost:3333/')
Vue.use(VueSocketio, 'http://195.93.152.79:3333/')

/*
* Init Vue
*/
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: `<router-view/>`,
})
