<template>
  <Modal :isOpen="model" @onSubmit="submit">

    <h3 slot="header" class="modal-title">Удалить пользователя</h3>

    <div slot="content">
      Вы действительно хотите удалить пользователя <strong>{{model.fullname}}</strong>?
    </div>

    <div slot="footer">
      <button type="button" class="btn btn-default" data-dismiss="modal" @click="close"><i class="fa fa-times"></i>&nbsp;&nbsp;Отмена</button>
      <button type="submit" class="btn btn-danger"><i class="fa fa-trash"></i>&nbsp;&nbsp;Удалить</button>
    </div>

  </Modal>
</template>

<script>
  import Modal from '@/Modal'

  export default {
    components: {
      Modal,
    },
    props: ['model', 'onSubmit', 'onClose'],
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