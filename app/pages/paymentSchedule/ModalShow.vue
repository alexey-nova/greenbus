<template><div>
  <Modal :isOpen="model" :type="['lg']">

    <div slot="content" id="memo" class="memo">
      <ul class="menu">
        <li :class="{'active': tabs === 0}" @click="toggleTab(0)"><a>Инфо</a></li>
        <li :class="{'active': tabs === 1}" @click="toggleTab(1)"><a>Файлы</a></li>
        <li :class="{'active': tabs === 2}" @click="toggleTab(2)"><a>Обсуждение</a></li>
      </ul>

      <div v-if="tabs === 0">
        <center>
          <select class="select-logo" name="logo" v-model="selectedLogo">
            <option value="logo1">GreenBus</option>
            <option value="logo2">Nike</option>
            <option value="logo3">Amazon</option>
          </select>
        </center>
      <div class="logo"><img :src="logo"/></div>
      <h3>Платежный календарь № {{model.id}}</h3>
      <table class="table table-bordered">
        <tr>
          <td class="fixed-width">Наименование&nbsp;поставщика: </td>
          <td>{{ model.provider }}</td>
        </tr>
        <tr>
          <td>Контракт&nbsp;№/Дата: </td>
          <td>{{ model.contractNo }}</td>
        </tr>
        <tr>
          <td>Описание: </td>
          <td>{{ model.description }}</td>
        </tr>
        <tr>
          <td>Общая&nbsp;сумма&nbsp;контракта/инвойса: </td>
          <td>{{ model.totalAmount }}</td>
        </tr>
        <tr>
          <td>Сумма&nbsp;предоплаты: </td>
          <td>{{ model.prepayment }}</td>
        </tr>
      </table>
      <strong>Кому:</strong>
      <div v-for="m in model.to" class="row user">
        <div class="col-md-5">
          <div class="to">
            {{getUser(m.user).position}}:
          </div>
        </div>
        <div class="col-md-3">
          <div class="to-name">{{getUser(m.user).fullname}}</div>
        </div>
        <div class="col-md-4">
          <div class="to-status">
            <div v-if="!(m.user !== $auth().user._id || m.answer !== 'undefined')">
              <button class="btn btn-sm btn-success" @click="toggleModal('confirm', model)">Согласовать</button>
              <button class="btn btn-sm btn-danger" @click="toggleModal('reject', model)">Отклонить</button>
            </div>
            <span class="title" v-if="m.user !== $auth().user._id || m.answer !== 'undefined'">
              {{statuses[m.answer]}}
            </span>
            <span class="date" v-if="m.answer !== 'undefined'">{{ comments[0] && getDate(getCreatedAt(comments.filter(comment => comment.from === m.user)[0])) }}</span>
          </div>
        </div>
      </div>
      <div class="row user" v-if="model.head">
        <div class="col-md-5">
          <em class="to">
            <strong>{{ getUser(model.head.user).position }}:</strong>
          </em>
        </div>
        <div class="col-md-3">
          <em class="to-name"><strong>{{ model.head && getUser(model.head.user).fullname }}</strong></em>
        </div>
        <div class="col-md-4">
          <div class="to-status">
            <div v-if="!((model.head.user !== $auth().user._id || model.head.answer !== 'undefined'))">
              <button class="btn btn-sm btn-success" @click="toggleModal('confirm', model)">Согласовать</button>
              <button class="btn btn-sm btn-danger" @click="toggleModal('reject', model)">Отклонить</button>
            </div>
            <em class="title" v-if="(model.head.user !== $auth().user._id || model.head.answer !== 'undefined')">
              <strong>{{statuses[model.head.answer]}}</strong>
            </em>
            <span class="date" v-if="model.head.answer !== 'undefined'">
              {{ comments[0] && getDate(getCreatedAt(comments.filter(comment => comment.from === model.head.user)[0])) }}
            </span>
          </div>
        </div>
      </div>

      <div class="row theme">
        <div class="col-md-5">
          <div class="to">
            <strong>Описание заявки:</strong>
            <div v-html="model.comment"></div>
          </div>
        </div>
        <div class="col-md-5">
          <div class="to">
            <strong>Дата:</strong>
            {{ model.createdAt && getDate(model.createdAt) }}
          </div>
        </div>
      </div>

        <!--<div class="row user">-->
          <!--<div class="col-md-5">-->
            <!--<div class="to">-->
              <!--<strong>Дата:</strong>-->
              <!--{{$dateFormat(model, 'd mmm yyyy')}}-->
            <!--</div>-->
          <!--</div>-->
        <!--</div>-->

        <div class="from-wrapper">
          <div class="from-title"><strong>Исполнитель</strong></div>

          <div class="row from">
            <div class="col-md-5">
              <div class="to">
                {{getUser(model.from).position}}:
              </div>
            </div>
            <div class="col-md-3">
              <div class="to-name">{{getUser(model.from).fullname}}</div>
            </div>
          </div>
        </div>
      </div>


      <ul v-if="tabs === 1">
        <li v-for="file in model.files">
          <div><a :href="$config('app.fileUrl') + file.path" target="_blank">{{file.name}}</a></div>
        </li>
      </ul>
      <div v-if="tabs === 2">
        <div v-if="!$_.size(comments)">
          Обсуждений нет
        </div>
        <div v-for="comment in comments">
          <div class="author">{{getUser(comment.from).fullname}}</div>
          <div class="comment">{{comment.comment}}</div>
          <div v-for="file in comment.files">
            <div><a :href="$config('app.fileUrl') + file.path" target="_blank">{{file.name}}</a></div>
          </div>
        </div>
      </div>
    </div>

    <div slot="footer">
      <button type="button" class="btn btn-default" data-dismiss="modal" @click="close"><i class="fa fa-times"></i>&nbsp;&nbsp;Закрыть окно</button>
      <button type="button" class="btn btn-success" @click="pdf"><i class="fa fa-file-pdf-o"></i>&nbsp;&nbsp;Скачать</button>
    </div>

  </Modal>

  <ModalConfirm :model="modal.confirm" @onSubmit="confirm" @onClose="toggleModal('confirm')"></ModalConfirm>
  <ModalReject :model="modal.reject" @onSubmit="reject" @onClose="toggleModal('reject')"></ModalReject>
</div></template>

<script>
  import Modal from '@/Modal'
  import ModalConfirm from './ModalConfirm'
  import ModalReject from './ModalReject'
  import 'pdfmake/build/pdfmake.js'
  import pdfFonts from 'pdfmake/build/vfs_fonts.js'
  pdfMake.vfs = pdfFonts.pdfMake.vfs
  import pdf from './pdf'
  import logo1 from '#/assets/design/logos/logo1.png'
  import logo2 from '#/assets/design/logos/logo2.jpg'
  import logo3 from '#/assets/design/logos/logo3.jpg'
//  import '#/assets/pdfmake/vfs_fonts.js'

  export default {
    components: {
      Modal,
      ModalConfirm,
      ModalReject,
    },
    data () {
      return {
        selectedLogo: 'logo1',
        comments: [],
        modal: {
          confirm: false,
          reject: false,
        },
        statuses: {
          'undefined': 'На согласовании',
          'confirm': 'Согласовано',
          'reject': 'Отклонено',
        },
        tabs: 0,
        controlUser: {}
      }
    },
    props: ['model', 'users', 'onConfirm', 'onReject', 'onClose', 'tab'],
    watch: {
      model () {
        if (this.$props.model)
          this.loadPS()
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
    },
    methods: {
      getDate (date) {
        date = new Date(date)
        const dates = ['янв', 'фев', 'мар', 'апр', 'мая', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек']
        return `${date.getDate()} ${dates[date.getMonth()]} ${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`
      },
      getCreatedAt (comment) {
        return comment && comment.createdAt ? comment.createdAt : null
      },
      toggleTab(tab) {
        this.tab = tab
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
      loadPS () {
        if (this.model._id) {
          this.$api('get', 'paymentSchedules/' + this.model._id).then(response => {
            this.comments = response.data.replies
          }).catch(e => {
            this.notify(e, 'danger')
          })
        }
      },
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
  .theme { margin: 30px -15px 10px; }
  .from { margin: 10px -20px 10px; }

  .description { padding: 30px 0; margin: 30px 0; border: solid #000; border-width: 2px 0 0; }
  .from-wrapper { margin-top: 100px; }
  .fixed-width { min-width: 300px; vertical-align: baseline; }
</style>
