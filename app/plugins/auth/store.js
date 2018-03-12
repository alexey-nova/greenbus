import axios from 'axios'
import _ from 'lodash'

export default {
  namespaced: true,
  state: {
    user: {},
    token: ''
  },
  mutations: {
    init (state, data) {
      state.user = data.user
      state.token = data.token
    },
    destroy (state) {
      state.user = {}
      state.token = ''
    }
  },
}