<template>
<div>
  <Modal :isOpen="model" type="lg">
    <div class="modal-dialog big" slot="content">
      <div class="modal-content">
        <div class="modal-header">
          <div class="list_header">
            <div class="flex">
              <div>
                <span>Информация по задаче</span>
              </div>
              <div class="buttons">
                <button class="button-top close" @click="close"></button>
              </div>
            </div>
          </div>
        </div>
        <div class="profile full modal-body no-padding">
          <div class="info-block">
            <div class="flex align-start border-bottom">
              <div class="info-box-text">
              </div>
              <div class="info-box-button">
                <button :class="['info-button clicked left-margin', tabs === 0 && 'active']" @click="toggleTab(0)"><img src="~assets/img/2.png">Информация</button>
                <button :class="['info-button clicked', tabs === 1 && 'active']" @click="toggleTab(1)"><img src="~assets/img/1.png" class="big-margin">Файлы</button>
                <button :class="['info-button clicked', tabs === 2 && 'active']" @click="toggleTab(2)"><img src="~assets/img/comment.png">Обсуждение</button>
              </div>
            </div>
            <div v-if="tabs === 0">
              <div class="forum-box">
                <div class="flex column">
                  <div class="form-item">
                    <label>Тема</label>
                    <input type="text" name="" :value="model.name" disabled>
                    <label>Описание</label>
                    <div class="text text-input" v-html="model.description"></div>
                  </div>
                  <div class="form-item">
                    <label>Ответственный</label>
                    {{model.to && getUser(model.to.user).fullname}}&nbsp;{{(model.to && model.to.read.status) ? `(Просмотрено: ${$dateFormat(model.to.read.date, 'd mmm yyyy, HH:MM')})` : ''}}<br />
                    <span v-if="model.coExecutives && model.coExecutives.length > 0">Соисполнители: </span>
                    <ul v-if="model.coExecutives && model.coExecutives.length > 0">
                      <li v-for="user in model.coExecutives" :key="user._id">{{user && getUser(user.user).fullname}}&nbsp;{{user.read.status ? `(Просмотрено: ${$dateFormat(user.read.date, 'd mmm yyyy, HH:MM')})` : ''}}</li>
                    </ul>
                    <div class="sm-margin"></div>
                    Приоритет:
                    <span v-if="model.urgency" class="label label-danger">Важная</span>
                    <span v-if="!model.urgency" class="label label-info">Обычная</span><br />
                    Статус: {{statuses[model.status]}}<br />
                    <label class="disabled-margin">Срок задачи</label>
                    <div class="select">

                      <div>
                        Дата создания: {{$dateFormat(model.createdAt, 'd mmm yyyy, hh:MM')}}
                      </div>
                      <div>
                        Срок до: {{$dateFormat(model.deadline, 'd mmm yyyy')}}
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
            <div v-if="tabs === 1">
              <div class="margin-helper margin2-helper">
                <div class="white-menu-box" v-if="model.files.length > 0">
                  <div v-for="(file, index) in model.files" :key="index" class="categories-item">
                    <div class="flex flex-start">
                      <div class="categories-item-img"></div>
                      <div class="categories-item-text">
                        <a :href="$config('app.fileUrl') + file.path" target="_blank" rel="noopener">{{file.name}}</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- <div class="modal-footer no-padding">
                  <div class="more">
                      <button class="more-button">Еще 12</button>
                  </div>
              </div> -->
            </div>
            <div v-if="tabs === 2">
              <div class="forum-response">
                <div class="forum-response-box full">
                  <p class="forum-name">Оставить комментарий</p>
                  <div class="forum-textarea">
                    <textarea placeholder="Введите текст" v-model="newComment"></textarea>
                  </div>
                  <div class="flex flex-end forum-button">
                    <button :disabled="!newComment.trim()" class="add-button auto-width" @click="sendComment()">Отправить</button>
                  </div>
                </div>
              </div>
              <div class="forum-box fixed">
                <task-messages :main="true" :from="model.from" :status="model.status"  :comments="groupedComments" :getUser="getUser" @onSubmit="loadTask" @onConfirm="toggleModal('confirmTask', $event)" @onReject="toggleModal('rejectTask', $event)"></task-messages>
                <div v-if="model.status !== 1">
                  <strong>{{statuses[model.status].toUpperCase()}}</strong>
                </div>
              </div>
            </div>
            <div class="time mob-none" style="float: left; text-align: left; padding-top: 5px;">
              Срок до: {{$dateFormat(model.deadline, 'd mmm yyyy')}}
            </div>
            <div class="flex flex-end">
              <button type="button" class="save pad2" @click="close">Закрыть окно</button>
              <button v-if="((model.to && $auth().user._id === model.to.user) || (model.coExecutives && model.coExecutives.filter(user => user.user === $auth().user._id)[0])) && model.status === 0" type="button" class="save pad2" @click="toggleModal('performTask', model)">Завершить задачу</button>
            </div>
          </div>
        </div>
        <!-- <div class="modal-footer"></div> -->
      </div>
    </div>
  </Modal>

  <ModalPerform v-if="modal.performTask" :model="modal.performTask" @onSubmit="performTask" @onClose="toggleModal('performTask')"></ModalPerform>
  <ModalReject v-if="modal.rejectTask" :model="modal.rejectTask" @onSubmit="rejectTask" @onClose="toggleModal('rejectTask')"></ModalReject>
  <ModalConfirm v-if="modal.confirmTask" :model="modal.confirmTask" @onSubmit="confirmTask" @onClose="toggleModal('confirmTask')"></ModalConfirm>

</div>
</template>

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
  import TaskMessages from './TaskMessages'

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
      FileUpload,
      TaskMessages
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
    computed: {
      groupedComments () {
        const targetArray = this.comments.filter(item => !item.replyTo)
        const dataArray = JSON.parse(JSON.stringify(this.comments))
        let joinedArray = this.join(targetArray, this.comments)
        return joinedArray.sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt)
        })
      }
    },
    methods: {
      join (targetArray, dataArray) {
        let result = JSON.parse(JSON.stringify(targetArray))
        dataArray.forEach(item => {
          const i = result.reduce((prev, target, i) => (target._id === item.replyTo) ? i : prev, -1)
          if (i < 0) return
          if (!result[i].replies) result[i].replies = []
          result[i].replies.push(item)
        })
        return result.map(item => {
          if (item.replies) {
            item.replies = this.join(item.replies, dataArray)
          }
          return item
        })
      },
      toggleTab(tab) {
        this.tabs = tab
      },
      toggleModal (name, model) {
        this.modal[name] = model === undefined ? !this.modal[name] : model
      },
      performTask (task) {
        this.$emit('performTask', task)
        this.toggleModal('performTask')
        this.close()
      },
      rejectTask (task) {
        this.$emit('rejectTask', task)
        this.toggleModal('rejectTask')
        this.close()
      },
      confirmTask (model) {
        this.$emit('confirmTask', model)
        this.toggleModal('confirmTask')
        this.close()
      },
      sendComment () {
        let data = this.$createFormData({
          files: this.$_.map(this.model.files, (f) => f.file),
          comment: this.newComment,
          moduleId: this.model._id
        })
        this.$api('post', 'comments', data).then(response => {
          this.comments.push(response.data.comment)
          this.notify('Комментарий успешно добавлен')
          this.model.files = []
          this.newComment = ''
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

          this.comments = [...response.data.executions.map(item => { item.isExecution = true; return item }), ...response.data.comments]
        }).catch(e => {
          console.log(e)
//          this.notify(e, 'danger')
        })
      },
    },
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
  }
</script>

<style lang="scss" scoped>
h2 { margin-top: 0 }

.menu { list-style: none; display: flex; width: 100%; justify-content: space-around; margin: 0 0 20px; }
.menu li.active a { color: #000; cursor: auto; font-weight: bold; }

.forum-response-box.full {
  width: 100%;
}

.forum-box.fixed {
  max-height: 400px;
  overflow-y: scroll;
}
button:disabled {
  background-color: #fff;
  color: #a5a5a5;
  cursor: default;
}

.file-button {
  display: flex;
  margin-top: 1em;

  &--item:not(:first-child) {
    margin-left: 1em;
  }

}
</style>
