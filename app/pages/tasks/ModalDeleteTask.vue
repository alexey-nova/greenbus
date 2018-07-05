<template>
  <Modal :isOpen="model" @onSubmit="submit">
    <div class="modal-dialog small" slot="content">
      <div class="modal-content">
        <div class="modal-header">
          <div class="list_header">
            <div class="flex">
              <span>Удалить задачу</span>
              <div class="buttons">
                <button class="button-top close body-add" type="button" @click="close"></button>
              </div>
            </div>
          </div>
        </div>
        <div class="profile full modal-body">
          <span>Вы действительно хотите удалить эту задачу?</span>
          <div class="flex flex-end red">
            <button class="save pad btn-danger">Удалить</button>
          </div>
        </div>
          <div class="modal-footer"></div>
      </div>
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
