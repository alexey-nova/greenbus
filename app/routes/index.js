import Vue from 'vue'
import Router from 'vue-router'
import store from '#/store'
import core from './../plugins/core'

import App from '#/layouts/App'
import Profile from '#/pages/Profile'
import Index from '#/pages/Index'
import Users from '#/pages/Users'
import Tasks from '#/pages/Tasks'
import Memos from '#/pages/Memos'
import Contragents from '#/pages/Contragents'
import Calendar from '#/pages/Calendar'
import PaymentSchedule from '#/pages/PaymentSchedule'

import Auth from '#/layouts/Auth'
import Login from '#/pages/Login'
import Logout from '#/pages/Logout'

Vue.use(Router)

var router = new Router({
  routes: [
    {
      path: '/',
      component: App,
      children: [
        {
          path: '/',
          name: 'index',
          component: Index
        },
        {
          path: '/profile',
          name: 'profile',
          component: Profile
        },
        {
          path: '/users',
          name: 'users',
          component: Users,
        },
        {
          path: '/users/dep/:param1',
          name: 'usersByDep',
          component: Users,
        },
        {
          path: '/tasks',
          name: 'tasks',
          component: Tasks,
        },
        {
          path: '/tasks/:param1',
          name: 'tasksByFilter',
          component: Tasks,
        },
        {
          path: '/documents',
          name: 'documents',
          component: Memos,
        },
        {
          path: '/documents/:param1',
          name: 'documentsByFilter',
          component: Memos,
        },
        {
          path: '/documents1',
          name: 'documentsByFilter1',
          component: Memos,
        },
        {
          path: '/ca',
          name: 'contragents',
          component: Contragents
        },
        {
          path: '/ca/:folderId',
          name: 'folder',
          component: Contragents
        },
        {
          path: '/calendar',
          name: 'calendar',
          component: Calendar,
        },
        {
          path: '/ps',
          name: 'ps',
          component: PaymentSchedule,
        },
        {
          path: '/ps/:param1',
          name: 'psByFilter',
          component: PaymentSchedule
        }
      ]
    },
    {
      path: '/',
      component: Auth,
      children: [
        {
          path: '/login',
          name: 'login',
          component: Login
        },
        {
          path: '/logout',
          name: 'logout',
          component: Logout
        },
      ]
    }
  ]
})
router.beforeEach(function (to, from, next) {
  if (core.$session.get('jwt') === null && to.name !== 'login') {
    next({name: 'login'})
  } else if (core.$session.get('jwt') && to.name === 'login') {
    next({name: 'index'})
  } else {
    next()
  }
})

export default router
