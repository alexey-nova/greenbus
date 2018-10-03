let path = window.location.pathname
path = path.substring(0, path.lastIndexOf('/') + 1)
path += (process.env.NODE_ENV === 'development') ? 'app/assets/copy/api/' : 'assets/api/'
let apiUrl, soketUrl, fileUrl
if (process.env.NODE_ENV === 'development') {
  apiUrl = 'http://localhost:3333/api/'
  soketUrl = 'http://localhost:3333/'
  fileUrl = 'http://localhost:3333/'
} else {
  apiUrl = 'https://portal.greenbus.kz:3333/api/'
  soketUrl = 'https://portal.greenbus.kz:3333/'
  fileUrl = 'https://portal.greenbus.kz:3333/'
}

export default {
  apiUrl,
  soketUrl,
  fileUrl,
  // apiUrl: 'http://portal.greenbus.kz:3333/api/',
  // soketUrl: 'http://portal.greenbus.kz:3333/',
  // fileUrl: 'http://portal.greenbus.kz:3333/',
  // apiUrl: 'http://localhost:3333/api/',
  // soketUrl: 'http://localhost:3333/',
  // fileUrl: 'http://localhost:3333/',
  // это короче для тестового сервака
  // apiUrl: 'http://195.93.152.79:3333/api/',
  // soketUrl: 'http://195.93.152.79:3333/',
  // fileUrl: 'http://195.93.152.79:3333/',
  // вообще другой тестовый сервер
  // apiUrl: 'http://159.89.98.114:3333/api/',
  // soketUrl: 'http://159.89.98.114:3333/',
  // fileUrl: 'http://159.98.89.114:3333/',
  mockApiUrl: path
}
