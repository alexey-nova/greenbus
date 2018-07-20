import Vue from 'vue'
// import core from './plugins/core'
import store from './store/index'
import router from './routes'
import './plugins'
import { Cascader } from 'element-ui'
import lang from 'element-ui/lib/locale/lang/ru-RU'
import locale from 'element-ui/lib/locale'

import JsonExcel from 'vue-json-excel'

Vue.component('downloadExcel', JsonExcel)

locale.use(lang)
Vue.use(Cascader)

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
  template: `<router-view/>`
})
