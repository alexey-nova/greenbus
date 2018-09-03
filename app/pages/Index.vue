<template>
  <div class="working_area">
    <div class="flex mobile-reverse">
      <div class="flex-left">
        <div class="white-block" v-if="1 === 2"> <!-- УБРАТЬ КОГДА ВЕРНУТ ЗАДАЧИ -->
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
          <p class="title">Заявки на согласовании</p>
          <p v-if="filteredBids.length === 0" class="title2">Заявок нет</p>
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
        <div class="white-block">
          <p class="title">Служебные записки на согласовании</p>
          <p v-if="filteredFreeBids.length === 0" class="title2">Служебных записок нет</p>
          <div v-else class="mini-table">
            <table class="mob-none">
              <tr class="green">
                <td width="5%" class="id">ID</td>
                <td width="35%">Тема</td>
                <td width="20%">От кого</td>
                <td width="20%">Срок сдачи</td>
                <td width="20%">Подробнее</td>
              </tr>
              <tr v-for="bid in filteredFreeBids" :key="bid._id">
                <td>{{bid.id}}</td>
                <td>{{bid.name}}</td>
                <td>{{bid.nameFrom}}</td>
                <td>{{bid.prettyDeadline}}</td>
                <td><a class="green_anchor" @click="goTo('freebidsByFilter', { param1: 'in' }, { type: 'show', bid: bid._id })">Подробнее</a></td>
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
                        <a class="green_anchor white" @click="goTo('freebidsByFilter', { param1: 'in' }, {type: 'show', bid: bid._id})">Подробнее</a>
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
                    <span class="bold">{{bid.nameFrom}}</span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <span>Срок сдачи:</span>
                    <span class="bold">{{bid.prettyDeadline}}</span>
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
                {{$dateFormat(selectedDate, 'dddd')}}
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
              <div>
                <p v-for="bid in dateBids" :key="bid._id">
                  <router-link :to="{name: 'freebids', query: {type: 'show', bid: bid._id}}">
                    <strong>Служебная записка №{{bid.id}}</strong>: {{bid.name}}
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
import { FullCalendar } from 'vue-full-calendar'
require('../assets/fullcalendar.css')

export default {
  components: {
    FullCalendar
  },
  data () {
    return {
      bids: [],
      freebids: [],
      dateBids: [],
      seoTitle: this.$trans('pages.index.seoTitle'),
      // dateTasks: [],
      // deadlined: [],
      // today: '',
      // tomorrow: '',
      // week: '',
      // tasks: '',
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
          this.showBidsInCalendar(date._d)
        },
        eventClick: (event) => {
          this.selectedDate = event.start._d
          this.showBidsInCalendar(event.start._d)
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
    },
    filteredFreeBids () {
      return this.freebids.map(bid => {
        const nameFrom = this.users.find(user => user._id === bid.createdBy)
        bid.nameFrom = nameFrom && nameFrom.fullname

        bid.prettyDeadline = this.$dateFormat(bid.deadline, 'd mmmm yyyy')
        return bid
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
      this.$api('get', 'users').then(response => {
        this.users = response.data
      }).catch(e => {
        this.notify(e.response.data.message, 'danger')
      })
    },
    getUser (_id) {
      let user = this.$_.find(this.users, u => u._id === _id)
      return user || {}
    },
    goTo (name, params, query) {
      this.$api('post', `notifications/${query.bid}`).then(response => {
        this.$store.commit('notifications/readNotification', query.bid)
      })
      this.$router.push({ name, params, query })
    },
    loadTasks () {
      this.$api('get', 'tasks').then(response => {
        this.today = response.data.deadlines.today
        this.tomorrow = response.data.deadlines.tomorrow
        this.week = response.data.deadlines.week
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
          const dateA = new Date(a.deadline),
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
    },
    loadFreeBids () {
      this.$api('get', 'freebids/?filter=in').then(response => {
        this.freebids = response.data.bids.filter(bid => {
          if (bid.to.find(item => item.user === this.$auth().user._id && (item.status === 'confirmed' || item.status === 'declined'))) return false
          return true
        })
        // группировка служебок по дедлайну
        const groups = this.freebids.reduce((prev, item) => {
          const date = this.$dateFormat(new Date(item.deadline), 'yyyy-mm-dd')
          if (!prev.date) prev[date] = []
          prev[date].push(item)
          return prev
        }, {})
        Object.keys(groups).forEach((group, groupIndex) => {
          this.events.push({
            title: groups[group].length,
            start: group,
            editable: false
          })
        })
        this.showBidsInCalendar(this.selectedDate)
        // this.$log(response.data.bids)
      })
    },
    renderTasks (date) {
      this.dateTasks = []
      this.tasks.map(task => {
        if (new Date(date).toDateString() === new Date(task.deadline).toDateString()) {
          this.dateTasks.push(task)
        }
      })
    },
    showBidsInCalendar (date) {
      this.dateBids = []
      this.freebids.map(bid => {
        if (new Date(date).toDateString() === new Date(bid.deadline).toDateString()) {
          this.dateBids.push(bid)
        }
      })
    }
  },
  mounted () {
    this.loadUsers()
    // this.loadTasks()
    this.loadBids()
    this.loadFreeBids()
  }
}
</script>

<style scoped lang="scss">
div {
  .mini-table {
    width: 100%;
    height: 200px;
    overflow-y: scroll;
  }

  .title {
    font-size: 1.5em;
  }
  .strong {
    font-family: cbold;
    font-weight: 400;
  }
}
</style>
