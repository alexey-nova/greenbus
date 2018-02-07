<template>
  <Modal :isOpen="model" :type="['lg']">

    <div slot="content" id="memo" class="memo">
      <div class="logo"><img src="./../../assets/design/logo.png"/></div>
      <h3>Служебная записка №{{model.id}}</h3>


      <div v-for="m in model.to" class="row user">
        <div class="col-md-5">
          <div class="to">
            <strong>Кому:</strong>
            {{getUser(m.user).position}}:
          </div>
        </div>
        <div class="col-md-3">
          <div class="to-name">{{getUser(m.user).fullname}}</div>
        </div>
        <div class="col-md-4">
          <div class="to-status">
            <span class="title">{{statuses[m.answer]}}</span>
            <!--<span class="date">14 Февраля 2018</span>-->
          </div>
        </div>
      </div>

      <div class="description">
        <h4>{{model.name}}</h4>
        {{model.text}}
      </div>

      <div class="from-wrapper">
        <div class="from"><strong>Исполнитель</strong></div>

        <div class="row user">
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

    <div slot="footer">
      <button type="button" class="btn btn-default" data-dismiss="modal" @click="close"><i class="fa fa-times"></i>&nbsp;&nbsp;Закрыть окно</button>
      <button type="button" class="btn btn-success" @click="pdf"><i class="fa fa-file-pdf-o"></i>&nbsp;&nbsp;Скачать</button>
    </div>

  </Modal>
</template>

<script>
  import Modal from '@/Modal'
  import jspdf from 'jspdf'

  export default {
    components: {
      Modal,
    },
    data () {
      return {
        statuses: {
          'undefined': 'На согласовании',
          'accept': 'Согласовано',
          'reject': 'Отказано',
        }
      }
    },
    props: ['model', 'users', 'onClose'],
    methods: {
      close () {
        this.$emit('onClose')
      },
      pdf () {
        let doc = new jspdf()
        doc.fromHTML(document.getElementById('memo'), 15, 15, {
          'width': 170,
        }, (a) => {
          doc.save(this.$props.model.name + '.pdf')
        })
      },
      getUser (_id) {
        let user = this.$_.find(this.$props.users, u => u._id === _id)
        return user ? user : {}
      },
    },
  }
</script>

<style lang="scss" scoped>
  .memo { padding: 50px; }
  .logo { text-align: center; }
  h3 { text-align: center; padding: 30px 0; margin: 30px 0; border: solid #000; border-width: 2px 0; text-transform: uppercase; }

  .user { margin: 10px -15px; }

  .description { padding: 30px 0; margin: 30px 0; border: solid #000; border-width: 2px 0 0; }
  .from-wrapper { margin-top: 100px; }
</style>