<template><div>
  <Modal :isOpen="model" type="lg">

    <h3 slot="header" class="modal-title">Информация по задаче</h3>

    <div slot="content">
      <ul class="menu">
        <li :class="{'active': tabs === 0}" @click="toggleTab(0)"><a>Инфо</a></li>
        <li :class="{'active': tabs === 1}" @click="toggleTab(1)"><a>Файлы</a></li>
        <li :class="{'active': tabs === 2}" @click="toggleTab(2)"><a>Обсуждение</a></li>
      </ul>

      <div v-if="tabs === 0">
        <h2>#{{model.id}}: {{model.name}}</h2>
        <p style="line-height: 2em;">
          {{model.description}}<br />
          <span style="font-size: 0.9em; color: #666; line-height: 1.4em">
            Контроль: {{getUser(model.from).fullname}}<br />
            Ответственный: {{getUser(model.to).fullname}}<br />
            Приоритет:
            <span v-if="model.urgency" class="label label-danger">Важная</span>
            <span v-if="!model.urgency" class="label label-default">Обычная</span><br />
            Статус: {{statuses[model.status]}}<br />
            <i class="fa fa-clock-o"></i> Дата создания: {{$dateFormat(model.createdAt, 'd mmm yyyy, hh:MM')}}<br />
          </span>
        </p>
      </div>
      <div v-if="tabs === 1">
        <div v-for="file in model.files">
          <div><a :href="$config('app.fileUrl') + file.path" target="_blank">{{file.name}}</a></div>
        </div>
      </div>
      <div v-if="tabs === 2">
        <p v-if="!$_.size(comments)">Обсуждений нет</p>
        <div v-for="comment in comments" style="padding: 5px 0">
          <div class="user"><strong>{{getUser(model.to).fullname}}</strong></div>
          <div class="comment">{{comment.comment}}</div>
          <div v-for="file in comment.files">
            <div><a :href="$config('app.fileUrl') + file.path" target="_blank">{{file.name}}</a></div>
          </div>
          <div v-if="comment.replies[0]">
            <div class="user" style="margin-top: 15px;"><strong>{{getUser(model.from).fullname}}</strong></div>
            <div class="comment">{{comment.replies[0].comment && comment.replies[0].comment}}</div>
            <div v-for="file in comment.replies[0].files">
              <div><a :href="$config('app.fileUrl') + file.path" target="_blank">{{file.name}}</a></div>
            </div>
          </div>
        </div>
        <div style="padding: 5px 0"></div>
        <div v-if="$auth().user._id === model.from && model.status === 1">
          <button type="button" class="btn btn-danger" data-dismiss="modal" @click="toggleModal('rejectTask', {_id: comments[$_.size(comments) -1]._id})"><i class="fa fa-times"></i>&nbsp;&nbsp;Отказать</button>
          <button type="button" class="btn btn-primary" data-dismiss="modal" @click="toggleModal('confirmTask', {_id: comments[$_.size(comments) -1]._id})"><i class="fa fa-calendar-check-o"></i>&nbsp;&nbsp;Согласовать</button>
        </div>
        <div v-if="model.status !== 1"><strong>{{statuses[model.status]}}</strong></div>
      </div>
    </div>

    <div slot="footer">

      <div class="time" style="float: left; text-align: left; padding-top: 5px;">
        <i class="fa fa-clock-o"></i> Срок до: {{$dateFormat(model.deadline, 'd mmm yyyy')}}
      </div>
      <div v-if="model.status === 2" class="time" style="float: left; text-align: left; padding-top: 5px; margin-left: 20px;">
        <i class="fa fa-clock-o"></i> Завершена: {{$dateFormat(model.updatedAt, 'd mmm yyyy, hh:MM')}}
      </div>
      <button type="button" class="btn btn-default" data-dismiss="modal" @click="close"><i class="fa fa-times"></i>&nbsp;&nbsp;Закрыть окно</button>
      <button v-if="$auth().user._id === model.to && model.status === 0" type="button" class="btn btn-primary" data-dismiss="modal" @click="toggleModal('performTask', model)">
        <i class="fa fa-calendar-check-o"></i>&nbsp;&nbsp;Завершить задачу
      </button>
    </div>
  </Modal>

  <ModalPerform :model="modal.performTask" @onSubmit="performTask" @onClose="toggleModal('performTask')"></ModalPerform>
  <ModalReject :model="modal.rejectTask" @onSubmit="rejectTask" @onClose="toggleModal('rejectTask')"></ModalReject>
  <ModalConfirm :model="modal.confirmTask" @onSubmit="confirmTask" @onClose="toggleModal('confirmTask')"></ModalConfirm>

</div></template>

<script>
  import Modal from '@/Modal'
  import ModalPerform from './ModalPerform'
  import ModalReject from './ModalRejectTask'
  import ModalConfirm from './ModalConfirm'
  import ModalShowUser from './../users/ModalShowUser'
  import Datepicker from 'vuejs-datepicker'
  import { Switch } from 'element-ui'
  import 'element-ui/lib/theme-chalk/index.css'

  export default {
    components: {
      Modal,
      ModalPerform,
      ModalReject,
      ModalConfirm,
      ModalShowUser,
      Datepicker,
      'el-switch': Switch,
    },
    data () {
      return {
        comments: [],
        modal: {
          performTask: false,
          rejectTask: false,
          confirmTask: false,
        },
        tabs: 0,
        statuses: [
          'В работе',
          'На согласовании',
          'Согласовано',
          'Отказано',
        ],
      }
    },
    props: ['model', 'users', 'tab'],
    watch: {
      model () {
        if (this.$props.model)
        this.loadTask()
      },
      tab () {
        this.tabs = this.$props.tab
      }
    },
    methods: {
      toggleTab(tab) {
        this.tabs = tab
      },
      toggleModal (name, model) {
        this.modal[name] = model === undefined ? !this.modal[name] : model
      },
      performTask (task) {
        this.$emit('performTask', task)
        this.toggleModal('performTask')
      },
      rejectTask (task) {
        this.$emit('rejectTask', task)
        this.toggleModal('rejectTask')
      },
      confirmTask (model) {
        this.$emit('confirmTask', model)
        this.toggleModal('confirmTask')
      },
      close () {
        this.tabs = 0
        this.$emit('onClose')
      },
      getUser (_id) {
        let user = this.$_.find(this.$props.users, u => u._id === _id)
        return user ? user : {}
      },
      loadTask () {
        this.$api('get', 'tasks/executions/' + this.model._id).then(response => {
          this.comments = response.data
        }).catch(e => {
//          this.notify(e, 'danger')
        })
      },
    },
  }
</script>

<style lang="scss" scoped>
  h2 { margin-top: 0 }

  .menu { list-style: none; display: flex; width: 100%; justify-content: space-around; margin: 0 0 20px; }
  .menu li { }
  .menu li.active a { color: #000; cursor: auto; font-weight: bold; }
</style>