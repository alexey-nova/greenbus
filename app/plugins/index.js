import Vue from 'vue'
import core from './core'
import boot from './../config/boot'
import './libs'

let plugins = core.$_.mapValues(boot.plugins, 'plugin')

Vue.use({
  install (Vue, options) {
    plugins.auth.install()
    plugins.translate.install()


    // global
    Vue.prototype.$_ = core.$_
    Vue.prototype.$http = core.$http
    Vue.prototype.$api = core.$api
    Vue.prototype.$mock = core.$mock
    Vue.prototype.$config = core.$config
    Vue.prototype.$log = core.$log
    Vue.prototype.$dateFormat = core.$dateFormat

    Vue.prototype.$isRoute = plugins.app.isRoute
    Vue.prototype.$createFormData = plugins.app.createFormData

    Vue.prototype.$auth = plugins.auth.auth
    Vue.prototype.$login = plugins.auth.login

    Vue.prototype.$trans = plugins.translate.trans


    // mixins
    // Vue.mixin(plugins.auth.mixin)
    Vue.mixin(plugins.seo.mixin)
  }
})
