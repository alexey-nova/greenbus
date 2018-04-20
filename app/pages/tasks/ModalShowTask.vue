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
        <div style="line-height: 2em;">
          <div v-html="model.description"></div>
          <span style="font-size: 0.9em; color: #666; line-height: 1.4em">
            Контроль: {{getUser(model.from).fullname}}<br />
            Ответственный: {{model.to && getUser(model.to.user).fullname}}&nbsp;{{(model.to && model.to.read.status) ? `(Просмотрено: ${$dateFormat(model.to.read.date, 'd mmm yyyy, HH:MM')})` : ''}}<br />
            <span v-if="model.coExecutives && model.coExecutives.length > 0">Соисполнители: </span>
            <ul v-if="model.coExecutives && model.coExecutives.length > 0">
              <li v-for="user in model.coExecutives">{{user && getUser(user.user).fullname}}&nbsp;{{user.read.status ? `(Просмотрено: ${$dateFormat(user.read.date, 'd mmm yyyy, HH:MM')})` : ''}}</li>
            </ul>
            Приоритет:
            <span v-if="model.urgency" class="label label-danger">Важная</span>
            <span v-if="!model.urgency" class="label label-default">Обычная</span><br />
            Статус: {{statuses[model.status]}}<br />
            <i class="fa fa-clock-o"></i> Дата создания: {{$dateFormat(model.createdAt, 'd mmm yyyy, hh:MM')}}<br />
          </span>
        </div>
      </div>
      <div v-if="tabs === 1">
        <div v-for="file in model.files">
          <div><a :href="$config('app.fileUrl') + file.path" target="_blank">{{file.name}}</a></div>
        </div>
      </div>
      <div v-if="tabs === 2">
        <p v-if="!$_.size(comments)">Обсуждений нет</p>
        <div v-for="comment in comments" style="padding: 5px 0">
          <div v-if="comment.taskId">
            <div class="user">
              <strong>{{getUser(comment.performedBy).fullname}}</strong>
              <span>({{ $dateFormat(comment.createdAt, 'dd mmm, HH:MM') }})</span>
            </div>
            <div class="comment">{{comment.comment}}</div>
            <div v-for="file in comment.files">
              <div><a :href="$config('app.fileUrl') + file.path" target="_blank">{{file.name}}</a></div>
            </div>
            <div v-if="comment.replies && comment.replies[0]">
              <div class="user" style="margin-top: 15px;">
                <i class="fa fa-reply" style="color: grey"></i>
                <strong>{{getUser(model.from).fullname}}</strong>
                <span>({{ $dateFormat(comment.replies[0].createdAt, 'dd mmm, HH:MM') }})</span>  
              </div>
              <div class="comment">{{comment.replies[0].comment && comment.replies[0].comment}}</div>
              <div v-for="file in comment.replies[0].files">
                <div><a :href="$config('app.fileUrl') + file.path" target="_blank">{{file.name}}</a></div>
              </div>
            </div>
            <div style="padding: 5px 0"></div>
            <div v-if="$auth().user._id === model.from && model.status === 1 && (comment && comment.taskId)">
              <button type="button" class="btn btn-danger" data-dismiss="modal" @click="toggleModal('rejectTask', {_id: comment._id})"><i class="fa fa-times"></i>&nbsp;&nbsp;Отказать</button>
              <button type="button" class="btn btn-primary" data-dismiss="modal" @click="toggleModal('confirmTask', {_id: comment._id})"><i class="fa fa-calendar-check-o"></i>&nbsp;&nbsp;Согласовать</button>
            </div>
          </div>
          <div v-else>
            <div class="user">
              <strong>{{getUser(comment.user).fullname}}</strong>
              <span>({{ $dateFormat(comment.createdAt, 'dd mmm, HH:MM') }})</span>
            </div>
            <div class="comment" v-html="comment.comment"></div>
            <div v-for="file in comment.files">
              <div><a :href="$config('app.fileUrl') + file.path" target="_blank">{{file.name}}</a></div>
            </div>
          </div>
        </div>
        
        <div v-if="model.status !== 1"><strong>{{statuses[model.status].toUpperCase()}}</strong></div>
        <hr>
        <div>
          <div :class="['form-group']">
            <label for="field-description">Комментарий</label>
            <ckeditor
              placeholder="Комментарий"
              id="field-description"
              v-model="model.comment"
              :config="ckEditorConfig">
            </ckeditor>
            <span v-show="errors.has('description')" class="help-block">{{ errors.first('description') }}</span>
          </div>
          <file-upload
            class="btn btn-default"
            :multiple="true"
            v-model="model.files"
            ref="upload">
            <i class="fa fa-plus"></i>
            Выбрать файлы
          </file-upload>
          <ul style="list-style: none; padding: 0;">
            <li v-for="(file, index) in model.files" :key="index">
              <span>{{file.name}}</span> -
              <span>{{Math.ceil(file.size / 1024)}} КБ</span>
            </li>
          </ul>
          <button class="btn btn-default" :disabled="!model.comment" @click="sendComment()">Отправить</button>
        </div>
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
      <button v-if="((model.to && $auth().user._id === model.to.user) || (model.coExecutives && model.coExecutives.filter(user => user.user === $auth().user._id)[0])) && model.status === 0" type="button" class="btn btn-primary" data-dismiss="modal" @click="toggleModal('performTask', model)">
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
  import Ckeditor from 'vue-ckeditor2'
  import FileUpload from 'vue-upload-component'

  export default {
    components: {
      Modal,
      ModalPerform,
      ModalReject,
      ModalConfirm,
      ModalShowUser,
      Datepicker,
      'el-switch': Switch,
      Ckeditor,
      FileUpload
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
        ckEditorConfig: {
          toolbar: [
            [ 'Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript' ]
          ],
          height: 150
        },
        newComment: '',
        newFiles: []
      }
    },
    props: ['model', 'users', 'tab'],
    watch: {
      model () {
        if (this.$props.model) {
          this.loadTask()
        }
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
      sendComment () {
        let data = this.$createFormData({
          files: this.$_.map(this.model.files, (f) => f.file),
          comment: this.model.comment,
          moduleId: this.model._id
        })
        this.$api('post', 'comments', data).then(response => {
          console.log(response.data)
        }).catch(err => {
          console.log(err)
        })
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
          this.comments = response.data.executions
          response.data.comments.forEach(comment => {
            this.comments.push(comment)
          })
        }).catch(e => {
          console.log(e)
//          this.notify(e, 'danger')
        })
      },
    }
  }
</script>

<style lang="scss" scoped>
  h2 { margin-top: 0 }

  .menu { list-style: none; display: flex; width: 100%; justify-content: space-around; margin: 0 0 20px; }
  .menu li.active a { color: #000; cursor: auto; font-weight: bold; }
</style>