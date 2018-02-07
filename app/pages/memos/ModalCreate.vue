<template>
  <Modal :isOpen="model" type="lg" @onSubmit="submit">

    <h3 slot="header" class="modal-title">Создать служебную записку</h3>

    <div slot="content" class="row">
      <div class="col-lg-6">
        <div :class="['form-group', {'has-error': errors.has('name')}]">
          <label for="field-name">Тема *</label>
          <input id="field-name" class="form-control" v-validate="'required'" name="name" v-model="model.name">
          <span v-show="errors.has('name')" class="help-block">{{ errors.first('name') }}</span>
        </div>
        <div :class="['form-group', {'has-error': errors.has('text')}]">
          <label for="field-text">Описание *</label>
          <textarea id="field-text" class="form-control" rows="4" v-validate="'required'" name="text" v-model="model.text"></textarea>
          <span v-show="errors.has('text')" class="help-block">{{ errors.first('text') }}</span>
        </div>
      </div>
      <div class="col-lg-6">
        <div :class="['form-group', {'has-error': errors.has('memoTo')}]">
          <label for="field-memoTo">Кому *</label>
          <select id="field-memoTo" class="form-control" v-validate="'required'" name="memoTo"  v-model="model.to">
            <option v-for="u in users" :value="u._id">{{u.fullname}}</option>
          </select>
          <span v-show="errors.has('memoTo')" class="help-block">{{ errors.first('memoTo') }}</span>
        </div>
        <div class="form-group">
          <label for="field-files">Прикрепить файл</label>
          <input id="field-files" type="file">
        </div>
      </div>
    </div>

    <div slot="footer">
      <button type="button" class="btn btn-default" data-dismiss="modal" @click="close"><i class="fa fa-times"></i>&nbsp;&nbsp;Отмена</button>
      <button type="submit" class="btn btn-success"><i class="fa fa-check"></i>&nbsp;&nbsp;Создать</button>
    </div>

  </Modal>
</template>

<script>
  import 'element-ui/lib/theme-chalk/index.css'
  import Modal from '@/Modal'
  import MaskedInput from 'vue-masked-input'
  import Datepicker from 'vuejs-datepicker'
  import { Switch } from 'element-ui'

  export default {
    components: {
      Modal,
      MaskedInput,
      Datepicker,
      'el-switch': Switch,
    },
    props: ['model', 'users', 'onSubmit', 'onClose'],
    methods: {
      close () {
        this.$emit('onClose')
      },
      submit () {
        this.$validator.validateAll().then(() => {
          if (!this.$_.size(this.errors.items)) {
            this.$emit('onSubmit', this.model)
          }
        }).catch(() => {
        })
      },
    }
  }
</script>

<style lang="scss" scoped>

</style>