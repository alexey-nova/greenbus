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
                  <button class="button-top pdf" @click="pdf">PDF</button>
                  <button @click="close" class="button-top close" type="button"></button>
                </div>
              </div>
            </div>
          </div>
          <div class="profile full modal-body no-padding">
            <div class="info-block">
              <memo-chain :model="model" :order="chain" :users="users" :positions="positions"></memo-chain>
              <div class="flex align-start border-bottom">
                <div class="info-box-text">
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
                <div class="flex align-center m-button" v-if="model.order[model.currentUser].position === $auth().user.position">
                  <div class="fl">
                    <button v-if="isActiveConfirmButton" class="add-button auto-width" @click="toggleModal('reply', { type: 'confirm' })" type="button">Согласовать</button>
                    <button v-if="isActiveDeclineButton" class="info-button" @click="toggleModal('reply', { type: 'reject' })" type="button">Отклонить на шаг</button>
                    <button v-if="isActiveDeclineButton" class="info-button" @click="toggleModal('reply', { type: 'rejectFull' })" type="button">Отклонить до заявителя</button>
                    <button v-if="model.currentUser === 0" class="add-button auto-width" @click="sendReply({ type: 'confirm' })">Переотправить</button>
                  </div>
                  <div class="paydate">
                    <div v-if="(model.order[model.currentUser].confirmType === 'date' && !model.order[model.currentUser].contextResult)" class="fl fl-aic">
                      <div :class="[{'has-error': errors.has('date')}]">
                        <Datepicker language="ru" name="date" v-validate="'required'" v-model="model.date" placeholder="Дата оплаты *" class="datepicker-input"></Datepicker>
                        <span v-show="errors.has('date')" class="help-block">{{ errors.first('date') }}</span>
                      </div>
                      <button class="add-button auto-width ml1" type="button" @click="sendReply({ type: 'confirmDate', date: model.date })">Записать дату</button>
                    </div>
                    <div v-else>
                      <p>Дата оплаты: {{payDate}}</p>
                    </div>
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
                      <h3>Служебная записка №{{model.id}}</h3>
                    <strong class="to-title">Исполнители:</strong>
                    <div v-for="(orderItem, index) in modifiedBid.order.slice(1)" :key="`user-${index}-${orderItem._id}`" class="row user">
                      <div class="col-md-4">
                        <div class="to">
                          {{getPositionName(orderItem.position)}}:
                        </div>
                      </div>
                      <div class="col-md-4">
                        <div class="to-name">{{orderItem.user.fullname}}</div>
                      </div>
                      <div class="col-md-4">
                        <span>{{setOrderStatus(orderItem, index + 1)}}</span>
                      </div>
                    </div>
                    <div class="row theme">
                      <div class="col-lg-12">
                        <p>
                          <strong>Тема: </strong>{{model.name}}
                        </p>
                        <p>
                          <strong>Дата оплаты: {{payDate}}</strong>
                        </p>
                      </div>
                    </div>
                      <div class="description">
                        <span v-html="model.description"></span>
                      </div>
                      <div class="from-wrapper">
                        <p>От кого:</p>
                        <div class="row">
                          <div class="col-md-4">{{getPositionName(getUser(model.createdBy).position)}}:</div>
                          <div class="col-md-4">{{getUser(model.createdBy).fullname}}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="info-container2" v-if="tabs === 1">
                <div class="margin-helper margin2-helper">
                  <div class="white-menu-box">
                    <div class="categories-item" v-for="(file, index) in model.files" :key="`file_${index}`">
                      <div class="flex flex-start">
                        <div class="categories-item-img"></div>
                        <div class="categories-item-text">
                          <a :href="$config('app.fileUrl') + file.path" target="_blank" rel="noopener">{{file.name}}</a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="info-container2" v-if="tabs === 2">
                <div class="forum-response">
                  <div class="forum-response-box full">
                    <p class="forum-name">Оставить комментарий</p>
                    <div class="forum-textarea">
                      <textarea placeholder="Введите текст" v-model="comment"></textarea>
                    </div>
                    <div class="flex flex-end forum-button">
                      <button :disabled="!comment.trim()" class="add-button auto-width" @click="sendComment()">Отправить</button>
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
    <modal-reply-bid v-if="modal.reply" :model="modal.reply" @onSubmit="sendReply" @onClose="toggleModal('reply')"></modal-reply-bid>
  </div>
</template>

<script>
import Modal from '@/Modal'
import 'pdfmake/build/pdfmake.js'
import pdfFonts from 'pdfmake/build/vfs_fonts.js'
pdfMake.vfs = pdfFonts.pdfMake.vfs
import pdf from './pdf'

import logo1 from '#/assets/design/logos/logo1.png'
import logo2 from '#/assets/design/logos/atg.jpg'
import logo3 from '#/assets/design/logos/ki.jpg'

import ModalReply from './ModalReply'
import Datepicker from 'vuejs-datepicker'
import CMessages from './CMessages'
import MemoChain from './MemoChain'

export default {
  name: 'modal-show-memo',
  components: {
    Modal,
    'modal-reply-bid': ModalReply,
    Datepicker,
    CMessages,
    MemoChain
  },
  data () {
    return {
      comments: [],
      modal: {
        confirm: false,
        reject: false,
        reply: false,
        pdf: false
      },
      tabs: 0,
      positions: [],
      comment: '',
      replies: {},
      reply: [],
      selectedLogo: 'logo1'
    }
  },
  props: ['model', 'users', 'tab', 'onConfirm', 'onReject', 'onClose', 'getBids'],
  computed: {
    filesCount () {
      return this.model.files.length
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
    isActiveConfirmButton () {
      return ((this.model.order[this.model.currentUser].confirmType === 'date' && this.model.order[this.model.currentUser].contextResult) || this.model.order[this.model.currentUser].confirmType === 'default') && (this.model.status === 'active' || this.model.status === 'declined') && this.model.currentUser !== 0
    },
    isActiveDeclineButton () {
      return this.model.currentUser !== 0 && (this.model.status === 'active' || this.model.status === 'declined')
    },
    payDate () {
      let date = 'Нет'
      this.model.order.forEach((item) => {
        if (Number(item.contextResult)) {
          date = this.$dateFormat(new Date(Number(item.contextResult)), 'dd mmm yyyy')
        }
      })
      return date
    },
    modifiedBid () {
      const newBid = this.model
      newBid.order = newBid.order.reduce((newArray, item, i) => {
        let prevDate = new Date()
        if (i === 0) {
          prevDate = new Date(newBid.createdAt)
        } else {
          prevDate = new Date(newArray[i - 1].deadline || 123)
        }
        prevDate = this.nextWorkDay(prevDate)
        let nextDeadline = new Date(prevDate)
        for (let ind = 0; ind < item.hours; ind++) {
          nextDeadline.setHours(nextDeadline.getHours() + 1)
          nextDeadline = this.nextWorkDay(nextDeadline)
        }
        if (item.confirmed) {
          nextDeadline = new Date(item.confirmedDate)
        }
        item.deadline = nextDeadline
        newArray[i] = item
        return newArray
      }, [])
      return newBid
    },
    groupedComments () {
      const targetArray = this.comments.filter(item => !item.replyTo)
      const dataArray = JSON.parse(JSON.stringify(this.comments))
      return this.join(targetArray, this.comments)
    },
    chain () {
      return this.model.order.map(item => {
        item.user = this.users.find(u => u.position === item.position)
        return item
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
    async sendReply (data) {
      // data.files = this.$_.map(data.files, (f) => f.file)
      // let formData = this.$createFormData(data)
      try {
        if (data.type === 'confirm') {
          const response = await this.$api('post', `bids/confirm`, { bidId: this.model._id, ...data })
        } else if (data.type === 'confirmDate') {
          if (!data.date) return this.notify('Введите дату', 'danger')
          const response = this.$api('post', `bids/confirm?confirmType=date`, { bidId: this.model._id, date: data.date.getTime() })
        } else if (data.type === 'reject') {
          const response = this.$api('post', `bids/decline`, { bidId: this.model._id, ...data })
        } else if (data.type === 'rejectFull') {
          const response = this.$api('post', `bids/decline`, { bidId: this.model._id, goToFirst: true, ...data })
        }
        this.getBids()
        this.close()
      } catch (e) {
        console.log('dead', e)
      }
    },
    nextWorkDay (date, weekends = [0, 6]) {
      const tempDate = new Date(date)
      while (weekends.includes(tempDate.getDay())) {
        tempDate.setHours(tempDate.getHours() + 24)
      }
      return tempDate
    },
    setOrderStatus (orderItem, index) {
      if (orderItem.confirmed) return `Согласовал ${this.$dateFormat(orderItem.confirmedDate, 'dd.mmm.yyyy HH:MM')}`
      if (index === this.model.currentUser && orderItem.deadline.getTime() < new Date().getTime()) return `Просрочил`
      if (index === this.model.currentUser) return 'На согласовании'
    },
    sendComment () {
      this.$api('post', `comments`, { moduleId: this.model._id, comment: this.comment }).then(response => {
        this.comment = ''
        this.loadComments(this.model._id)
      })
    },
    loadComments (moduleId = this.model._id) {
      this.$api('get', `comments/${moduleId}`).then(response => {
        this.comments = response.data.comments
      })
    },
    toggleReplyArea (index) {
      this.$set(this.replies, index, !this.replies[index])
    },
    replyMessage (commentId, comment) {
      this.$api('post', `comments`, { moduleId: this.model._id, comment, replyTo: commentId }).then(response => {
        this.loadComments(this.model._id)
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
.row {
  display: flex;
  padding-bottom: 0.5em;
}

.to-title {
  margin-bottom: 1em;
  font-weight: 700;
}

select {
  width: auto;
}
h3 { text-align: center; padding: 30px 0; margin: 30px 0; border: solid #000; border-width: 2px 0; text-transform: uppercase; }
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
</style>
