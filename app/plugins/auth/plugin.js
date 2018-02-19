import store from '#/store'
import core from './../core'

export default {
  auth () {
    return {
      user: store.state.auth.user,
      token: store.state.auth.token,
      hasRole (role) {
        return store.state.auth.user.admin
      },
      logout () {
        store.commit('auth/destroy')
      }
    }
  },
  login (token) {
    if (token) {
      try {
        let user = JSON.parse(atob(token.split('.')[1]))
        let userId = user._id
        core.$setToken(token)
        localStorage.setItem('jwt', token);
        store.commit('auth/init', {token: token, user: _.clone(user)})

        core.$api('get', 'users').then(response => {
          let newUser = core.$_.find(response.data, ['_id', userId])
          user.position = newUser.position
          user.department = newUser.department
          user.fullname = newUser.fullname
          user.phone = newUser.phone
          user.whatsapp = newUser.whatsapp
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
