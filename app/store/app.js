import core from './../plugins/core'

export default {
  namespaced: true,
  state: {
    header: {
      color: 'white',
    },
    sidebar: {},
    alert: {
      title: '',
      content: '',
      type: '',
      isShowed: false,
    },
  },
  getters: {

  },
  mutations: {
    setSidebar (state, data) {
      state.sidebar = data
    },
    setHeaderColor (state, data) {
      state.header.color = data
    },
    showAlert (state, data) {
      let alert = core.$_.clone(state.alert)
      alert.title = data.title
      alert.content = data.content
      alert.type = data.type
      alert.isShowed = true
      state.alert = alert
    },
    hideAlert (state) {
      state.alert = {
        title: '',
        content: '',
        type: '',
        isShowed: false,
      }
    },
  },
}
