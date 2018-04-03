import Vue from 'vue'
// import core from './plugins/core'
import store from './store/index'
import router from './routes'
import './plugins'

import JsonExcel from 'vue-json-excel'

Vue.component('downloadExcel', JsonExcel)

/*
* Config
*/
Vue.config.productionTip = false

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
