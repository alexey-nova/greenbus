<template>
  <div>
    <Modal :isOpen="model" :type="['lg']">
      <div class="modal-dialog big" slot="content">
        <div class="modal-content">
          <div class="modal-header">
            <div class="list_header">
              <div class="flex">
                <div>
                </div>
                <div class="buttons flex">
                  <button @click="close" class="button-top close" type="button"></button>
                </div>
              </div>
            </div>
          </div>
          <div class="full modal-body">
            <div class="info-block">
              <div class="flex align-start border-bottom">
                <div class="info-box-text">
                  <button class="add-button" @click="pdf">Скачать PDF</button>
                </div>
                <div class="info-box-button">
                  <button :class="['info-button clicked left-margin', tabs === 0 && 'active']" @click="toggleTab(0)"><img src="~assets/img/2.png">Информация</button>
                  <button :class="['info-button clicked button-counter', tabs === 1 && 'active']" @click="toggleTab(1)">
                    <span v-if="filesCount">{{filesCount}}</span>
                    <img src="~assets/img/1.png" class="big-margin">Файлы
                  </button>
                  <button :class="['info-button clicked button-counter', tabs === 2 && 'active']" @click="toggleTab(2); readComments()">
                    <span v-if="unreadCount">{{unreadCount}}</span>
                    <img src="~assets/img/comment.png">Обсуждение
                  </button>
                </div>
              </div>
              <div class="info-container2" v-if="tabs === 0">
                <div class="flex align-center m-button">
                  <div class="fl">
                    <button v-if="isAcceptor" class="add-button auto-width mr1" @click="toggleModal('reply', { type: 'confirm', _id: model._id })" type="button">Принять на исполнение</button>
                    <button v-if="isAcceptor" class="info-button" @click="toggleModal('reply', { type: 'decline', _id: model._id })" type="button">Отклонить</button>
                  </div>
                </div>
                <div class="forum-box">
                  <div class="flex column">
                    <div class="form-item-big">
                      <center>
                        <select class="select-logo" name="logo" v-model="selectedLogo">
                          <option value="logo1">GreenBus</option>
                          <option value="logo2">АТГ</option>
                          <option value="logo3">КИ 2</option>
                        </select>
                      </center>
                      <center>
                        <div><img :src="logo"/></div>
                      </center>
                      <h3 class="lead">Служебная записка №{{model.id}}</h3>
                    <strong class="to-title">Исполнители:</strong>
                    <div v-for="(to, index) in model.to" :key="`user-${index}-${to.user}`" class="row user">
                      <div class="col-md-4">
                        <div class="to">
                          {{getPositionName(getUser(to.user).position)}}:
                        </div>
                      </div>
                      <div class="col-md-4">
                        <div class="to-name">{{getUser(to.user).fullname}}</div>
                      </div>
                      <div class="col-md-4">
                        <span>{{setStatus(to, index)}}</span>
                      </div>
                    </div>
                    <div class="row theme">
                      <div class="col-lg-12">
                        <p>
                          <strong>Тема: </strong>{{model.name}}
                        </p>
                        <p>
                          <strong>Срок сдачи: </strong>{{$dateFormat(model.deadline, 'dd mmm yyyy')}}
                        </p>
                      </div>
                    </div>
                      <div class="description">
                        <span v-html="model.description"></span>
                      </div>
                      <div class="from-wrapper">
                        <strong>От кого:</strong>
                        <div class="row">
                          <div class="col-md-4">{{getPositionName(getUser(model.createdBy).position)}}:</div>
                          <div class="col-md-4">{{getUser(model.createdBy).fullname}}</div>
                        </div>
                        <div>
                          <strong>Дата создания:</strong>
                          <p>{{$dateFormat(model.createdAt, 'dd mmm yyyy, HH:MM')}}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="info-container2" v-if="tabs === 1">
                <div class="margin-helper margin2-helper">
                  <div class="white-menu-box">
                    <a class="categories-item"  v-for="(file, index) in model.files" :key="`file_${index}`" :href="$config('app.fileUrl') + file.path" target="_blank" rel="noopener">
                      <div class="flex flex-start" >
                        <div class="categories-item-img"></div>
                        <div class="categories-item-text">
                          <span>{{file.name}}</span>
                        </div>
                      </div>
                    </a>
                  </div>
                  <div v-for="(comment, index) in groupedComments" v-if="comment.files.length" :key="`comment${index}`">
                    <div class="ml-6">
                      <p>Файл вложил (прикрепил):</p>
                      <p>{{comment.user.fullname}}</p>
                      <p>{{$dateFormat(comment.createdAt, 'dd.mm.yy HH:MM')}}</p>
                    </div>
                    <div class="white-menu-box">
                      <a class="categories-item" v-for="(file, index) in comment.files" :key="`cfile_${index}`" :href="$config('app.fileUrl') + file.path" target="_blank" rel="noopener">
                        <div class="flex flex-start">
                          <div class="categories-item-img"></div>
                          <div class="categories-item-text">
                            <span>{{file.name}}</span>
                          </div>
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div class="info-container2 profile full" v-if="tabs === 2">
                <div class="forum-response">
                  <div class="forum-response-box full">
                    <p class="forum-name">Оставить комментарий</p>
                    <div class="forum-textarea">
                      <ckeditor
                        id="field-description"
                        v-model="comment"
                        :config="$ckEditorConfig">
                      </ckeditor>
                    </div>
                    <div class="flex flex-end forum-button">
                      <div class="mr1">
                        <div class="flex flex-end">
                          <file-upload
                            class="btn btn-default btn-sm"
                            :multiple="true"
                            v-model="model.newFiles"
                            ref="upload">
                            Прикрепить файлы
                          </file-upload>
                        </div>
                        <ul style="list-style: none; padding: 0;">
                          <li v-for="(file, index) in model.newFiles" :key="index">
                            <span class="file-remove" @click="removeFile(index)">x</span>
                            <span>{{file.name}}</span> -
                            <span>{{Math.ceil(file.size / 1024)}} КБ</span>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <button :disabled="!comment.trim()" class="add-button auto-width" @click="sendComment()">Отправить</button>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="forum-box fixed">
                  <div class="forum-info">
                    <c-messages :main="true" :comments="groupedComments" @onSubmit="loadComments()"></c-messages>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
    <modal-reply-custom-bid v-if="modal.reply" :model="modal.reply" @onSubmit="sendReply" @onClose="toggleModal('reply')"></modal-reply-custom-bid>
  </div>
</template>

<script>
import Modal from '@/Modal'
import 'pdfmake/build/pdfmake.js'
import pdfFonts from 'pdfmake/build/vfs_fonts.js'
pdfMake.vfs = pdfFonts.pdfMake.vfs
import pdf from './pdf'
import Ckeditor from 'vue-ckeditor2'

import logo1 from '#/assets/design/logos/logo1.png'
import logo2 from '#/assets/design/logos/atg.jpg'
import logo3 from '#/assets/design/logos/ki.jpg'

import ModalReplyBid from './ModalReplyBid'
import CMessages from './CMessages'
import FileUpload from 'vue-upload-component'

export default {
  name: 'modal-show-custom-bid',
  components: {
    Modal,
    'modal-reply-custom-bid': ModalReplyBid,
    CMessages,
    FileUpload,
    Ckeditor
  },
  data () {
    return {
      comments: [],
      modal: {
        reply: false
      },
      tabs: 0,
      positions: [],
      comment: '',
      replies: {},
      reply: [],
      selectedLogo: 'logo1'
    }
  },
  props: ['model', 'users', 'tab', 'onClose'],
  computed: {
    filesCount () {
      const commentFilesCount = this.groupedComments.reduce((prev, item) => {
        if (item && item.files) return item.files.length + prev
        return prev
      }, 0)
      return this.model.files.length + commentFilesCount
    },
    unreadCount () {
      return this.comments.filter(item => {
        if (!this.$auth().user.position) {
          return false
        }
        return item.unread.includes(this.$auth().user.position)
      }).length
    },
    logo () {
      let logo = logo1
      if (this.selectedLogo === 'logo2') {
        logo = logo2
      }
      if (this.selectedLogo === 'logo3') {
        logo = logo3
      }
      return logo
    },
    isAcceptor () {
      return this.model.to.map(t => t.user).includes(this.$auth().user._id) && !['confirmed', 'declined'].includes(this.model.to.find(t => t.user === this.$auth().user._id).status)
    },
    groupedComments () {
      const targetArray = this.comments.filter(item => !item.replyTo)
      const dataArray = JSON.parse(JSON.stringify(this.comments))
      return this.join(targetArray, this.comments)
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
    getCreatedAt (comment) {
      return comment && comment.createdAt ? comment.createdAt : null
    },
    toggleTab (tab) {
      this.tabs = tab
    },
    toggleModal (name, model) {
      this.modal[name] = model === undefined ? !this.modal[name] : model
    },
    close () {
      this.$emit('onClose')
    },
    pdf () {
      let docDefinition = pdf.create(this.logo, this.model, this.users, this.$dateFormat, this.positions, this.statuses)
      try {
        pdfMake.createPdf(docDefinition).download()
      } catch (e) {
        this.notify('Невозможно сгенерировать PDF файл', 'danger')
      }
    },
    getUser (_id) {
      return this.users.find(item => item._id === _id)
    },
    loadPositions () {
      this.$api('get', 'positions?all=true').then(response => {
        this.positions = response.data.positions
      })
    },
    /**
     * находит и возвращает название должности по _id
    */
    getPositionName (_id) {
      const position = this.positions.find(item => item._id === _id)
      if (position) return position.name
      return ''
    },
    readComments () {
      this.$api('get', `comments/read/${this.model._id}`).then(response => {
        this.comments = this.comments.map(item => {
          item.unread = []
          return item
        })
      })
    },
    sendReply (data) {
      this.modal.accept = false
      this.$emit('onSubmit', data)
    },
    setStatus (orderItem, index) {
      if (orderItem.status === 'confirmed') return `Принял к исплонению ${this.$dateFormat(orderItem.confirmedDate, 'dd.mm.yyyy HH:MM')}`
      if (orderItem.status === 'declined') return `Отклонил ${this.$dateFormat(orderItem.confirmedDate, 'dd.mm.yyyy HH:MM')}`
      return '---'
    },
    removeFile (index) {
      this.model.newFiles.splice(index, 1)
    },
    sendComment () {
      let model = this.$_.clone(this.model)
      model.files = this.model.newFiles && this.model.newFiles.map(f => f.file)
      model.comment = this.comment
      model.moduleId = this.model._id
      let data = this.$createFormData(model)
      this.$api('post', `comments`, data).then(response => {
        this.comment = ''
        this.model.newFiles = []
        this.loadComments(this.model._id)
      })
    },
    loadComments (moduleId = this.model._id) {
      this.$api('get', `comments/${moduleId}`).then(response => {
        this.comments = response.data.comments
      })
    }
  },
  mounted () {
    this.loadPositions()
    this.loadComments(this.model._id)
  },
  watch: {
    tab () {
      this.tabs = this.$props.tab
    }
  },
}
</script>

<style lang="scss" scoped>
div {
  .row {
    display: flex;
    padding-bottom: 0.5em;
  }

  .to-title {
    margin-bottom: 1em;
    font-family: cbold;
    font-weight: 400;
  }
  strong {
    font-family: cbold;
    font-weight: 400
  }

  .file {
    padding: 3px;
    &-remove {
      color: #ff0000;
      padding: 0 5px;
      border-radius: 10px;
      cursor: pointer;
    }
  }

  select {
    width: auto;
  }
  h3 {
    text-align: center;
    padding: 30px 0;
    margin: 30px 0;
    border: solid #000;
    border-width: 2px 0;
    text-transform: uppercase;
  }
  .theme { margin: 30px -15px 10px; }
  .description { padding: 30px 0; margin: 30px 0; border: solid #000; border-width: 2px 0 0; word-wrap: break-word; }
  .form-item-big {
    border: none;
  }
  .from-wrapper { margin-top: 100px; }
  .fl {
    display: flex;
    flex-wrap: wrap;

    &-aic {
      align-items: center;
    }
  }

  .ml1 {
    margin-left: 1em;
  }

  .mr1 {
    margin-right: 1em;
  }

  .pdf {
    color: #fff; margin-right: 10px;
  }
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
  }

  .button-counter {
    position: relative;

    & span {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background-color: #1b8442;
      position: absolute;
      top: -10px;
      right: -10px;
      display: block;
      text-align: center;
      padding: 1px;
      color: #fff;
      transition: all 1s ease-in-out;

      &:hover {
        color: #fff;
      }
    }
  }
}
</style>
