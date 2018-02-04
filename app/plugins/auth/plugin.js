import store from '#/store'

export default {
  auth () {
    return {
      user: store.state.auth.user,
      token: store.state.auth.token,
      hasRole (role) {
        store.getters.hasRole(role)
      },
      logout () {
        store.commit('auth/destroy')
      }
    }
  },
  login (token) {
    if (token) {
      let user = JSON.parse(atob(token.split('.')[1]))
      user['fullname'] = unescape(user.fullname)
      localStorage.setItem('jwt', token);

      store.commit('auth/init', {token: token, user: user})
    }
  },

  install () {
    let token = localStorage.getItem('jwt')
    this.login(token)
  },
  mixin: {},
}
