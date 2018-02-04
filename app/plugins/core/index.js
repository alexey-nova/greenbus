import _ from 'lodash'
import axios from 'axios'
import config from './../../config'
import boot from './../../config/boot'


let apiUrl = config.app.apiUrl
let mockApiUrl = config.app.mockApiUrl
if (mockApiUrl === 'localhost') {
  let path = window.location.pathname
  path = path.substring(0, path.lastIndexOf('/') + 1)
  path += (process.env.NODE_ENV === 'development') ? 'app/assets/copy/api/' : 'assets/api/'
  mockApiUrl = path
}
let api = axios.create({
  baseURL: apiUrl,
  headers: {Authorization: `Bearer ${localStorage.getItem('jwt')}`},
})
let mock = axios.create({
  baseURL: mockApiUrl,
  headers: {Authorization: `Bearer ${localStorage.getItem('jwt')}`},
})
let get = mock.get.bind({})
mock.get = (url, cfg) => get(url + '.json', cfg)
let post = mock.post.bind({})
mock.post = (url, data, cfg) => post(url + '.json', data, cfg)


export default {
  $_: _,

  $http (type, url, data = {}, options = {}) {
    return _.get(axios, type)(url, data, options)
  },
  $api (type, url, data = {}, options = {}) {
    return _.get(api, type)(url, data, options)
  },
  $mock (type, url, data = {}, options = {}) {
    return _.get(mock, type)(url, data, options)
  },
  $config (name) {
    let cfg = _.get(config, name)
    if (!cfg) {
      name = name.split('/')
      let plugin = name.shift()
      cfg = _.get(boot.plugins, `${plugin}.config.${name[0]}`)
    }
    return cfg ? cfg : false
  },
  $log (message, color = 'black') {
    if (color === 'success') color = 'green'
    if (color === 'danger') color = 'red'
    console.log('%c' + 'Core: ' + message, 'color: ' + color)
  },
}