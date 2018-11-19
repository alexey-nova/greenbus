let path = window.location.pathname
path = path.substring(0, path.lastIndexOf('/') + 1)
path += (process.env.NODE_ENV === 'development') ? 'app/assets/copy/api/' : 'assets/api/'
let apiUrl, soketUrl, fileUrl
if (process.env.NODE_ENV === 'development') {
  apiUrl = 'http://localhost:3333/api/'
  soketUrl = 'http://localhost:3333/'
  fileUrl = 'http://localhost:3333/'
} else {
  apiUrl = 'https://portal.greenbus.kz/api/'
  soketUrl = 'https://portal.greenbus.kz/'
  fileUrl = 'https://portal.greenbus.kz/'
}

export default {
  // apiUrl,
  // soketUrl,
  // fileUrl,
  apiUrl: 'https://portal.greenbus.kz/api/',
  soketUrl: 'https://portal.greenbus.kz/',
  fileUrl: 'https://portal.greenbus.kz/',
  // apiUrl: 'http://localhost:3333/api/',
  // soketUrl: 'http://localhost:3333/',
  // fileUrl: 'http://localhost:3333/',
  // это короче для тестового сервака
  // apiUrl: 'http://195.93.152.79:3333/api/',
  // soketUrl: 'http://195.93.152.79:3333/',
  // fileUrl: 'http://195.93.152.79:3333/',
  // вообще другой тестовый сервер
  // apiUrl: 'http://192.168.88.14:3333/api/',
  // soketUrl: 'http://192.168.88.14:3333/',
  // fileUrl: 'http://192.168.88.14:3333/',
  mockApiUrl: path
}
