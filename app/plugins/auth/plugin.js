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
      editUser (user) {
        return editUser(user)
      },
      logout () {
        destroy()
      }
    }
  },
  login (token) {
    if (token) {
      try {
        let user = JSON.parse(atob(token.split('.')[1]))
        user.fullname = unescape(user.fullname)
        install(token, user)
        core.$setToken(token)
        core.$api('get', 'users').then(response => {
          let newUser = core.$_.find(response.data, ['_id', user._id])
          user.position = newUser.position
          user.department = newUser.department
          user.fullname = newUser.fullname
          user.phone = newUser.phone
          user.admin = newUser.admin
          user.priveleges = newUser.priveleges
          install(token, user)
          location.reload()
        }).catch(e => {
          this.notify(e.response.data, 'danger')
        })
      } catch (e) {
        console.log(e)
        destroy()
      }
    }
  },

  install: (token, user) => install(token, user),
  destroy: () => destroy(),

  mixin: {}
}

let editUser = (user) => {
  install(core.$session.get('jwt'), user)
}
let install = (token, user) => {
  token = token || core.$session.get('jwt')
  user = user || core.$session.get('user')
  if (token && user) {
    core.$session.set('user', user)
    core.$session.set('jwt', token)
    core.$setToken(token)
    store.commit('auth/init', { token, user: core.$_.clone(user) })
  }
}
let destroy = () => {
  core.$session.remove('user')
  core.$session.remove('jwt')
  store.commit('auth/destroy')
  location.reload()
}
