let path = window.location.pathname
path = path.substring(0, path.lastIndexOf('/') + 1)
path += (process.env.NODE_ENV === 'development') ? 'app/assets/copy/api/' : 'assets/api'

export default {
  apiUrl: 'http://195.93.152.79:3333/api/',
  mockApiUrl:  path,
}