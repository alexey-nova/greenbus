import _ from 'lodash'
import axios from 'axios'
import dateFormat from 'dateformat'
import config from './../../config'
import boot from './../../config/boot'

axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('jwt');

dateFormat.i18n = {
  dayNames: [
    'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat',
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
  ],
  monthNames: [
    'Янв', 'Фев', 'Мар', 'Апр', 'Мая', 'Июня', 'Июля', 'Авг', 'Сент', 'Окт', 'Нояб', 'Дек',
    'Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня', 'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря'
  ],
  timeNames: [
    'a', 'p', 'am', 'pm', 'A', 'P', 'AM', 'PM'
  ]
}

export default {
  $_: _,
  $session: {
    get (key) {
      try {
        return JSON.parse(localStorage.getItem(key))
      } catch (e) {
        return null
      }
    },
    set (key, data) {
      localStorage.setItem(key, JSON.stringify(data))
    },
    remove (key) {
      console.log('remove')
      console.log(localStorage.getItem(key))
      localStorage.removeItem(key)
      console.log(localStorage.getItem(key))
    },
  },

  $http (type, url, data = {}, options = {}) {
    return _.get(axios, type)(url, data, options)
  },
  $api (type, url, data = {}, options = {}) {
    url = config.app.apiUrl + url
    return _.get(axios, type)(url, data, options)
  },
  $mock (type, url, data = {}, options = {}) {
    let mockApiUrl = config.app.mockApiUrl
    if (mockApiUrl === 'localhost') {
      let path = window.location.pathname
      path = path.substring(0, path.lastIndexOf('/') + 1)
      path += (process.env.NODE_ENV === 'development') ? 'app/assets/copy/api/' : 'assets/api/'
      mockApiUrl = path
    }
    url = mockApiUrl + url +'.json'
    return _.get(axios, type)(url, data, options)
  },
  $setToken (token) {
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + token
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
  $log (message, color = false) {
    if (color) {
      if (color === 'success') color = 'green'
      if (color === 'danger') color = 'red'
      console.log('%c' + 'Core: ' + message, 'color: ' + color)
    } else {
      console.log(message)
    }
  },
  $dateFormat(date, format) {
    return dateFormat(date, format)
  },
}