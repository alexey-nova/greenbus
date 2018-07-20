<template>
  <Modal :isOpen="model" @onSubmit="submit">
    <div slot="content" class="modal-dialog small2">
      <div class="modal-content">
        <div class="modal-header">
          <div class="list_header">
            <div class="flex">
              <div>
                <span>Удалить файлы и папки</span>
              </div>
              <div class="buttons">
                <button type="button" class="button-top close" data-dismiss="modal" aria-label="Close" @click="close"></button>
              </div>
            </div>
          </div>
        </div>
        <div class="profile full modal-body">
          <span>Вы действительно хотите удалить эти файлы и папки?</span>
          <div class="flex flex-end red">
            <button type="submit" class="save pad btn-danger">Удалить</button>
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
    Modal
  },
  props: ['model', 'onSubmit', 'onClose'],
  methods: {
    close () {
      this.$emit('onClose')
    },
    submit () {
      this.$emit('onSubmit', this.model)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
