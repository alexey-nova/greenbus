<template>
  <Modal :isOpen="model" @onSubmit="submit">
    <div class="modal-dialog small" role="document" slot="content">
      <div class="modal-content">
        <div class="modal-header">
          <div class="list_header">
            <div class="flex">
              <span>Удалить {{setTypeName}}</span>
              <div class="buttons">
                <button type="button" class="button-top close body-add close-add-class" @click="close"></button>
              </div>
            </div>
          </div>
        </div>
        <div class="profile full modal-body">
          <span>При удалении {{setTypeName}}а все относящиеся к этому {{setTypeName}}у <span class="bold">{{model.name}}</span> тоже удалятся.</span>
          <div class="flex flex-end red">
            <button class="save pad btn-danger">Продолжить</button>
            <button class="save pad" type="button" @click="close">Отмена</button>
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
  name: 'ModalDelete',
  components: {
    Modal
  },
  props: ['onSubmit', 'model', 'onClose'],
  computed: {
    setTypeName () {
      const names = {
        department: 'департамент',
        otdel: 'отдел',
        position: 'должность'
      }
      return names[this.model.type]
    }
  },
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
