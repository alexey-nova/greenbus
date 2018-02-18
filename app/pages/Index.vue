<template>
  <div>
    <PageTitle :title="$trans('pages.index.pageTitle')"></PageTitle>
      <div class="indexWrapper">
        <div class="left">
          <div class="topWrapper">
            <div class="top">
              <span class="fontSize">
                <p>Ваши Задачи</p>
              </span>
              <div style="display: flex">
                <div class="innerLeft">
                  <span class="fontSize">
                    <p>Просроченные</p>
                  </span>
                  <div class="deadlinedWraper">
                    <table border="1">
                      <tr v-for="dl in deadlined">
                        <th>{{dl.name}}</th>
                        <td>{{dateFormat(dl.deadline)}}</td>
                      </tr>
                    </table> 
                  </div>
                </div>
                <div class="innerRight">
                  <span class="fontSize">
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
            </div>
          </div>
          <div class="bottomWrapper">
            <div class="bottom">
              <span class="fontSize">
                <p>Ваши Задачи</p>
              </span>
              <div class="tasksWrapper">
                  <table border="1">
                    <tr v-for="(task, index) in tasks" class="">
                      <th>{{task.name}}</th>
                      <td>{{dateFormat(task.deadline)}}</td>
                    </tr>
                  </table> 
              </div>
            </div>
          </div>
        </div>
        <div class="right">
          <div class="dayTaskWrapper">
            <div class="dayTask">
              <div class="todayDate">
                <div class="spansWrapper">
                  <span style="font-size: 1.5em">
                    {{dateTasks.length > 0 ? getDateWeekDay(dateTasks[0].deadline) : getDateWeekDay(selectedDate)}}
                  </span>
                  <span style="font-size: 5em">
                    {{dateTasks.length > 0 ? new Date(dateTasks[0].deadline).getDate() : new Date(selectedDate).getDate()}}
                  </span>                            
                  <span style="font-size: 1.5em">
                    {{dateTasks.length > 0 ? getMonthName(dateTasks[0].deadline) : getMonthName(selectedDate)}}
                  </span>
                </div>
              </div>
              <div class="info">
                 <table border="1" v-if="dateTasks.length > 0">
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
          <div class="calendarWrapper">
            <full-calendar :events="events" :config="config" :header="header"></full-calendar>
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
        this.today = response.data.deadlines.today
        this.tomorrow = response.data.deadlines.tomorrow
        this.week = response.data.deadlines.week
        this.tasks = await response.data.tasks.sort(function(a, b) {
          var dateA = new Date(a.deadline), dateB = new Date(b.deadline)
          return dateA - dateB
        })
        await this.tasks.map((task) => {
          response.data.deadlines.deadlined.map((dl) => {
            if (task._id === dl._id) {
              this.deadlined.push(task)
            }
          })
        })
      } catch (error) {
          console.log(error)
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
    /*font-size: 0.9em;*/
  }
  span {
    display: block;
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
  table { width: 100%; border: 1px solid #ccc; font-size: 12px; }
  th { padding: 5px; }
  td { padding: 5px; }
  .indexWrapper { display: flex; align-content: flex-start; }
  .left { display: inline-block; min-height: 150px; padding: 5px; width: calc((100% / 1.5) - 5px); }
  .topWrapper { background: white; border-radius: 3px; box-shadow: 0 0 1px black; padding: 15px; }
  .top { border-radius: 3px; width: 100%; min-height: 150px; background: #f2f2f2; }
  .top > span { margin-bottom: 5px; padding-top: 5px; }
  .innerLeft { display: inline-block; width: calc((100% / 2 - 4px)); }
  .deadlinedWraper { height: 95px; overflow-y: auto; }
  .innerRight { display: inline-block; width: calc((100% / 2 - 4px)); margin-left: 4px; }
  .bottom { width: 100%; min-height: 150px; text-align: center; background: #f2f2f2; border-radius: 3px; }
  .bottomWrapper { margin-top: 15px; background: white; border-radius: 3px; box-shadow: 0 0 1px black; padding: 15px; }
  .bottom > span { margin-bottom: 5px; padding-top: 5px; }
  .tasksWrapper { height: 266px; overflow-y: auto; }
  .right { display: inline-block; background: transparent; margin-top: 5px; margin-left: 15px; min-height: 150px; width: calc((100% / 2.5) - 5px); }
  .calendarWrapper { background: white; border-radius: 3px; box-shadow: 0 0 1px black; padding: 15px; margin-top: 15px; }
  #calendar { background: #f1f1f1; border-radius: 3px; }
  .dayTask { display: block; align-content: flex-start; }
  .dayTaskWrapper { background: white; border-radius: 3px; box-shadow: 0 0 1px black; padding: 15px; }
  .todayDate { width: 100%; background: #8487b7; padding-top: 8px; border-radius: 5px; }
  .spansWrapper { width: 70%; height: 100%; text-align: center; position: relative; color: white; }
  .spansWrapper > span:nth-child(1){ position: absolute; top:45%; left: 0; transform: translateY(-50%); }
  .spansWrapper > span:nth-child(2n){ padding: 0; margin: 0; }
  .spansWrapper > span:nth-child(3){ position: absolute; top: 45%; right: 0; transform: translateY(-50%); }
  .info { margin-top: 5px; height: 85px; overflow-y: auto; background: #f1f1f1; border-radius: 3px; }
  .fontSize { font-size: 12px; }
</style>