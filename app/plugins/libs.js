import core from './core'
import Vue from 'vue'
import {ClientTable} from 'vue-tables-2'
import Notifications from 'vue-notification'
import VeeValidate, { Validator } from 'vee-validate'
import VeeValidateRu from 'vee-validate/dist/locale/ru'
import VueSocketio from 'vue-socket.io'

//
Vue.use(ClientTable, {
  texts: {
    count: 'Показано с {from} по {to} из {count} записей|{count} записей|Одна запись',
    filter: 'Поиск: ',
    filterPlaceholder: 'Начните искать',
    limit: 'Записи:',
    page: 'Страница:',
    noResults: 'Ничего не найдено',
    filterBy: 'Фильтр по {column}',
    loading: 'Загрузка...',
    defaultOption: 'Выбрать {column}',
    columns: 'Колонки'
  }
}, false, 'bootstrap3', 'default')

//
const notify = {
  install (Vue, options) {
    Vue.mixin({
      methods: {
        notify (text, type = 'success', options = {}) {
          if (type === 'danger') type = 'error'
          this.$notify({
            ...options,
            text,
            type
          })
        }
      }
    })
  }
}
Vue.use(Notifications)
Vue.use(notify)

//
Validator.localize('ru', VeeValidateRu)
Vue.use(VeeValidate, {
  locale: 'ru',
  fieldsBagName: 'formFields',
  dictionary: {
    ru: { attributes: {
      login: 'Логин',
      email: 'Email',
      fullname: 'Ф.И.О',
      department: 'Отдел',
      position: 'Должность',
      phone: 'Телефон',
      whatsapp: 'Whatsapp',
      name: 'Название',
      description: 'Описание',
      text: 'Описание',
      urgency: 'Важность',
      to: 'Ответственный',
      memoTo: 'Кому',
      deadline: 'Срок сдачи',
      currentPassword: 'Текущий пароль',
      password: 'Новый пароль',
      confirmPassword: 'Новый пароль еще раз',
      comment: 'Комментарий',
      endDate: 'Время окончания'
    }}
  }
})

Vue.use(VueSocketio, core.$config('app.soketUrl'))
