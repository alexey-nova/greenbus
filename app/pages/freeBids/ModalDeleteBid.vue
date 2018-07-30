<template>
  <Modal :isOpen="model" @onSubmit="submit">
    <div class="modal-dialog small" slot="content">
      <div class="modal-content">
        <div class="modal-header">
          <div class="list_header">
            <div class="flex">
              <span>Удалить служебную записку</span>
              <div class="buttons">
                <button class="button-top close body-add" type="button" @click="close"></button>
              </div>
            </div>
          </div>
        </div>
        <div class="profile full modal-body">
          <span>Вы действительно хотите удалить эту служебную записку?</span>
          <div class="flex flex-end red">
            <button type="button" class="save pad" @click="close">Отмена</button>
            <button class="save pad btn-danger">Удалить</button>
          </div>
        </div>
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
.save.pad:first-child {
  margin-right: 10px;
}
</style>
