import core from './../plugins/core'

export default {
  namespaced: true,
  state: {
    header: {
      color: 'white'
    },
    sidebar: {},
    alert: {
      title: '',
      content: '',
      type: '',
      isShowed: false
    },
    excelUsers: [],
    departments: [],
    isChatOpen: false,
    unreadMessagesCount: 0,
    mobileSidebar: false,
    progress: 0
  },
  getters: {
    excelUsers: state => state.excelUsers,
    departments: state => state.departments,
    isChatOpen: state => state.isChatOpen,
    unreadMessagesCount: state => state.unreadMessagesCount,
    mobileSidebar: state => state.mobileSidebar,
    progress: state => state.progress
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
        isShowed: false
      }
    },
    setExcelUsers (state, data) {
      state.excelUsers = data
    },
    setDepartments (state, data) {
      state.departments = data
    },
    openChat (state) {
      state.isChatOpen = true
    },
    closeChat (state) {
      state.isChatOpen = false
    },
    setUnreadMessagesCount (state, count) {
      state.unreadMessagesCount = count
    },
    toggleMobSidebar (state) {
      state.mobileSidebar = !state.mobileSidebar
    },
    setUploadProgress (state, progress) {
      state.progress = progress
    }
  }
}
