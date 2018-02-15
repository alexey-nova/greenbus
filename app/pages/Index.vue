<template>
  <div>
    <PageTitle :title="$trans('pages.index.pageTitle')"></PageTitle>
      <div class="indexWrapper">
        <div class="left">
          <div class="top">
            <span>
              <p>Ваши Задачи</p>
            </span>
            <div class="innerLeft">
              <span>
                <p>Просроченные</p>
              </span>
              <div id="circle">
                <span class="centered">{{deadlined.length}}</span>
              </div>
            </div>
            <div class="innerRight">
              <span>
                <p>Предстоящие</p>
              </span>
              <div>
                <table border="1">
                  <tr class="firstRow">
                    <th>Сегодня</th>
                    <td>{{today.length}}</td>
                  </tr>
                  <tr class="secondRow">
                    <th>Завтра</th>
                    <td>{{tomorrow.length}}</td>
                  </tr>
                  <tr class="thirdRow">
                    <th>Неделя</th>
                    <td>{{week.length}}</td>
                  </tr>
                </table> 
              </div>
            </div>
          </div>
          <div class="bottom">
            <span>
              <p>Ваши Задачи</p>
            </span>
            <div class="tasksWrapper">
                <table border="1">
                  <tr v-for="(task, index) in tasks" v-if="index%3==0" class="firstRow centered_border">
                    <th>{{task.name}}</th>
                    <td>{{dateFormat(task.deadline)}}</td>
                  </tr>
                  <tr v-else-if="index%3==1" class="secondRow centered_border">
                    <th>{{task.name}}</th>
                    <td>{{dateFormat(task.deadline)}}</td>
                  </tr>
                  <tr v-else class="thirdRow centered_border">
                    <th>{{task.name}}</th>
                    <td>{{dateFormat(task.deadline)}}</td>
                  </tr>
                </table> 
            </div>
          </div>
        </div>
        <div class="right">
          <div class="calendarWrapper">
            <full-calendar :events="events" :config="config" :header="header"></full-calendar>
          </div>
          <div class="dayTask">
            <div class="todayDate">
              <span style="font-size: 1.5em">
                {{dateTasks.length > 0 ? getDateWeekDay(dateTasks[0].deadline) : getDateWeekDay(selectedDate)}}
              </span>
              <span style="font-size: 7em">
                {{dateTasks.length > 0 ? new Date(dateTasks[0].deadline).getDate() : new Date(selectedDate).getDate()}}
              </span>                            
              <span style="font-size: 1.5em">
                {{dateTasks.length > 0 ? getMonthName(dateTasks[0].deadline) : getMonthName(selectedDate)}}
              </span>
            </div>
            <div class="info">
               <table class="infoTable" border="1" v-if="dateTasks.length > 0">
                <tr>
                  <td>Время</td>
                  <td>Название</td>
                  <td>Описание</td>
                </tr>
                <tr v-for="task in dateTasks">
                  <td>{{dateFormatForSec(task.deadline)}}</td>
                  <td>{{task.name}}</td>
                  <td>{{task.description}}</td>
                </tr>
              </table>
              <table border="1" v-else>
                <tr class="centered_border">
                  <th>На эту дату нет задач</th>
                </tr>
              </table>
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
        deadlined: '',
        today: '',
        tomorrow: '',
        week: '',
        tasks: '',
        selectedDate: new Date(),
        events: [],
        config: {
          weekends: false,
          locale: 'ru',
          defaultView: 'month',
          themeSystem: 'bootstrap3',
          contentHeight: 250,
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
      }
    },
    computed: {},
    async beforeMount () {
      try {
        const response = await this.$api('get', 'tasks')
        this.deadlined = response.data.deadlines.deadlined
        this.today = response.data.deadlines.today
        this.tomorrow = response.data.deadlines.tomorrow
        this.week = response.data.deadlines.week
        this.tasks = response.data.tasks.sort(function(a, b) {
          var dateA = new Date(a.deadline), dateB = new Date(b.deadline)
          return dateA - dateB
        })
      } catch (error) {
          this.notify('Произошла ошибка!', 'error')
      }
    },
    methods: {
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
        console.log(date)
        var month=new Date(date).getMonth();
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
        return arr[month]
      }
    }
  }
</script>

<style scoped>
  div {
    margin: 0 auto;
    display: block;
    font-size: 0.9em;
  }
  span {
    display: block;
    color: white;
    border: 4px ridge white;
    background: black;
    margin: 0 auto;
  }
  p {
    margin: 0;
    padding: 5px 0 5px 0;
    height: 100%;
    line-height: 100%;
    text-align: center;
    width: 100%;
  }
  table {
    width: 100%;
  }
  th {
    padding: 10px 55px;
  }
  td {
    padding: 10px 28px;
  }
  .indexWrapper {
    display: flex;
    align-content: top
  }
  .left {
    display: inline-block;
    background: transparent;
    min-height: 150px;
    width: calc((100% / 2) - 5px);
  }
  .top {
    margin-top: 15px;
    width: 100%;
    min-height: 150px;
  }
  .innerLeft {
    display: inline-block;
    width: calc((100% / 2 - 4px));
  }
  .innerRight {
    display: inline-block;
    width: calc((100% / 2 - 4px));
    margin-left: 4px;
  }
  .bottom {
    margin-top: 15px;
    width: 100%;
    min-height: 150px;
    text-align: center;
  }
  .tasksWrapper {
    height: 300px;
    overflow-y: auto;
  }
  .right {
    display: inline-block;
    background: transparent;
    margin-top: 5px;
    min-height: 150px;
    width: calc((100% / 2) - 5px);
  }
  .dayTask {
    height: 150px;
    display: flex;
    align-content: top;
  }
  .todayDate {
    color: white;
    width: 30%;
    background: #000;
    background: linear-gradient(to top right, #000, #025092);
  }
  .todayDate > span {
    margin-top: 5px;
    text-align: center;
    border: 0px solid transparent;
    background: transparent;
  }
  .info {
    overflow-y: auto;
    height: 200px;
    width: 70%;
  }
  #circle {
    width: 100px;
    height: 100px;
    background: #86aed4;
    position: relative;
    -moz-border-radius: 50px;
    -webkit-border-radius: 50px;
    border-radius: 50px;
    border: 2px solid #4182bc;
  }
  .centered {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate3d(-50%, -50%, 0);
    border: 1px solid #86aed4;
    background: transparent;
    font-size: 2em;
  }
  .firstRow {
    background-color: black;
    color: white;
  }
  .secondRow {
    background-color: #848484;
    color: black;
  }
  .thirdRow {
    background-color: #b3b3b3;
    color: black;
  }
  .centered_border > td {
    padding: 10px 55px;
  }
  .centered_border > th {
    padding: 10px 55px;
  }

  @media screen and (max-width: 800px) {
    .left {
      width: 100%;
    }
    .right {
      width: 100%;
    }
    .innerLeft {
      width: 100%;
    }
    .innerRight {
      width: 100%;
      margin-left: 0;
    }
  }
</style>