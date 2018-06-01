<template>
  <div class="working_area">
    <div class="flex">
      <div class="flex-left">
        <div class="white-block">
          <p class="title">Ваши задачи</p>
          <div class="flex">
            <div class="table">
              <p class="title2">Просроченные</p>
              <table>
                  <tr class="green">
                      <td width="22%">Задача</td>
                      <td width="19%">Приоритет</td>
                      <td width="39%">Срок до</td>
                      <td width="20%">От кого</td>
                  </tr>
                  <tr v-for="dl in deadlined" :key="dl._id">
                    <td>{{dl.name}}</td>
                    <td>{{dl.urgency ? 'Срочная' : 'Простая'}} задача</td>
                    <td>{{$dateFormat(dl.deadline, 'd mmm yyyy, HH:MM')}}</td>
                    <td>Admin</td>
                  </tr>
              </table>
            </div>
            <div class="table">
                <p class="title2">Предстоящие</p>
                <table>
                    <tr class="green">
                        <td width="22%">Задача</td>
                        <td width="19%">Приоритет</td>
                        <td width="39%">Срок до</td>
                        <td width="20%">От кого</td>
                    </tr>
                    <tr v-for="task in upcomingTasks" :key="task._id">
                    <td>{{task.name}}</td>
                    <td>{{task.urgency ? 'Срочная' : 'Простая'}} задача</td>
                    <td>{{$dateFormat(task.deadline, 'd mmm yyyy, HH:MM')}}</td>
                    <td>Admin</td>
                  </tr>
                </table>
            </div>
          </div>
        </div>
        <div class="white-block">
          <p class="title">Служебные записки на соглосовании</p>
          <table>
            <tr class="green">
              <td width="5%" class="id">ID</td>
              <td width="12%">Тема</td>
              <td width="12%">Статус</td>
              <td width="20%">Исполнитель</td>
              <td width="20%">Кому</td>
              <td width="15%">Информация</td>
              <td width="15%">Подробнее</td>
            </tr>
            <tr v-for="memo in filteredMemos" :key="memo._id">
              <td>{{memo.id}}</td>
              <td>{{memo.name}}</td>
              <td>---</td>
              <td>{{memo.nameTo}}</td>
              <td>{{memo.nameFrom}}</td>
              <td>---</td>
              <td><a href="#" class="green_anchor">Подробнее</a></td>
            </tr>

            <!-- <tr>
                <td>1</td>
                <td>2</td>
                <td>3</td>
                <td>4</td>
                <td>5</td>
                <td>
                    <div class="td-flex">
                        <a href="#" class="td-flex-item comment" data-toggle="modal" data-target="#info-order">
                            <img src="~assets/img/comment.png">
                            <span>12</span>
                        </a>
                        <a href="#" class="td-flex-item folder" data-toggle="modal" data-target="#info-order">
                            <img src="~assets/img/folder.png">
                            <span>12</span>
                        </a>
                    </div>
                </td>
                <td class="td_center">
                    <a href="#" class="green_anchor" data-toggle="modal" data-target="#info-order">Подробнее</a>
                </td>
            </tr> -->
          </table>
        </div>
      </div>
      <div class="flex-right">
        <div class="calendar">
          <div class="calendar-top">
              <span class="week_day">
                {{dateTasks.length > 0 ? getDateWeekDay(dateTasks[0].deadline) : getDateWeekDay(selectedDate)}}
              </span>
              <span class="week_day small">
                <span>{{dateTasks.length > 0 ? new Date(dateTasks[0].deadline).getDate() : new Date(selectedDate).getDate()}}</span>
                <span>
                  {{dateTasks.length > 0 ? getMonthName(dateTasks[0].deadline) : getMonthName(selectedDate)}}
                </span>
              </span>
          </div>
          <div class="calendar-arrows">
              <div class="flex">
                  <a href="#" class="left-arr">
                      <img src="~assets/img/arr-left.png">
                  </a>
                  <div class="center-arr">
                      <span>{{getMonthName((new Date()).getMonth() - 1)}}</span>
                      <span class="upper">{{getMonthName(new Date())}}</span>
                      <span>{{getMonthName((new Date()).getMonth() + 1)}}</span>
                  </div>
                  <a href="#" class="right-arr">
                      <img src="~assets/img/arr-right.png">
                  </a>
              </div>
          </div>
          <div class="calendar-tasks">
              <div class="tasks">
                  <div class="tasks-item">
                      <p v-for="task in dateTasks" :key="task._id">
                        {{task.name}}
                      </p>
                  </div>
              </div>
          </div>
          <!-- <div class="week_days">
              <div class="flex">
                  <a href="#">Пн</a>
                  <a href="#">Вт</a>
                  <a href="#">Ср</a>
                  <a href="#">Чт</a>
                  <a href="#">Пт</a>
                  <a href="#">Сб</a>
                  <a href="#">Вс</a>
              </div>
          </div> -->
          
          <div class="days">
            <div class="flex-days">
              <full-calendar :events="events" :config="config" :header="header"></full-calendar>
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
    data () {
      return {
        seoTitle: this.$trans('pages.index.seoTitle'),
        dateTasks: [],
        deadlined: [],
        upcomingTasks: [],
        today: '',
        tomorrow: '',
        week: '',
        tasks: '',
        selectedDate: new Date(),
        events: [],
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
            left:   'prev',
            center: 'title',
            right:  'next'
        },
        // ps: [],
        memos: [],
        users: []
      }
    },
    computed: {
      filteredMemos: {
        get: function () {
          let data = _.merge([], this.memos)

          _.map(data, memo => {
            let userFrom = _.find(this.users, u => u._id === memo.from)
            memo.nameFrom = userFrom ? userFrom.fullname : ''

            return memo
          })
          return data
        }
      }
    },
    beforeMount () {
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
          let dateA = new Date(a.deadline), dateB = new Date(b.deadline)
          return dateA - dateB
        })
        this.tasks.forEach(task => {
          response.data.deadlines.deadlined.forEach(dl => {
            if (task._id === dl._id) this.deadlined.push(task) 
          })
        })
        let deadlined = response.data.deadlines.deadlined
        let tasks = this.tasks
        if (deadlined && deadlined.length > 0) {
          let deadlinedIds = deadlined.map(item => item._id)
          this.upcomingTasks = tasks.filter(item => !deadlinedIds.includes(item._id))
        }
      }).catch(err => {
        console.log(err)
        this.notify('Временная ошибка', 'danger')
      })
    },
    mounted () {
      this.loadUsers()
      this.$api('get', 'memos?f=confirmation').then(response => {
        this.memos = response.data
      })
    },
    methods: {
      loadUsers () {
        this.$api('get', 'users').then(response => {
          this.users = response.data
        }).catch(e => {
          this.notify(e, 'danger')
        })
      },
      goTo (name, params, query) {
        this.$router.push({ name, params, query })
      },
      renderTasks (date) {
        this.dateTasks = []
        this.tasks.map((task) => {
          if (this.dateFormat(date) === this.dateFormat(task.deadline)) {
            this.dateTasks.push(task)
          }
        })
      },
      dateFormat (date) {
        return new Date(date).getFullYear() + '-' + ((new Date(date).getMonth()+1) < 10 ? '0' + (new Date(date).getMonth()+1) : new Date(date).getMonth()+1) + '-' + (new Date(date).getDate() < 10 ? '0'+new Date(date).getDate() : new Date(date).getDate())
      },
      dateFormatForSec (date) {
        return (new Date(date).getHours() < 10 ? '0'+new Date(date).getHours() : new Date(date).getHours()) + ':' + (new Date(date).getMinutes() < 10 ? '0' + new Date(date).getMinutes() : new Date(date).getMinutes())
      },
      getDateWeekDay (date) {
        let dayName = ''
        switch (new Date(date).getDay()) {
          case 0:
            dayName = 'Воскресенье';
            break;
          case 1:
            dayName = 'Понедельник';
            break;
          case 2:
            dayName = 'Вторник';
            break;
          case 3:
            dayName = 'Среда';
            break;
          case 4:
            dayName = 'Четверг';
            break;
          case 5:
            dayName = 'Пятница';
            break;
          case 6:
            dayName = 'Суббота';
            break;
          default:
            dayName = ''
            break
        }
        return dayName
      },
      getMonthName (date) {
        var arr=[
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
           'Декабрь',
        ]
        if ((typeof date) === 'number') {
          return arr[date]
        }
        var month = new Date(date).getMonth();
        return arr[month]
      }
    }
  }
</script>

<style scoped>
  .indexWrapper { display: flex; align-content: flex-start; }
  .left { display: inline-block; min-height: 150px; padding: 5px; width: calc((100% / 1.5) - 5px); }
  .topWrapper { background: white; border-radius: 3px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24); padding: 15px; }
  .top { border-radius: 3px; width: 100%; min-height: 150px; }
  .top > span { margin-bottom: 5px; padding-top: 5px; }
  .innerLeft { display: inline-block; width: calc((100% / 2 - 4px)); }
  .deadlinedWraper { min-height: 95px; overflow-y: auto; }
  .innerRight { display: inline-block; width: calc((100% / 2 - 4px)); margin-left: 4px; }
  .bottom { width: 100%; min-height: 150px; text-align: center; border-radius: 3px; }
  .bottomWrapper { margin-top: 15px; background: white; border-radius: 3px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24); padding: 15px; }
  .bottom > span { margin-bottom: 5px; padding-top: 5px; }
  .tasksWrapper { overflow-y: auto; }
  .right { display: inline-block; background: transparent; margin-top: 5px; margin-left: 15px; min-height: 150px; width: calc((100% / 2.5) - 5px); }
  .calendarWrapper { background: white; border-radius: 3px; box-shadow:0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24); padding: 15px; margin-top: 15px; }
  #calendar {  border-radius: 3px; }
  .dayTask { display: block; align-content: flex-start; }
  .dayTaskWrapper { background: white; border-radius: 3px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24); padding: 15px; }
  .todayDate { width: 100%; background: #8487b7; padding-top: 8px; border-radius: 5px; }
  .spansWrapper { width: 90%; height: 100%; text-align: center; position: relative; color: white; }
  .spansWrapper > span:nth-child(1){ position: absolute; top:45%; left: 0; transform: translateY(-50%); }
  .spansWrapper > span:nth-child(2n){ padding: 0; margin: 0; }
  .spansWrapper > span:nth-child(3){ position: absolute; top: 45%; right: 0; transform: translateY(-50%); }
  .info { margin-top: 5px; min-height: 85px; overflow-y: auto; border-radius: 3px; }
  .fontSize { font-size: 12px; }
</style>