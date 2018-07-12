<template>
  <div>
    <Modal :isOpen="model" :type="['lg']">
      <div class="modal-dialog big" slot="content">
        <div class="modal-content">
          <div class="modal-header">
            <div class="list_header">
              <div class="flex">
                <div>
                  <span>{{ model.name }}</span>
                  <!-- <span class="date">12.04.2018</span> -->
                </div>
                <div class="buttons flex">
                  <button class="button-top pdf">PDF</button>
                  <button @click="close" class="button-top close" type="button"></button>
                </div>
              </div>
            </div>
          </div>
          <div class="profile full modal-body no-padding">
            <div class="info-block">
              <div class="flex align-start border-bottom">
                <div class="info-box-text">
                  <!-- <span v-html="model.description"></span> -->
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
                          <button v-if="isActiveConfirmButton" class="add-button auto-width" @click="sendReply({ type: 'confirm' })" type="button">Согласовать</button>
                          <button v-if="model.currentUser !== 0 && model.status === 'active'" class="info-button" @click="sendReply({ type: 'reject' })" type="button">Отклонить на шаг</button>
                          <button v-if="model.currentUser !== 0 && model.status === 'active'" class="info-button" @click="sendReply({ type: 'rejectFull' })" type="button">Отклонить до заявителя</button>
                        </div>
                      </div>
                    </div>
                    <div class="form-item-small">
                      <div class="form-item-small-box">
                        <div class="small-box-item">
                          <div class="stage-box">
                            <div 
                              v-for="(item, index) in modifiedBid.order"
                              :key="item._id" 
                              :class="[
                                'stage-flex flex', setOrderClass(item, index)]">
                              <div class="stage-text">
                                <p>{{getPositionName(item.position)}}</p>
                              </div>
                              <div class="stage-date">
                                <span>{{$dateFormat(item.deadline, 'dd mmm yyyy')}}</span>
                              </div>
                            </div>
                          </div>
                          <div v-if="(model.order[model.currentUser].confirmType === 'date' && !model.order[model.currentUser].contextResult)">
                            <div :class="['form-group', {'has-error': errors.has('date')}]">
                              <label>Дата оплаты *</label>
                              <Datepicker language="ru" name="date" v-validate="'required'" v-model="model.date"></Datepicker>
                              <span v-show="errors.has('date')" class="help-block">{{ errors.first('date') }}</span>
                            </div>
                            <button class="add-button" type="button" @click="sendReply({ type: 'confirmDate', date: model.date })">Записать дату</button>
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
              <div class="info-container2" v-if="tabs === 1">
                <div class="margin-helper margin2-helper">
                  <div class="white-menu-box">
                    <div class="categories-item" v-for="(file, index) in model.files" :key="`file_${index}`">
                      <div class="flex flex-start">
                        <div class="categories-item-img"></div>
                        <div class="categories-item-text">
                          <span>{{ file.name }}</span>
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
                        <button :disabled="!comment" class="add-button auto-width" @click="sendComment()">Отправить</button>
                      </div>
                    </div>
                  </div>
                  <div class="forum-box fixed">
                    <div v-for="(com, index) in groupedComments" :key="`comment-${index}`" class="forum-item">
                      <div class="forum-title flex">
                        <p class="forum-name">{{getUser(com.user).fullname}}</p>
                        <p class="forum-date">{{$dateFormat(com.createdAt, 'dd mmm yyyy')}}</p>
                      </div>
                      <div class="forum-text">
                        <span>{{com.comment}}</span>
                      </div>
                      <!-- <div class="flex flex-end forum-button">
                        <button class="add-button auto-width reply" type="button" @click="toggleReplyArea(index)">Ответить</button>
                      </div>
                      <div v-if="replies[index]" class="forum-response">
                        <div class="forum-response-box">
                            <div class="forum-textarea">
                              <textarea placeholder="Введите текст" v-model="reply[index]"></textarea>
                            </div>
                            <div class="flex flex-end forum-button">
                              <button type="button" class="add-button auto-width" @click="replyMessage(com._id, reply[index])">Отправить</button>
                            </div>
                        </div>
                      </div> -->
                      <!-- <div class="forum-response">
                            <div class="forum-response-box">
                              <p class="forum-name">Жумагалиев АБ</p>
                              <div class="forum-response-info">
                                <div class="response-info-text">
                                    <p class="forum-name2">Жумагалиев АБ</p>
                                    <span>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</span>
                                </div>
                                <div class="response-info-date">
                                    <p class="forum-date">21.02.2018</p>
                                </div>

                              </div>
                              <div class="forum-text">
                                  <span>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi asperiores blanditiis, fugit necessitatibus nemo similique tempora temporibus voluptates. Amet doloremque eaque error explicabo hic minima obcaecati quia quisquam similique voluptate?</span>
                              </div>
                              <div class="flex flex-end forum-button">
                                  <button class="add-button auto-width reply2">Ответить</button>
                              </div>
                              <div class="hidden-forum-box hidden2">
                                  <div class="forum-response">
                                      <div class="forum-response-box">
                                          <p class="forum-name">Жумагалиев АБ</p>
                                          <form action="" method="">
                                              <div class="forum-textarea">
                                                  <textarea placeholder="Введите текст"></textarea>
                                              </div>
                                              <div class="flex flex-end forum-button">
                                                  <button type="submit" class="add-button auto-width">Отправить</button>
                                              </div>
                                          </form>
                                      </div>
                                  </div>
                              </div>
                            </div>
                        </div> -->
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
  </div>
</template>

<script>
import Modal from '@/Modal'
import ModalConfirm from './ModalConfirm'
import ModalReject from './ModalReject'
import ModalReply from './ModalReply'
import 'pdfmake/build/pdfmake.js'
import pdfFonts from 'pdfmake/build/vfs_fonts.js'
pdfMake.vfs = pdfFonts.pdfMake.vfs
import pdf from './pdf'
import logo1 from '#/assets/design/logos/logo1.png'
import logo2 from '#/assets/design/logos/atg.png'
import logo3 from '#/assets/design/logos/ki.png'
import Datepicker from 'vuejs-datepicker'

export default {
  components: {
    Modal,
    ModalConfirm,
    ModalReject,
    'modal-reply': ModalReply,
    Datepicker,
  },
  data () {
    return {
      selectedLogo: 'logo1',
      comments: [],
      modal: {
        confirm: false,
        reject: false,
        reply: false
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
    model () {
    },
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
      return ((this.model.order[this.model.currentUser].confirmType === 'date' && this.model.order[this.model.currentUser].contextResult) || this.model.order[this.model.currentUser].confirmType === 'default') && this.model.status === 'active'
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
        nextDeadline.setHours(nextDeadline.getHours() + item.hours)
        nextDeadline = this.nextWorkDay(nextDeadline)
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
      return this.comments
    }
  },
  methods: {
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
      this.$emit('onConfirm', model)
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
      let user = this.$_.find(this.$props.users, u => u._id === _id)
      return user ? user : {}
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
      if (data.type === 'confirm') {
        this.$api('post', `bids/confirm`, { bidId: this.model._id }).then(response => {
          this.getBids()
          this.close()
        })
      } else if (data.type === 'confirmDate') {
        if (!data.date) return this.notify('Введите дату', 'danger')
        this.$api('post', `bids/confirm?confirmType=date`, { bidId: this.model._id, date: data.date.getTime() }).then(response => {
          this.getBids()
          this.close()
        })
      } else if (data.type === 'reject') {
        this.$api('post', `bids/decline`, { bidId: this.model._id }).then(response => {
          this.getBids()
          this.close()
        })
      } else if (data.type === 'rejectFull') {
        this.$api('post', `bids/decline`, { bidId: this.model._id, goToFirst: true }).then(response => {
          this.getBids()
          this.close()
        })
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
        console.log('response', response.data)
        this.loadComments(this.model._id)
      })
    },
    loadComments (moduleId) {
      this.$api('get', `comments/${moduleId}`).then(response => {
        this.comments = response.data.comments
      })
    },
    toggleReplyArea (index) {
      this.$set(this.replies, index, !this.replies[index])
    },
    replyMessage (commentId, comment) {
      this.$api('post', `comments`, { moduleId: this.model._id, comment, replyTo: commentId }).then(response => {
        console.log('response', response.data)
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
  .select-logo { margin: 0 0 25px; }
  .menu { list-style: none; display: flex; width: 100%; justify-content: space-around; margin: 0 0 20px; }
  .menu li.active a { color: #000; cursor: auto; font-weight: bold; }
  .author { font-weight: bold; margin-top: 10px; }
  .memo { padding: 50px; }
  .logo { text-align: center; }
  h3 { text-align: center; padding: 30px 0; margin: 30px 0; border: solid #000; border-width: 2px 0; text-transform: uppercase; }
  .user { margin: 10px -15px; }
  .user .to-title { opacity: 0; }
  .user:first-child .to-title { opacity: 1; }
  .theme { margin: 30px -15px 10px; }
  .from { margin: 10px -20px 10px; }
  .description { padding: 30px 0; margin: 30px 0; border: solid #000; border-width: 2px 0 0; }
  .from-wrapper { margin-top: 100px; }
  .pdf { color: #fff; margin-right: 10px; }
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
submit