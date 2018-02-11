import core from './../core'

export default {
  namespaced: true,
  state: {
    lang: {},
    locales: {},
    current: ''
  },
  getters: {
    trans: (state) => (id) => {
      return core.$_.get(state.lang, id)
    },
  },
  mutations: {
    init (state, lang) {
      state.lang = lang
    },
    changeLocale (state, locale) {
      state.current = locale
    },
  },
}
