<template>
  <div>
    <Modal :isOpen="model" :type="['lg']">

      <div slot="content" id="memo" class="memo">
        <ul class="menu">
          <li :class="{'active': tabs === 0}" @click="toggleTab(0)"><a>Инфо</a></li>
          <li :class="{'active': tabs === 1}" @click="toggleTab(1)"><a>Файлы</a></li>
          <li :class="{'active': tabs === 2}" @click="toggleTab(2)"><a>Обсуждение</a></li>
        </ul>

        <div v-if="tabs === 0">
          <div class="logo"><img src="./../../assets/design/logo.png"/></div>
          <h3>Служебная записка №{{model.id}}</h3>

          <div class="users">
            <div v-for="m in model.to" class="row user">
              <div class="col-md-4">
                <div class="to">
                  <strong class="to-title">Кому:</strong>
                  {{getUser(m.user).position}}:
                </div>
              </div>
              <div class="col-md-4">
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
                  <span class="date" v-if="m.answer !== 'undefined'">{{$dateFormat(m.updatedAt, 'd mmm yyyy, hh:MM')}}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="row theme">
            <div class="col-md-5">
              <div class="to">
                <strong>Тема:</strong>
                {{model.name}}
              </div>
            </div>
          </div>

          <div class="row user">
            <div class="col-md-5">
              <div class="to">
                <strong>Дата:</strong>
                {{$dateFormat(model.createdAt, 'd mmm yyyy, hh:MM')}}
              </div>
            </div>
          </div>

          <div class="description">
            {{model.text}}
          </div>

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


        <div v-if="tabs === 1">
          <div v-for="file in model.files">
            <div><a :href="$config('app.fileUrl') + file.path" target="_blank">{{file.name}}</a></div>
          </div>
        </div>
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
        <button type="button" class="btn btn-default" data-dismiss="modal" @click="close"><i class="fa fa-times"></i>&nbsp;&nbsp;Закрыть окно
        </button>
        <button type="button" class="btn btn-success" @click="pdf"><i class="fa fa-file-pdf-o"></i>&nbsp;&nbsp;Скачать</button>
      </div>

    </Modal>

    <ModalConfirm :model="modal.confirm" @onSubmit="confirm" @onClose="toggleModal('confirm')"></ModalConfirm>
    <ModalReject :model="modal.reject" @onSubmit="reject" @onClose="toggleModal('reject')"></ModalReject>
  </div>
</template>

<script>
  import Modal from '@/Modal'
  import ModalConfirm from './ModalConfirm'
  import ModalReject from './ModalReject'
  import 'pdfmake/build/pdfmake.js'
  import pdfFonts from 'pdfmake/build/vfs_fonts.js'
  pdfMake.vfs = pdfFonts.pdfMake.vfs
  import pdf from './pdf'
  import logo from '#/assets/design/logo.png'

  export default {
    components: {
      Modal,
      ModalConfirm,
      ModalReject,
    },
    data () {
      return {
        comments: [],
        modal: {
          confirm: false,
          reject: false,
        },
        tabs: 0,
        statuses: {
          'undefined': 'На согласовании',
          'confirm': 'Согласовано',
          'reject': 'Отклонено',
        },
      }
    },
    props: ['model', 'users', 'tab', 'onConfirm', 'onReject', 'onClose'],
    watch: {
      model () {
        if (this.$props.model)
          this.loadMemo()
      },
      tab () {
        this.tabs = this.$props.tab
      }
    },
    methods: {
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
        let docDefinition = pdf.create(logo, this.$props.model, this.getUser, this.$dateFormat, this.statuses)
        pdfMake.createPdf(docDefinition).download()
      },
      getUser (_id) {
        let user = this.$_.find(this.$props.users, u => u._id === _id)
        return user ? user : {}
      },
      loadMemo () {
        this.$api('get', 'memos/' + this.model._id).then(response => {
          this.comments = response.data.replies
        }).catch(e => {
          this.notify(e, 'danger')
        })
      },
    },
  }
</script>

<style lang="scss" scoped>
  .menu { list-style: none; display: flex; width: 100%; justify-content: space-around; margin: 0 0 20px; }
  .menu li { }
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
</style>