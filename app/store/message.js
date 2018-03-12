export default {
  namespaced: true,
  state: {
    unreadMessages: [{
      author: '5a7d76372ffda86e8c25fd0d',
      messages: [
        'text'
      ]
    }]
  },
  getters: {
    getUnreadMessages: state => id => {
      return state.unreadMessages.filter(p => p.author === id)
    }
  },
  mutations: {
    newUnreadMsg (state, payload) {
      var indexAuthor = state.unreadMessages.findIndex(item => item.author === payload.author)
      if (indexAuthor > -1) {
        state.unreadMessages.messages.push(payload)
      } else {
        state.unreadMessages.push({
          author: payload.author,
          messages: [payload]
        })
      }
    }
  }
}
