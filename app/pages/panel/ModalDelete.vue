<template>
  <Modal>
    <div class="modal-dialog small" role="document" slot="content">
      <div class="modal-content">
        <div class="modal-header">
          <div class="list_header">
            <div class="flex">
              <span>Удалить {{setTypeName}}</span>
              <div class="buttons">
                <button type="button" class="button-top close body-add close-add-class"></button>
              </div>
            </div>
          </div>
        </div>
        <div class="profile full modal-body">
          <span>Вы действительно хотите удалить {{setTypeName}} <span class="bold">{{model.name}}</span>?</span>
          <div class="flex flex-end red">
            <button class="save pad">Удалить</button>
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
  props: ['onSubmit', 'model', 'departments', 'otdels', 'onClose'],
  computed: {
    setTypeName () {
      const names = {
        department: 'департамент',
        otdel: 'отдел',
        position: 'должность'
      }
      return names[this.model.type]
    }
  }
}
</script>
