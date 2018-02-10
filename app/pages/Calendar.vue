<template>
  <div>
    <PageTitle :title="'Ежедневник'"></PageTitle>
    <PageButtons>
      <button class="btn btn-success" @click="toggleModal('create', {urgency: false})"><i class="fa fa-calendar-o"></i>&nbsp;&nbsp;Создать событие</button>
    </PageButtons>

    <!--<div class="app-description">
      <h3>{{ message }}</h3>
      <h3>{{ mydata }}</h3>

      <button @click="clickTestAddEvent" :disabled="alreadyAdded">Add Event on 22nd-23rd</button>

      <p>Period UOM:
        <select v-model="displayPeriodUom">
          <option>month</option>
          <option>week</option>
          <option>year</option>
        </select>
      </p>

      <p>Period Count:
        <select v-model="displayPeriodCount">
          <option :value="1">1</option>
          <option :value="2">2</option>
          <option :value="3">3</option>
        </select>
      </p>

      <p>Starting day of the week: <select v-model="startingDayOfWeek">
        <option
                v-for="(d, index) in dayNames"
                :value="index"
                :key="index">{{ d }}</option>
      </select>
      </p>

    </div>-->
    <Box>
    <calendar-view
            class="holiday-us-traditional holiday-us-official"
            :show-date="showDate"
            @click-date="onClickDay"
            @click-event="onClickEvent"
            @show-date-change="setShowDate"
            :time-format-options="{hour: 'numeric', minute:'2-digit'}"
            :enable-drag-drop="true"
            :disable-past="disablePast"
            :disable-future="disableFuture"
            :show-event-times="showEventTimes"
            :display-period-uom="displayPeriodUom"
            :display-period-count="displayPeriodCount"
            :starting-day-of-week="startingDayOfWeek"
            @drop-on-date="onDrop"
            :events="eventsForComponent"/>
    </Box>
    <ModalCreate :model="modal.create" :users="users" @onSubmit="createMeeting" @onClose="toggleModal('create')"></ModalCreate>
  </div>
</template>

<script>
    import PageTitle from "@/PageTitle"
    import Box from "@/Box"
    import PageButtons from "@/PageButtons"
    import ModalCreate from './calendar/ModalCreateMeeting'
    import CalendarView from "vue-simple-calendar"
    import CalendarMathMixin from "vue-simple-calendar/dist/calendar-math-mixin.js"
    require("vue-simple-calendar/dist/static/css/default.css")
    require("vue-simple-calendar/dist/static/css/holidays-us.css")

    export default {
        name: "App",
        components: {
            PageButtons,
            PageTitle,Box,
            CalendarView,
            CalendarMathMixin,
            ModalCreate,
        },
        data() {
            return {
                meetings: [],
                modal: {
                    create: false,
                },
                showDate: this.thisMonth(1),
                message: "Click a date or event...",
                mydata: "Пусто",
                alreadyAdded: false,
                startingDayOfWeek: 1,
                disablePast: false,
                disableFuture: false,
                displayPeriodUom: "month",
                displayPeriodCount: 1,
                showEventTimes: true,
                events: [],
                users: [],
            }
        },
        computed: {
            userLocale() {
                return CalendarMathMixin.methods.getDefaultBrowserLocale
            },
            dayNames() {
                return CalendarMathMixin.methods.getFormattedWeekdayNames(
                    this.userLocale,
                    "long",
                    0
                )
            },
            eventsForComponent: {
                get: function () {
                    return this.$_.map(this.events, event => {
                      return {
                        id: event._id,
                        title: event.name,
                        startDate: event.startDate,
                        //endDate: event.startDate,
                       // title: "Multi-day event",
                       // classes: "purple",
                      }
                    })
                },
                set: function (eventsForComponent) {
                    return this.$_.map(eventsForComponent, event => {
                        return {
                            _id: event.id,
                            name: event.title,
                            startDate: event.startDate,
                            //endDate: event.startDate,
                            // title: "Multi-day event",
                            // classes: "purple",
                        }
                        //this.setShowDate(event.id)
                    })
                }
            }
        },
        mounted () {
            this.mydata = this.thisMonth(1,2,3)
            this.loadMeetings()
            this.loadUsers()
        },
        methods: {
            toggleModal (name, model) {
                this.modal[name] = model === undefined ? !this.modal[name] : model
            },
            loadMeetings() {
              this.$api('get', 'meetings').then(response => {
                //this.mydata = `Данные: ${response.data}`
                this.events = response.data
                console.log(response.data)
                console.log(this.$auth().token)
              }).catch(e => {
                      this.notify(e, 'danger')
              })
            },
            createMeeting (meeting) {
                this.$api('post', 'meetings', meeting).then(response => {
                    this.modal.createMeeting = false
                    this.notify(response.data.message)
                    this.loadMeetings()
                }).catch(e => {
                    this.notify('Временно нельзя создать событие', 'info')
                    this.$log(e, 'danger')
                })
            },
            editMeeting (meeting) {
                this.$api('put', 'meetings/' + meeting._id, meeting).then(response => {
                    this.loadMeetings()
                    //this.modal.editUser = false
                    this.notify(response.data.message)
                }).catch(e => {
                    this.notify('Временно нельзя редактировать событие', 'info')
                    //this.modal.editUser = false
                    this.$log(e, 'danger')
                })
            },
            dropMeeting (id, newDate) {
                this.$api('put', 'meetings/' + id, newDate).then(response => {
                    this.loadMeetings()
                    console.log('good')
                    //this.modal.editUser = false
                    this.notify(response.data.message)
                }).catch(e => {
                    this.notify('Временно нельзя редактировать событие', 'info')
                    //this.modal.editUser = false
                    this.$log(e, 'danger')
                })
            },
            thisMonth(d, h, m) {
                const t = new Date()
                return new Date(t.getFullYear(), t.getMonth(), d, h || 0, m || 0)
            },
            onClickDay(d) {
                this.message = `You clicked: ${d.toLocaleDateString()}`
            },
            onClickEvent(e) {
                this.message = `You clicked: ${e.title}`
            },
            setShowDate(d) {
                this.message = `Changing calendar view to ${d.toLocaleDateString()}`
                this.showDate = d
            },
            onDrop(event, date) {
                this.message = `You dropped ${event.id} on ${date.toLocaleDateString()}`
                // Before handling drag/drop date math, need to convert string dates to
                // local dates and coalesce endDate to startDate.
                const fixedStartDate = CalendarMathMixin.methods.toLocalDate(
                    event.startDate
                )
                const fixedEndDate = CalendarMathMixin.methods.toLocalDate(
                    event.endDate || fixedStartDate
                )
                // Determine the delta between the old start date and the date chosen,
                // and apply that delta to both the start and end date to move the event.
                const eLength = CalendarMathMixin.methods.dayDiff(fixedStartDate, date)
                event.startDate = CalendarMathMixin.methods.addDays(
                    fixedStartDate,
                    eLength
                )
                event.endDate = CalendarMathMixin.methods.addDays(fixedEndDate, eLength)
                this.dropMeeting(event.id, date.toLocaleDateString())
            },
            clickTestAddEvent() {
                if (this.alreadyAdded) return
                this.alreadyAdded = true
                this.events.push({
                    id: "e12",
                    startDate: this.thisMonth(22),
                    endDate: this.thisMonth(22),
                    title: "New Event",
                })
            },

            /* ----- Форма -------*/
            loadUsers () {
                this.$api('get', 'users').then(response => {
                    this.users = response.data
                }).catch(e => {
                    this.notify(e, 'danger')
                })
            },
        },
    }
</script>
<style lang="scss" scoped>
</style>
<style>
  html,
  body {
    height: 100%;
    margin: 0;
  }
  #app {
    font-family: Calibri;
    width: 90vw;
    min-width: 30em;
    max-width: 100em;
    min-height: 40em;
    margin-left: auto;
    margin-right: auto;
    display: flex;
    max-height: 100vh;
    flex-direction: column;
  }
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
    height: 500vw;
  }
  /*
      These styles are optional, added for the demo only, to illustrate the flexbility
      of styling the calendar purely with CSS.
      */
  /* Add some emoji for Canada and France... */
  .calendar .d07-01 .date::before {
    content: "\1F1E8\1F1E6";
    margin-right: 0.5em;
  }
  .calendar .d07-14 .date::before {
    content: "\1F1EB\1F1F7";
    margin-right: 0.5em;
  }
  /* Add some styling for events tagged with the "birthday" class */
  .calendar .event.birthday {
    background-color: #e0f0e0;
    border-color: #d7e7d7;
  }
  .calendar .event.birthday::before {
    content: "\1F382";
    margin-right: 0.5em;
  }
</style>