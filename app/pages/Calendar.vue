<template>
  <div class="container-box">
      <div class="working_area">
      <div class="flex margin-bottom align-center">
        <div class="search big-form">
          <form>
            <span>Выбрать период:</span>
            <select @change="changeView()" v-model="displayPeriodUom">
              <option value="month">месяц</option>
              <option value="week">неделя</option>
              <option value="day">день</option>
            </select>
          </form>
        </div>
        <div class="add m-align-end">
          <!--//mobile-->
          <div class="search big-form mob-block c-column">
          </div>
          <!--//mobile-->
          <button class="add-button auto-width" data-toggle="modal" data-target="#event" @click="toggleModal('create', {}, 'create')"><img src="~assets/img/add.png">Создать событие</button>
        </div>
      </div>
      <div class="flex">
        <div class="calendar">
          <div v-if="selectedView === 'month'">
            <div class="calendar-top mob-none">
              <span class="week_day">
                <a href="#" class="left-arr" @click="prevYear()">
                  <img src="~assets/img/arr-left.png">
                </a>
                {{ currentYear }}
                <a href="#" class="right-arr">
                  <img src="~assets/img/arr-right.png" @click="nextYear()">
                </a>
              </span>
            </div>
            <div class="month-mobile mob-block">
             <div class="flex align-center">
               <a href="#" class="left-arr">
                 <img src="~assets/img/arr-left.png" @click="prevMonth()">
               </a>
               <div class="center-arr">
                 <span class="upper">{{getMonthName(currentMonth).thisMonth}}</span>
                 <span>{{ currentYear }}</span>
               </div>
               <a href="#" class="right-arr">
                 <img src="~assets/img/arr-right.png" @click="nextMonth()">
               </a>
             </div>
           </div>
            <div class="month mob-none">
              <a v-for="(month, index) in getMonths()" :key="`month-${index}`" :class="{'active': month.isCurrent}" @click="changeCurrentMonth(month.index)">
                <span>{{month.name}}</span>
              </a>
            </div>
          </div>
          <div v-if="selectedView === 'week'" class="calendar-top">
            <span class="week_day">
              <a href="#" class="left-arr" @click="prevWeek()">
                <img src="~assets/img/arr-left.png">
              </a>
              <span>{{$dateFormat(monday, 'd')}} {{$dateFormat(monday, 'mmmm')}} - </span>
              <span>{{$dateFormat(sunday, 'd')}} {{$dateFormat(sunday, 'mmmm')}}, {{currentYear}}</span>
              <a href="#" class="right-arr">
                <img src="~assets/img/arr-right.png" @click="nextWeek()">
              </a>
            </span>
          </div>
          <div v-if="selectedView === 'day'" class="calendar-top">
            <span class="week_day">
              <a href="#" class="left-arr" @click="prevDay()">
                <img src="~assets/img/arr-left.png">
              </a>
              {{$dateFormat(selectedDate, 'd')}}
              {{$dateFormat(selectedDate, 'mmmm')}},
              {{currentYear}}
              <a href="#" class="right-arr">
                <img src="~assets/img/arr-right.png" @click="nextDay()">
              </a>
            </span>
          </div>
          <div class="days">
            <div class="flex-days mob-none">
              <full-calendar
                :config="config"
                ref="calendar"
                :events="eventsForComponent"/>
            </div>
            <div class="flex-days mob-block">
              <full-calendar
              :config="configMobile"
              ref="calendarMobile"
              :events="eventsForMobile"/>
            </div>
          </div>
        </div>
      </div>
      <div class="mob-block mob-task">
        <a v-for="event in dateEvents" :key="event._id" class="mob-task-item green-i" @click="getMeeting(event._id)">
          <span class="img-span"></span>
          <span>{{event.name}}</span>
        </a>
      </div>
    </div>
    <ModalCreate :model="modal.create" :users="users" :positions="positions" :type="type" @onUpdate="updateMeeting" @onSubmit="createMeeting" @onClose="toggleModal('create')"></ModalCreate>
    <ModalCreate :model="modal.edit" :users="users" :positions="positions" :type="type" @onUpdate="updateEditMeeting" @onSubmit="editMeeting" @onClose="toggleModal('edit')"></ModalCreate>
  </div>
</template>

<script>
import PageTitle from '@/PageTitle'
import Box from '@/Box'
import PageButtons from '@/PageButtons'
import ModalCreate from './calendar/ModalCreateMeeting'
import CalendarView from 'vue-simple-calendar'
import CalendarMathMixin from 'vue-simple-calendar/dist/calendar-math-mixin.js'
import { FullCalendar } from 'vue-full-calendar'
require('../assets/fullcalendar.css')
require('vue-simple-calendar/dist/static/css/default.css')

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

export default {
  name: 'App',
  components: {
    PageButtons,
    PageTitle,
    Box,
    CalendarView,
    CalendarMathMixin,
    ModalCreate,
    FullCalendar
  },
  data () {
    return {
      positions: [],
      dateEvents: [],
      tasks: [],
      selectedDate: new Date(),
      currentMonth: this.selectedDate || new Date(), // old
      currentYear: (new Date()).getFullYear(),
      monday: new Date(),
      sunday: new Date(),
      selectedView: 'month',
      config: {
        slotLabelFormat: 'HH:mm',
        allDaySlot: false,
        weekends: true,
        locale: 'ru',
        defaultView: 'month',
        themeSystem: 'bootstrap3',
        contentHeight: 'auto',
        selectable: true,
        dayClick: (date, jsEvent, view) => {
          this.selectedDate = date._d
          // this.currentMonth = date._d
          this.renderEvents(date._d)
        },
        eventClick: (event) => {
          this.getMeeting(event.id)
          this.message = `You clicked: ${event.title}`
        }
      },
      configMobile: {
        allDaySlot: false,
        weekends: true,
        locale: 'ru',
        defaultView: 'month',
        themeSystem: 'bootstrap3',
        contentHeight: 'auto',
        selectable: true,
        dayClick: (date, jsEvent, view) => {
          this.selectedDate = date._d
          this.renderEvents(date._d)
        }
      },
      meetings: [],
      modal: {
        create: false,
        edit: false
      },
      showDate: this.thisMonth(1),
      message: 'Click a date or event...',
      alreadyAdded: false,
      startingDayOfWeek: 1,
      disablePast: false,
      disableFuture: false,
      displayPeriodUom: 'month',
      displayPeriodCount: 1,
      // showEventTimes: true,
      events: [],
      users: [],
      type: 'create'
    }
  },
  computed: {
    userLocale () {
      return CalendarMathMixin.methods.getDefaultBrowserLocale
    },
    dayNames () {
      return CalendarMathMixin.methods.getFormattedWeekdayNames(this.userLocale, 'long', 0)
    },
    eventsForComponent: {
      get: function () {
        return this.$_.map(this.events, event => {
          let e = {
            id: event._id,
            title: event.name,
            start: event.startDate,
            end: event.endDate
          }
          if (event.status === 'confirmed') {
            e.classes = 'green'
          } else if (event.status === 'rejected') {
            e.classes = 'red'
          } else {
            e.classes = 'grey'
          }

          return e
        })
      },
      set: function (eventsForComponent) {
        return this.$_.map(eventsForComponent, event => {
          return {
            _id: event.id,
            name: event.title,
            start: event.startDate,
            end: event.endDate
          }
        })
      }
    },
    eventsForMobile: {
      get: function () {
        const groups = this.events.reduce((groups, event) => {
          const date = event.startDate
          if (!groups[date]) groups[date] = []
          groups[date].push(event)
          return groups
        }, {})

        return this.$_.map(groups, event => {
          let e = {
            title: event.length,
            start: event[0].startDate
          }
          if (event[0].status === 'confirmed') {
            e.classes = 'green'
          } else if (event[0].status === 'rejected') {
            e.classes = 'red'
          } else {
            e.classes = 'grey'
          }
          return e
        })
      }
    }
  },
  methods: {
    toggleModal (name, model, type) {
      this.modal[name] = model === undefined ? !this.modal[name] : model
      this.type = type
    },
    loadMeetings () {
      this.getMonday()
      this.getSunday()
      return this.$api('get', 'meetings').then(response => {
        this.events = response.data.map(item => {
          item.startDate = new Date(item.startDate)
          item.endDate = new Date(item.endDate)
          return item
        })
        return this.events
      }).catch(e => {
        console.log(e)
        return this.notify(e, 'danger')
      })

    },
    createMeeting (meeting) {
      // let newDate = new Date(meeting.startDate)
      // let endDate = new Date(meeting.startDate)
      // let startTime = meeting.startTime.split(':')
      // newDate.setHours(startTime[0])
      // newDate.setMinutes(startTime[1])

      // let endTime = meeting.endTime.split(':')
      // endDate.setHours(endTime[0])
      // endDate.setMinutes(endTime[1])

      // let data = {name:meeting.name, participants:meeting.participants, startDate:newDate, endDate, place: meeting.place, description: meeting.description}
      this.$api('post', 'meetings', meeting).then(response => {
        this.modal.createMeeting = false
        this.notify(response.data.message)
        this.loadMeetings()
        this.toggleModal('create')
      }).catch(e => {
        this.notify('Временно нельзя создать событие', 'info')
        this.$log(e, 'danger')
      })
    },
    editMeeting (meeting) {
      meeting.participants = this.$_.map(meeting.participants, p => {
        return p.user
      })
      this.$api('put', 'meetings/' + meeting._id, meeting).then(response => {
        this.loadMeetings()
        this.toggleModal('edit')
        this.notify(response.data.message)
      }).catch(e => {
        this.notify('Временно нельзя редактировать событие', 'info')
        this.$log(e, 'danger')
      })
    },
    thisMonth (d, h, m) {
      const t = new Date()
      return new Date(t.getFullYear(), t.getMonth(), d, h || 0, m || 0)
    },
    onDrop(event, date) {
      this.message = `You dropped ${event.id} on ${date.toLocaleDateString()}`
      const fixedStartDate = CalendarMathMixin.methods.toLocalDate(event.startDate)
      const fixedEndDate = CalendarMathMixin.methods.toLocalDate(event.endDate || fixedStartDate)
      const eLength = CalendarMathMixin.methods.dayDiff(fixedStartDate, date)
      event.startDate = CalendarMathMixin.methods.addDays(fixedStartDate, eLength)
      event.endDate = CalendarMathMixin.methods.addDays(fixedEndDate, eLength)
      this.dropMeeting(event.id, date.getDate(), date.getMonth(), date.getFullYear())
    },
    dropMeeting (id, newDay, newMonth, newYear) {
      this.$api('get', 'meetings/' + id).then(response => {
        let oldDate = new Date(response.data.startDate)
        let endDate = new Date(response.data.endDate)

        oldDate.setDate(newDay)
        oldDate.setMonth(newMonth)
        oldDate.setFullYear(newYear)

        endDate.setDate(newDay)
        endDate.setMonth(newMonth)
        endDate.setFullYear(newYear)
        const data = { 'id': id, 'startDate': oldDate, 'endDate': endDate }
        this.$api('put', 'meetings/' + id, data).then(response => {
          this.loadMeetings()
          this.notify(response.data.message)
        }).catch(e => {
          this.notify('Вы не можете переносить чужие встречи', 'info')
          this.$log(e, 'danger')
        })
      }).catch(e => {
        this.notify(e, 'danger')
      })

      /* const data = {'id':id, 'startDate':newDate}
      this.$api('put', 'meetings/' + id, data).then(response => {
        this.loadMeetings()
        console.log(data)
        //this.modal.editUser = false
        this.notify(response.data.message)
      }).catch(e => {
        this.notify('Временно нельзя редактировать событие', 'info')
        //this.modal.editUser = false
        this.$log(e, 'danger')
      }) */
    },
    getFullMinutes (date) {
      if (date.getMinutes() < 10) {
        return '0' + date.getMinutes()
      }
      return date.getMinutes()
    },
    getMeeting (id) {
      this.$api('get', 'meetings/' + id).then(response => {
        const startTime = `${(new Date(response.data.startDate)).getHours()}:${this.getFullMinutes(new Date(response.data.startDate))}`

        const endTime = `${(new Date(response.data.endDate)).getHours()}:${this.getFullMinutes(new Date(response.data.endDate))}`

        response.data['startTime'] = startTime
        response.data['endTime'] = endTime
        this.toggleModal('edit', response.data, 'edit')
      }).catch(e => {
        this.notify(e, 'danger')
      })
    },
    updateMeeting () {
      this.toggleModal('create')
      this.loadMeetings()
    },
    updateEditMeeting () {
      this.toggleModal('edit')
      this.loadMeetings()
    },
    /* ----- Форма ------- */
    loadUsers () {
      this.$api('get', 'users').then(response => {
        this.users = response.data
      }).catch(e => {
        this.notify(e, 'danger')
      })
    },
    showMeetingFromQuery () {
      let type = this.$_.get(this.$route, 'query.type', '')
      let meetingId = this.$_.get(this.$route, 'query.meeting', '')
      if (type && meetingId) {
        this.loadMeetings().then(meetings => {
          this.toggleModal('edit', (this.$_.find(meetings, ['_id', meetingId])),
            'edit')
        })
      } else {
        this.loadMeetings()
      }
    },
    renderEvents (date) {
      this.dateEvents = []
      this.events.map(event => {
        if (new Date(date).toDateString() === new Date(event.startDate).toDateString()) {
          this.dateEvents.push(event)
        }
      })
    },
    nextMonth () {
      this.$refs.calendarMobile.fireMethod('next')
      this.currentMonth = this.$refs.calendarMobile.fireMethod('getDate')._d
    },
    prevMonth () {
      this.$refs.calendarMobile.fireMethod('prev')
      this.currentMonth = this.$refs.calendarMobile.fireMethod('getDate')._d
    },
    getMonthName (date) {
      return {
        thisMonth: arr[new Date(this.currentMonth).getMonth()],
        nextMonth: arr[new Date(this.currentMonth).getMonth() + 1],
        prevMonth: arr[new Date(this.currentMonth).getMonth() - 1]
      }
    },
    getMonths () {
      return arr.map((month, index) => {
        return {
          index: index,
          name: month,
          isCurrent: index == this.selectedDate.getMonth()
        }
      })
    },
    changeCurrentMonth (index) {
      this.selectedDate = new Date(this.currentYear, index, 1)
      this.$refs.calendar.fireMethod('gotoDate', this.selectedDate)
    },
    nextYear () {
      this.currentYear++
      this.selectedDate = new Date(this.currentYear, this.selectedDate.getMonth(), 1)
      this.$refs.calendar.fireMethod('gotoDate', this.selectedDate)
    },
    prevYear () {
      this.currentYear--
      this.selectedDate = new Date(this.currentYear, this.selectedDate.getMonth(), 1)
      this.$refs.calendar.fireMethod('gotoDate', this.selectedDate)
    },
    getMonday () {
      //getDay returns 1/2/3/4/5/6/0 which is from monday to sunday
      var date = new Date(this.selectedDate)
      var diff = this.selectedDate.getDay() > 0 ? this.selectedDate.getDay() - 1 : 6
      date.setDate(date.getDate() - diff)
      this.monday = date
    },
    getSunday () {
      var date = new Date(this.selectedDate)
      var diff = this.selectedDate.getDay() > 0 ? 7 - this.selectedDate.getDay() : 0
      date.setDate(date.getDate() + diff)
      this.sunday = date
    },
    nextWeek () {
      var date = this.selectedDate
      date.setDate(date.getDate() + 7)
      this.$refs.calendar.fireMethod('gotoDate', this.selectedDate)
      this.getMonday()
      this.getSunday()
      this.updateCurrentYear()
    },
    prevWeek () {
      var date = this.selectedDate
      date.setDate(date.getDate() - 7)
      this.$refs.calendar.fireMethod('gotoDate', this.selectedDate)
      this.getMonday()
      this.getSunday()
      this.updateCurrentYear()
    },
    prevDay () {
      var date = this.selectedDate
      this.selectedDate = new Date(date.setDate(date.getDate() - 1))
      this.$refs.calendar.fireMethod('gotoDate', this.selectedDate)
      this.updateCurrentYear()
    },
    nextDay () {
      var date = this.selectedDate
      this.selectedDate = new Date(date.setDate(date.getDate() + 1))
      this.$refs.calendar.fireMethod('gotoDate', this.selectedDate)
      this.updateCurrentYear()
    },
    updateCurrentYear () {
      this.currentYear = this.selectedDate.getFullYear()
    },
    changeView () {
      if (this.displayPeriodUom === 'week') {
        this.selectedView = 'week'
        this.$refs.calendar.fireMethod('changeView', 'basicWeek', this.selectedDate)
        this.getMonday()
        this.getSunday()
      } else if (this.displayPeriodUom === 'month') {
        this.selectedView = 'month'
        this.$refs.calendar.fireMethod('changeView', 'month')
      } else if (this.displayPeriodUom === 'day') {
        this.selectedView = 'day'
        this.$refs.calendar.fireMethod('changeView', 'agendaDay', this.selectedDate)
      }
    },
    loadPositions() {
      return this.$api('get', 'positions?all=true').then(response => {
        this.positions = response.data.positions
      })
    },
  },
  mounted () {
    this.loadPositions()
    this.showMeetingFromQuery()
    this.loadUsers()
    this.getMonths()
    this.loadMeetings().then(data => {
      this.renderEvents(this.selectedDate)
    })
    this.getMonday()
    this.getSunday()
  }
}
</script>
<style lang="scss" scoped>
</style>
<style>
  .calendar-view.holiday-us-official .date::before { content: none !important }

  .calendar-view .event { border: none !important; border-radius: 0; padding: 10px !important; }

  .calendar-view .event.red { background: #c34040; color: #fff; }
  .calendar-view .event.red .endTime, .calendar-view .event.red .startTime { color: #fff; }
  .calendar-view .event.green { background: #00a65a; color: #fff; }
  .calendar-view .event.green .endTime, .calendar-view .event.green .startTime { color: #fff; }

  .calendar-view .event.grey { background: #e3e3e3; color: #333; }
  .calendar-view .event.grey .endTime { background: #e3e3e3; color: #333; }

  .weeks .week .content { padding: 0; min-height: 0; }

  .event.eventRow2 { top: calc(2 * 35px) !important; }
  .event.eventRow3 { top: calc(3 * 35px + 15px) !important; }
  .event.eventRow4 { top: calc(4 * 35px + 15px * 2) !important; }
  .event.eventRow5 { top: calc(5 * 35px + 15px * 3) !important; }
  .event.eventRow6 { top: calc(6 * 35px + 15px * 4) !important; }

  .app-description {
    flex: 0 1 auto;
  }
  .calendar-view {
    flex: 1 1 auto;
    margin-bottom: 1em;
  }
  .calendar-view.period-week,
  .calendar-view.period-month.periodCount-1 {
    height: 60vw;
  }
  .calendar-view.period-month.periodCount-2,
  .calendar-view.period-month.periodCount-3 {
    height: 150vw;
  }
  .calendar-view.period-year {
    height: 100vw;
  }
  /*
      These styles are optional, added for the demo only, to illustrate the flexbility
      of styling the calendar purely with CSS.
      */
  /* Add some emoji for Canada and France... */
 /* .calendar .d07-01 .date::before {
    content: "\1F1E8\1F1E6";
    margin-right: 0.5em;
  }
  .calendar .d07-14 .date::before {
    content: "\1F1EB\1F1F7";
    margin-right: 0.5em;
  }*/
  /* Add some styling for events tagged with the "birthday" class */
  .calendar .event.birthday {
    background-color: #e0f0e0;
    border-color: #d7e7d7;
  }
 /* .calendar .event.birthday::before {
    content: "\1F382";
    margin-right: 0.5em;
  }*/
  .calendar-view .event.span1 {
    cursor:pointer;
  }
</style>
