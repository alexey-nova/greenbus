import store from '#/store'
import core from './../core'

export default {
  auth () {
    return {
      user: store.state.auth.user,
      token: store.state.auth.token,
      hasRole (role) {
        return core.$_.get(store.state.auth.user, role)
      },
      logout () {
        store.commit('auth/destroy')
      }
    }
  },
  login (token) {
    if (token) {
      try {
        let userId = JSON.parse(atob(token.split('.')[1]))._id
        core.$setToken(token)
        localStorage.setItem('jwt', token)
        core.$api('get', 'users').then(response => {
          let user = core.$_.find(response.data, ['_id', userId])
          store.commit('auth/init', {token: token, user: user})
        }).catch(e => {
          this.notify(e.response.data, 'danger')
        })
      } catch (e) {
        store.commit('auth/destroy')
      }
    }
  },

  install () {
    let token = localStorage.getItem('jwt')
    this.login(token)
  },
  mixin: {},
}
