let path = window.location.pathname
path = path.substring(0, path.lastIndexOf('/') + 1)
path += (process.env.NODE_ENV === 'development') ? 'app/assets/copy/api/' : 'assets/api'

export default {
  apiUrl: 'http://portal.greenbus.kz:3333/api/',
  mockApiUrl:  path,
}