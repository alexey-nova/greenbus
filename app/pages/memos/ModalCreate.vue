<template>
  <Modal v-if="isOpen" :isOpen="true" @onSubmit="onSubmit" @onClose="onClose">

    <h3 slot="header" class="modal-title">Создать задачу</h3>

    <div slot="content" ref="form">
      <div class="form-group">
        <label for="name">Название *</label>
        <input class="form-control" id="name" v-model="model.name">
      </div>
      <div class="form-group">
        <label for="description">Описание *</label>
        <input class="form-control" id="description" v-model="model.text">
      </div>
      <div class="form-group">
        <label for="fieldResponsible">Ответственный *</label>
        <select id="fieldResponsible" class="form-control" v-model="model.to">
          <option v-for="u in users" :value="u._id">{{u.fullname}}</option>
        </select>
      </div>
      <div class="form-group">
        <label for="fieldPhone">Прикрепить файл</label>
        <input id="fieldPhone" type="file">
      </div>
    </div>

    <div slot="footer">
      <button class="btn btn-secondary" type="button" data-dismiss="modal" @click="onClose">Отмена</button>
      <button class="btn btn-primary">Создать</button>
    </div>

  </Modal>
</template>

<script>
  import 'element-ui/lib/theme-chalk/index.css'
  import Modal from '@/Modal'
  import Datepicker from 'vuejs-datepicker'
  import { Switch } from 'element-ui'

  export default {
    components: {
      Modal,
      Datepicker,
      'el-switch': Switch,
    },
    data () {
      return {
        model: {
          name: '',
          to: 0,
          text: '',
          files: [],
        }
      }
    },
    props: ['isOpen', 'users'],
    methods: {
      onClose () {
        this.$emit('onClose')
      },
      onSubmit (event) {
        event.preventDefault()
        this.$emit('onSubmit', event, this.model)
      },
      click (event) {
        this.onSubmit(event)
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>