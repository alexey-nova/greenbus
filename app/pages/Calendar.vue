<template>
  <div>
    <PageTitle :title="'Ежедневник'"></PageTitle>
    <PageButtons>
			<p :style="{ float: 'left', 'margin-bottom': 0 }">Выбрать период:
				<select v-model="displayPeriodUom">
					<option value="month">месяц</option>
					<option value="week">неделя</option>
				</select>
			</p>
      <button class="btn btn-success" @click="toggleModal('create', {}, 'create')"><i class="fa fa-calendar-o"></i>&nbsp;&nbsp;Создать событие</button>
    </PageButtons>

    <Box>
    <calendar-view
			:show-date="showDate"
			@click-date="onClickDay"
			@click-event="onClickEvent"
			@show-date-change="setShowDate"
			:time-format-options="{hour: 'numeric', minute:'2-digit'}"
			:enable-drag-drop="true"
			:disable-past="disablePast"
			:disable-future="disableFuture"
			:show-event-times="false"
			:display-period-uom="displayPeriodUom"
			:display-period-count="displayPeriodCount"
			:starting-day-of-week="startingDayOfWeek"
			@drop-on-date="onDrop"
			:events="eventsForComponent"/>
    </Box>
    <ModalCreate :model="modal.create" :users="users" :type="type" @onUpdate="updateMeeting" @onSubmit="createMeeting" @onClose="toggleModal('create')"></ModalCreate>
    <ModalCreate :model="modal.edit" :users="users" :type="type" @onUpdate="updateEditMeeting" @onSubmit="editMeeting" @onClose="toggleModal('edit')"></ModalCreate>

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
							edit: false,
						},
						showDate: this.thisMonth(1),
						message: "Click a date or event...",
						alreadyAdded: false,
						startingDayOfWeek: 1,
						disablePast: false,
						disableFuture: false,
						displayPeriodUom: 'month',
						displayPeriodCount: 1,
						showEventTimes: true,
						events: [],
						users: [],
						type: 'create',
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
								let e = {
									id: event._id,
									title: event.name,
									startDate: event.startDate,
									endDate: event.endDate,
								}
								if (event.status === 'confirmed') {
									e.classes = "green"
								} else if (event.status === 'rejected') {
									e.classes = "red"
								} else {
									e.classes = "grey"
								}
								return e
							})
						},
						set: function (eventsForComponent) {
							return this.$_.map(eventsForComponent, event => {
								return {
									_id: event.id,
									name: event.title,
									startDate: event.startDate,
									endDate: event.endDate,
								}
							})
						}
					}
        },
        mounted () {
					this.showMeetingFromQuery()
					this.loadUsers()
        },
        methods: {
					toggleModal (name, model, type) {
						this.modal[name] = model === undefined ? !this.modal[name] : model
						this.type = type;
					},
					loadMeetings() {
						return this.$api('get', 'meetings').then(response => {
							return this.events = response.data
						}).catch(e => {
							return this.notify(e, 'danger')
						})
					},
					createMeeting (meeting) {
						let newDate = new Date(meeting.startDate)
						let endDate = new Date(meeting.startDate)
						let startTime = meeting.startTime.split(':')
						newDate.setHours(startTime[0])
						newDate.setMinutes(startTime[1])

						let endTime = meeting.endTime.split(':')
						endDate.setHours(endTime[0])
						endDate.setMinutes(endTime[1])

						let data = {name:meeting.name, participants:meeting.participants, startDate:newDate, endDate, place: meeting.place, description: meeting.description}
						this.$api('post', 'meetings', data).then(response => {
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
					thisMonth(d, h, m) {
						const t = new Date()
						return new Date(t.getFullYear(), t.getMonth(), d, h || 0, m || 0)
					},
					onClickDay(d) {
						this.message = `You clicked: ${d.toLocaleDateString()}`
					},
					onClickEvent(e) {
						this.getMeeting(e.id)
						this.message = `You clicked: ${e.title}`
					},
					setShowDate(d) {
						this.message = `Changing calendar view to ${d.toLocaleDateString()}`
						this.showDate = d
					},
					onDrop(event, date) {
						this.message = `You dropped ${event.id} on ${date.toLocaleDateString()}`
						const fixedStartDate = CalendarMathMixin.methods.toLocalDate(
							event.startDate
						)
						const fixedEndDate = CalendarMathMixin.methods.toLocalDate(
							event.endDate || fixedStartDate
						)
						const eLength = CalendarMathMixin.methods.dayDiff(fixedStartDate, date)
						event.startDate = CalendarMathMixin.methods.addDays(
							fixedStartDate,
							eLength
						)
						event.endDate = CalendarMathMixin.methods.addDays(fixedEndDate, eLength)
						this.dropMeeting(event.id, date.getDate(), date.getMonth(), date.getFullYear())
					},
					dropMeeting (id, newDay, newMonth, newYear) {
						this.$api('get', 'meetings/' + id).then(response => {
							let oldDate = new Date(response.data.startDate);
							let endDate = new Date(response.data.endDate);

							oldDate.setUTCDate(newDay)
							oldDate.setUTCMonth(newMonth)
							oldDate.setUTCFullYear(newYear)

							endDate.setUTCDate(newDay)
							endDate.setUTCMonth(newMonth)
							endDate.setUTCFullYear(newYear)
							const data = {"id":id, "startDate":oldDate, "endDate":endDate};
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

						/*const data = {"id":id, "startDate":newDate};
						this.$api('put', 'meetings/' + id, data).then(response => {
							this.loadMeetings()
							console.log(data)
							//this.modal.editUser = false
							this.notify(response.data.message)
						}).catch(e => {
							this.notify('Временно нельзя редактировать событие', 'info')
							//this.modal.editUser = false
							this.$log(e, 'danger')
						})*/
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
					getMeeting(id) {
						this.$api('get', 'meetings/' + id).then(response => {
							const startTime = `${(new Date(response.data.startDate)).getHours()}:${(new Date(response.data.startDate)).getMinutes()}`
							const endTime = `${(new Date(response.data.endDate)).getHours()}:${(new Date(response.data.endDate)).getMinutes()}`
							
							response.data['startTime'] = startTime
							response.data['endTime'] = endTime

							this.toggleModal('edit', response.data, 'edit')
						}).catch(e => {
							this.notify(e, 'danger')
						})
					},
					updateMeeting() {
						this.toggleModal('create')
						this.loadMeetings()
					},
					updateEditMeeting() {
						this.toggleModal('edit')
						this.loadMeetings()
					},
					/* ----- Форма -------*/
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
					}
			},
    }
</script>
<style lang="scss" scoped>
</style>
<style>
  .calendar-view.holiday-us-official .date::before { content: none !important; }

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