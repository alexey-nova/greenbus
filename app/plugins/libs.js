import Vue from 'vue'
import {ClientTable} from 'vue-tables-2';
import Notifications from 'vue-notification'

//
Vue.use(ClientTable, {
  texts:{
    count:"Показано с {from} по {to} из {count} записей|{count} записей|Одна запись",
    filter:"Поиск: ",
    filterPlaceholder:"Начните искать",
    limit:"Записи:",
    page:"Страница:",
    noResults:"Ничего не найдено",
    filterBy:"Фильтр по {column}",
    loading:'Загрузка...',
    defaultOption:'Выбрать {column}',
    columns:'Колонки'
  },
}, false, 'bootstrap3', 'default');

//
const notify = {
  install (Vue, options) {
    Vue.mixin({
      methods: {
        notify (text, type = 'success', options = {}) {
          if (type === 'danger') type = 'error'
          this.$notify({
            ...options,
            text: text,
            type: type,
          })
        }
      }
    })
  },
}
Vue.use(Notifications)
Vue.use(notify)