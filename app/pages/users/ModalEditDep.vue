<template>
  <Modal :isOpen="model" @onSubmit="submit">

    <h3 slot="header" class="modal-title">Редактирование отдела</h3>

    <div slot="content">
      <div :class="['form-group', {'has-error': errors.has('name')}]">
        <label for="field-name">Название *</label>
        <input id="field-name" class="form-control" v-validate="'required'" name="name" v-model="model.name">
        <span v-show="errors.has('name')" class="help-block">{{ errors.first('name') }}</span>
      </div>
    </div>

    <div slot="footer">
      <button type="button" class="btn btn-default" data-dismiss="modal" @click="close"><i class="fa fa-times"></i>&nbsp;&nbsp;Отмена</button>
      <button type="submit" class="btn btn-success"><i class="fa fa-check"></i>&nbsp;&nbsp;Сохранить</button>
    </div>

  </Modal>
</template>

<script>
  import Modal from '@/Modal'
  import MaskedInput from 'vue-masked-input'

  export default {
    components: {
      Modal,
      MaskedInput,
    },
    props: ['model', 'onSubmit', 'onClose'],
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