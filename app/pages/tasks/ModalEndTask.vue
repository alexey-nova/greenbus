<template>
  <Modal :isOpen="model" @onSubmit="submit">

    <h3 slot="header" class="modal-title">Заавервишь задачу</h3>

    <div slot="content">
      Вы действительно хотите завершить эту задачу?
    </div>

    <div slot="footer">
      <button type="button" class="btn btn-secondary" data-dismiss="modal" @click="close">Отмена</button>
      <button type="submit" class="btn btn-success">Завершить</button>
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