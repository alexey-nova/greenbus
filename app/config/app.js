let path = window.location.pathname
path = path.substring(0, path.lastIndexOf('/') + 1)
path += (process.env.NODE_ENV === 'development') ? 'app/assets/copy/api/' : 'assets/api'

export default {
  apiUrl: 'http://portal.greenbus.kz:3333/api/',
  soketUrl: 'http://portal.greenbus.kz:3333/',
  fileUrl: 'http://portal.greenbus.kz:3333/',
  // apiUrl: 'http://localhost:3333/api/',
  // soketUrl: 'http://localhost:3333/',
  // fileUrl: 'http://localhost:3333/',
  mockApiUrl:  path,
}
