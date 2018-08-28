import Vue from 'vue'
import Vuex from 'vuex'
import core from './../plugins/core'
import app from './app'
import notifications from './notifications'
import boot from '#/config/boot'

Vue.use(Vuex)

let plugins = core.$_.reduce(boot.plugins, (result = {}, value, key) => {
  if (value.store) {
    core.$_.set(result, key, value.store)
  }
  return result
}, {})

export default new Vuex.Store({
  modules: {
    app,
    notifications,
    ...plugins
  },
  strict: false
})
