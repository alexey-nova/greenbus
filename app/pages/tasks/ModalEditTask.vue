<template>
  <Modal :isOpen="model" @onSubmit="submit">

    <h3 slot="header" class="modal-title">Редактировать задачу</h3>

    <div slot="content">
      <div class="form-group">
        <label for="field-name">Название</label>
        <input id="field-name" class="form-control" v-model="model.name">
      </div>
      <div class="form-group">
        <label for="field-description">Описание</label>
        <textarea id="field-description" class="form-control" v-model="model.description"></textarea>
      </div>
      <div class="form-group">
        <label>Срок сдачи *</label>
        <Datepicker input-class="form-control" language="ru" v-model="model.deadline"></Datepicker>
      </div>
      <div class="form-group">
        <label for="field-to">Ответственный *</label>
        <select id="field-to" class="form-control" v-model="model.to">
          <option v-for="u in users" :value="u._id">{{u.fullname}}</option>
        </select>
      </div>
      <div class="form-group">
        <label for="field-urgency">Срочно</label><br />
        <el-switch id="field-urgency" v-model="model.urgency"></el-switch>
      </div>
      <div class="form-group">
        <label for="field-files">Прикрепить файл</label>
        <input id="field-files" type="file">
      </div>
    </div>

    <div slot="footer">
      <button type="button" class="btn btn-secondary" data-dismiss="modal" @click="close">Отмена</button>
      <button type="submit" class="btn btn-primary">Сохранить</button>
    </div>

  </Modal>
</template>

<script>
  import Modal from '@/Modal'
  import Datepicker from 'vuejs-datepicker'
  import { Switch } from 'element-ui'
  import 'element-ui/lib/theme-chalk/index.css'

  export default {
    components: {
      Modal,
      Datepicker,
      'el-switch': Switch,
    },
    props: ['model', 'users', 'onSubmit', 'onClose'],
    methods: {
      close () {
        this.$emit('onClose')
      },
      submit () {
        this.$emit('onSubmit', this.model)
      },
    }
  }
</script>

<style lang="scss" scoped>

</style>