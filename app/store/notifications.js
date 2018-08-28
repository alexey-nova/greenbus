export default {
  namespaced: true,
  state: {
    notifications: []
  },
  mutations: {
    readNotification (state, moduleId) {
      state.notifications = state.notifications.filter(item => item.module.moduleId !== moduleId)
    },
    readNotifications (state) {
      state.notifications = []
    },
    addNotification (state, notification) {
      state.notification.unshift(notification)
    },
    addNotifications (state, notifications) {
      state.notifications = notifications
    }
  },
  getters: {
    notifications: state => state.notifications
  }
}
