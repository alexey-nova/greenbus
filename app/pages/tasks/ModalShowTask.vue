<template><div>
  <Modal :isOpen="model" type="lg">

    <h3 slot="header" class="modal-title">Информация по задаче</h3>

    <div slot="content">
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
        <i class="fa fa-clock-o"></i> Дата создания: {{$dateFormat(model.deadline, 'd mmm yyyy')}}<br />
          </span>
      </p>
    </div>

    <div slot="footer">

      <div class="time" style="float: left; text-align: left; padding-top: 5px;">
        <i class="fa fa-clock-o"></i> Срок до: {{$dateFormat(model.deadline, 'd mmm yyyy')}}
      </div>
      <button type="button" class="btn btn-default" data-dismiss="modal" @click="close"><i class="fa fa-times"></i>&nbsp;&nbsp;Закрыть окно</button>
      <button type="button" class="btn btn-danger" data-dismiss="modal" @click="toggleModal('rejectTask', model)"><i class="fa fa-times"></i>&nbsp;&nbsp;Отменить задачу</button>
      <button type="button" class="btn btn-primary" data-dismiss="modal" @click="toggleModal('endTask', model)"><i class="fa fa-calendar-check-o"></i>&nbsp;&nbsp;Завершить задачу</button>
    </div>
  </Modal>

  <ModalEnd :model="modal.endTask" @onSubmit="endTask" @onClose="toggleModal('endTask')"></ModalEnd>
  <ModalReject :model="modal.rejectTask" @onSubmit="rejectTask" @onClose="toggleModal('rejectTask')"></ModalReject>

</div></template>

<script>
  import Modal from '@/Modal'
  import ModalEnd from './ModalEndTask'
  import ModalReject from './ModalRejectTask'
  import ModalShowUser from './../users/ModalShowUser'
  import Datepicker from 'vuejs-datepicker'
  import { Switch } from 'element-ui'
  import 'element-ui/lib/theme-chalk/index.css'

  export default {
    components: {
      Modal,
      ModalEnd,
      ModalReject,
      ModalShowUser,
      Datepicker,
      'el-switch': Switch,
    },
    data () {
      return {
        modal: {
          endTask: false,
          rejectTask: false,
        },
        statuses: [
          'В работе',
          'На согласовании'
        ],
      }
    },
    props: ['model', 'users', 'onClose'],
    methods: {
      toggleModal (name, model) {
        this.modal[name] = model === undefined ? !this.modal[name] : model
      },
      endTask (task) {
        this.$emit('endTask', task)
      },
      rejectTask (task) {
        this.$emit('rejectTask', task)
      },
      close () {
        this.$emit('onClose')
      },
      getUser (_id) {
        let user = this.$_.find(this.$props.users, u => u._id === _id)
        return user ? user : {}
      },
    }
  }
</script>

<style lang="scss" scoped>
  h2 { margin-top: 0 }
</style>