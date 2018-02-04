import store from '#/store'
import core from './../core'

export default {
  trans (id) {
    return store.getters['translate/trans'](id)
  },

  install () {
    // Load language pack from server
    let from = core.$config('translate/fromLocal') ? '$mock' : '$api'
    core.$_.get(core, from)('get', core.$config('translate/apiUrl')).then(response => {
      store.commit('translate/init', response.data)
    }).catch(e => {
      core.$log(e)
    })

  },
  mixin: {},
}
