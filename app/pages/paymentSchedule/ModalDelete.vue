<template>
  <Modal :isOpen="model" @onSubmit="submit">

    <h3 slot="header" class="modal-title">Удалить платежный календарь</h3>

    <div slot="content">
      Вы действительно хотите удалить этот платежный календарь?
    </div>

    <div slot="footer">
      <button type="button" class="btn btn-secondary" data-dismiss="modal" @click="close">Отмена</button>
      <button type="submit" class="btn btn-danger">Удалить</button>
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
    methods: {служебную записку
служебную записку
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