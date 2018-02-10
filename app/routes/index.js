import Vue from 'vue'
import Router from 'vue-router'
import store from '#/store'

import App from '#/layouts/App'
import Index from '#/pages/Index'
import Users from '#/pages/Users'
import Tasks from '#/pages/Tasks'
import Memos from '#/pages/Memos'
import Calendar from '#/pages/Calendar'

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
          path: '/calendar',
          name: 'calendar',
          component: Calendar,
        },
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
  if (!localStorage.getItem('jwt') && to.name !== 'login') {
    next({name: 'login'})
  } else if (localStorage.getItem('jwt') && to.name === 'login') {
    next({name: 'index'})
    next()
  } else {
    next()
  }
})

export default router
