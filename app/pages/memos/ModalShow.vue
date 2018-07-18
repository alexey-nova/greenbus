<template>
  <div>
    <Modal :isOpen="model" :type="['lg']">
      <div class="modal-dialog big" slot="content">
        <div class="modal-content">
          <div class="modal-header">
            <div class="list_header">
              <div class="flex">
                <div>
                  <!-- <span class="date">12.04.2018</span> -->
                </div>
                <div class="buttons flex">
                  <button class="button-top pdf" @click="toggleModal('pdf', model)">PDF</button>
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
                  <span>Тема: {{ model.name }}</span>
                </div>
                <div class="info-box-button">
                  <button :class="['info-button clicked left-margin', tabs === 0 && 'active']" @click="toggleTab(0)"><img src="~assets/img/2.png">Информация</button>
                  <button :class="['info-button clicked', tabs === 1 && 'active']" @click="toggleTab(1)"><img src="~assets/img/1.png" class="big-margin">Файлы</button>
                  <button :class="['info-button clicked', tabs === 2 && 'active']" @click="toggleTab(2)"><img src="~assets/img/comment.png">Обсуждение</button>
                </div>
              </div>
              <div class="info-container2" v-if="tabs === 0">
                <div class="forum-box">
                  <div class="flex column">
                    <div class="form-item-big">
                      <div class="form-item-big-text">
                        <span v-html="model.description"></span>
                        <!-- <img src="~assets/img/doc.jpg"> -->
                      </div>
                      <div class="bottom-flex-item">
                        <!-- <div class="date2-box">
                          <div class="date2">24.05.2018</div>
                        </div> -->
                        <div class="flex align-center bottom-buttons m-button" v-if="model.order[model.currentUser].position === $auth().user.position">
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

    <ModalConfirm :model="modal.confirm" @onSubmit="confirm" @onClose="toggleModal('confirm')"></ModalConfirm>
    <ModalReject :model="modal.reject" @onSubmit="reject" @onClose="toggleModal('reject')"></ModalReject>
    <modal-reply v-if="modal.reply" :model="modal.reply" @onSubmit="sendReply" @onClose="toggleModal('reply')"></modal-reply>
    <modal-pdf v-if="modal.pdf" :model="modal.pdf" :users="users" :positions="positions" @onClose="toggleModal('pdf')"></modal-pdf>
  </div>
</template>

<script>
import Modal from '@/Modal'
import ModalConfirm from './ModalConfirm'
import ModalReject from './ModalReject'
import ModalReply from './ModalReply'
import ModalPdf from './ModalPdf'
import Datepicker from 'vuejs-datepicker'
import CMessages from './CMessages'
import MemoChain from './MemoChain'

export default {
  name: 'modal-show-memo',
  components: {
    Modal,
    ModalConfirm,
    ModalReject,
    'modal-reply': ModalReply,
    ModalPdf,
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
      reply: []
    }
  },
  props: ['model', 'users', 'tab', 'onConfirm', 'onReject', 'onClose', 'getBids'],
  watch: {
    tab () {
      this.tabs = this.$props.tab
    }
  },
  computed: {
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
      return ((this.model.order[this.model.currentUser].confirmType === 'date' && this.model.order[this.model.currentUser].contextResult) || this.model.order[this.model.currentUser].confirmType === 'default') && (this.model.status === 'active' || this.model.status === 'declined')
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
          prevDate = new Date(newArray[i - 1].deadline||123)
        }
        prevDate = this.nextWorkDay(prevDate)
        let nextDeadline = new Date(prevDate)
        for(let ind = 0; ind < item.hours; ind++) {
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
        item.user = this.users.find(u => u.positionId === item.position)
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
    confirm (model) {
      this.modal.confirm = false
      this.$emit('confirm', model)
    },
    reject (model) {
      this.modal.reject = false
      this.$emit('onReject', model)
    },
    close () {
      this.$emit('onClose')
    },
    pdf () {
      let docDefinition = pdf.create(this.logo, this.$props.model, this.getUser, this.$dateFormat, this.statuses)
      pdfMake.createPdf(docDefinition).download()
    },
    getUser (_id) {
      return this.users.find(item = item._id === _id)
    },
    loadPositions () {
      this.$api('get', 'positions?all=true').then(response => {
        this.positions = response.data.positions
      })
    },
    getPositionName (_id) {
      const position = this.positions.find(item => item._id === _id)
      if (position) return position.name
      return ''
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
    nextWorkDay(date, weekends = [0, 6]) {
      const tempDate = new Date(date)
      while (weekends.includes(tempDate.getDay())) {
        tempDate.setHours(tempDate.getHours() + 24)
      }
      return tempDate
    },
    setOrderClass (orderItem, index) {
      if (orderItem.confirmed) return 'green'
      if (index === this.model.currentUser && orderItem.deadline.getTime() < new Date().getTime()) return 'red'
      if (index === this.model.currentUser) return 'yellow'
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
  }
}
</script>

<style lang="scss" scoped>
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
</style>
