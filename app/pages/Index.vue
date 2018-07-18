<template>
  <div class="working_area">
    <div class="flex mobile-reverse">
      <div class="flex-left">
        <div class="white-block">
          <p class="title">Просроченные задачи</p>
          <p v-if="deadlined.length === 0" class="title2">Просроченных задач нет</p>
          <div v-else class="flex mobile-block">
            <div class="mini-table">
              <table class="mob-none">
                  <tr class="green">
                      <td width="22%">Задача</td>
                      <td width="19%">Приоритет</td>
                      <td width="39%">Срок до</td>
                      <td width="20%">От кого</td>
                  </tr>
                  <tr v-for="dl in deadlined" :key="dl._id">
                    <td>
                      <router-link class="green_anchor" :to="{name: 'tasks', query: {type: 'show', task: dl._id}}">
                        {{dl.name}}
                      </router-link>
                    </td>
                    <td>{{dl.urgency ? 'Срочная' : 'Простая'}} задача</td>
                    <td>{{$dateFormat(dl.deadline, 'd mmm yyyy, HH:MM')}}</td>
                    <td>{{getUser(dl.from).fullname}}</td>
                  </tr>
              </table>
              <div class="mob-block">
                <table width="100%" class="mob-margin" v-for="dl in deadlined" :key="dl._id">
                  <tr class="green">
                    <td>
                      <div class="flex">
                        <div class="m-item">
                        </div>
                        <div class="m-item">
                          <router-link class="green_anchor white" :to="{name: 'tasks', query: {type: 'show', task: dl._id}}">
                            Подробнее
                          </router-link>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <span>Задача:</span>
                      <span class="bold">{{dl.name}}</span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <span>Приоритет:</span>
                      <span class="bold">{{dl.urgency ? 'Срочная' : 'Простая'}} задача</span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <span>Срок до:</span>
                      <span class="bold">{{$dateFormat(dl.deadline, 'd mmm yyyy, HH:MM')}}</span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <span>От кого:</span>
                      <span class="bold">{{getUser(dl.from).fullname}}</span>
                    </td>
                  </tr>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div class="white-block">
          <p class="title">Служебные записки на согласовании</p>
          <p v-if="filteredBids.length === 0" class="title2">Служебных записок нет</p>
          <div v-else class="mini-table">
            <table class="mob-none">
              <tr class="green">
                <td width="5%" class="id">ID</td>
                <td width="35%">Тема</td>
                <td width="30%">От кого</td>
                <td width="30%">Подробнее</td>
              </tr>
              <tr v-for="bid in filteredBids" :key="bid._id">
                <td>{{bid.id}}</td>
                <td>{{bid.name}}</td>
                <td>{{bid.userFrom}}</td>
                <td><a href="#" class="green_anchor" @click="goTo('documentsByFilter', { param1: 'in' }, {type: 'show', bid: bid._id})">Подробнее</a></td>
              </tr>
            </table>
            <div class="mob-block">
              <table width="100%" class="mob-margin" v-for="bid in filteredBids" :key="bid._id">
                <tr class="green">
                  <td>
                    <div class="flex">
                      <div class="m-item">
                        <span>ID №{{bid.id}}</span>
                      </div>
                      <div class="m-item">
                        <a class="green_anchor white" @click="goTo('documentsByFilter', { param1: 'in' }, {type: 'show', bid: bid._id})">Подробнее</a>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>
                    <span>Тема:</span>
                    <span class="bold">{{bid.name}}</span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <span>От кого:</span>
                    <span class="bold">{{bid.userFrom}}</span>
                  </td>
                </tr>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div class="flex-right">
        <div class="calendar">
          <div class="calendar-top">
              <span class="week_day">
                {{dateTasks.length > 0 ? $dateFormat(dateTasks[0].deadline, 'dddd') : $dateFormat(selectedDate, 'dddd')}}
              </span>
              <span class="week_day small">
                <span>{{$dateFormat(selectedDate, 'd')}}</span>
                <span>
                  {{$dateFormat(selectedDate, 'mmmm')}}
                </span>
              </span>
          </div>
          <div class="calendar-arrows">
              <div class="flex">
                  <a href="#" class="left-arr" @click="prevMonth()">
                      <img src="~assets/img/arr-left.png">
                  </a>
                  <div class="center-arr">
                      <span>{{getMonthName(currentMonth).prevMonth}}</span>
                      <span class="upper">{{getMonthName(currentMonth).thisMonth}}</span>
                      <span>{{getMonthName(currentMonth).nextMonth}}</span>
                  </div>
                  <a href="#" class="right-arr">
                      <img src="~assets/img/arr-right.png" @click="nextMonth()">
                  </a>
              </div>
          </div>
          <div class="calendar-tasks">
              <div class="tasks">
                  <div class="tasks-item">
                      <p v-for="task in dateTasks" :key="task._id">
                        <router-link :to="{name: 'tasks', query: {type: 'show', task: task._id}}">
                          {{task.name}}
                        </router-link>
                      </p>
                  </div>
              </div>
          </div>
          <div class="days">
            <div class="flex-days">
              <full-calendar :events="events" :config="config" :header="header" ref="calendar"></full-calendar>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import PageTitle from '@/PageTitle'
import { FullCalendar } from 'vue-full-calendar'
require('../assets/fullcalendar.css')

export default {
  components: {
    PageTitle,
    FullCalendar
  },
  data() {
    return {
      bids: [],
      seoTitle: this.$trans('pages.index.seoTitle'),
      dateTasks: [],
      deadlined: [],
      today: '',
      tomorrow: '',
      week: '',
      tasks: '',
      selectedDate: new Date(),
      events: [],
      currentMonth: this.selectedDate || new Date(),
      config: {
        weekends: true,
        locale: 'ru',
        defaultView: 'month',
        themeSystem: 'bootstrap3',
        contentHeight: 400,
        selectable: true,
        dayClick: (date, jsEvent, view) => {
          this.selectedDate = date._d
          this.renderTasks(date._d)
        }
      },
      header: {
        left: '',
        center: '',
        right: ''
      },
      users: []
    }
  },
  computed: {
    filteredBids () {
      return this.bids.map(item => {
        const user = this.users.find(u => u._id === item.createdBy)
        item.userFrom = user ? user.fullname : ''
        return item
      })
    }
  },
  methods: {
    nextMonth () {
      this.$refs.calendar.fireMethod('next')
      this.currentMonth = this.$refs.calendar.fireMethod('getDate')._d
    },
    prevMonth () {
      this.$refs.calendar.fireMethod('prev')
      this.currentMonth = this.$refs.calendar.fireMethod('getDate')._d
    },
    getMonthName (date) {
      const arr = [
        'Январь',
        'Февраль',
        'Март',
        'Апрель',
        'Май',
        'Июнь',
        'Июль',
        'Август',
        'Сентябрь',
        'Октябрь',
        'Ноябрь',
        'Декабрь'
      ]

      return {
        thisMonth: arr[new Date(this.currentMonth).getMonth()],
        nextMonth: arr[new Date(this.currentMonth).getMonth() + 1],
        prevMonth: arr[new Date(this.currentMonth).getMonth() - 1]
      }
    },
    loadUsers () {
      this.$api('get', 'users')
        .then(response => {
          this.users = response.data
        })
        .catch(e => {
          this.notify(e, 'danger')
        })
    },
    getUser (_id) {
      let user = this.$_.find(this.users, u => u._id === _id)
      return user ? user : {}
    },
    goTo (name, params, query) {
      this.$router.push({ name, params, query })
    },
    renderTasks (date) {
      this.dateTasks = []
      this.tasks.map(task => {
        if (new Date(date).toDateString() === new Date(task.deadline).toDateString()) {
          this.dateTasks.push(task)
        }
      })
    },
    loadTasks () {
      this.$api('get', 'tasks').then(response => {
        this.today = response.data.deadlines.today
        this.tomorrow = response.data.deadlines.tomorrow
        this.week = response.data.deadlines.week
        const calendarTasks = []
        const groups = response.data.tasks.reduce((groups, task) => {
          const date = task.deadline.split('T')[0]
          if (!groups[date]) groups[date] = []
          groups[date].push(task)
          return groups
        }, {})
        Object.keys(groups).forEach((group, groupIndex) => {
          this.events.push({
            title: groups[group].length,
            start: group,
            editable: false
          })
        })
        this.tasks = response.data.tasks.sort((a, b) => {
          let dateA = new Date(a.deadline),
            dateB = new Date(b.deadline)
          return dateA - dateB
        })
        this.tasks.forEach(task => {
          response.data.deadlines.deadlined.forEach(dl => {
            if (task._id === dl._id) this.deadlined.push(task)
          })
        })
        this.renderTasks(this.selectedDate)
      }).catch(err => {
        console.log(err)
        this.notify('Временная ошибка', 'danger')
      })
    },
    loadBids () {
      this.$api('get', 'bids/?filter=in').then(response => {
        this.bids = response.data.bids
      })
    }
  },
  mounted () {
    this.loadUsers()
    this.loadTasks()
    this.loadBids()
  }
}
</script>

<style scoped>
.mini-table {
  width: 100%;
  height: 200px;
  overflow-y: scroll;
}
</style>
