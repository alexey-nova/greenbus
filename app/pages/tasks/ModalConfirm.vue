<template>
  <Modal :isOpen="model" @onSubmit="submit">
    <div slot="content" class="modal-dialog small">
      <div class="modal-content">
        <div class="modal-header">
          <div class="list_header">
            <div class="flex">
              <span>Согласовать задачу</span>
              <div class="buttons">
                <button class="button-top close" type="button" @click="close"></button>
              </div>
            </div>
          </div>
        </div>
        <div class="profile full modal-body">
          <div class="form-item">
            <label for="field-comment">Комментарий</label>
            <textarea id="field-comment" class="form-control" v-model="model.comment"></textarea>
          </div>
          <div class="form-item">
            <label class="custom-file-label" for="field-files">Прикрепить файлы</label>
            <input type="file" multiple id="field-files" lang="ru" @change="addFiles">
          </div>
          <div class="flex flex-end">
            <button type="button" class="save pad2" data-dismiss="modal" @click="close"><i class="fa fa-times"></i>&nbsp;&nbsp;Отмена</button>
            <button type="submit" class="save pad2"><i class="fa fa-check"></i>&nbsp;&nbsp;Согласовать</button>
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
      addFiles (e) {
        let files = e.target.files || e.dataTransfer.files
        if (!files.length) return

        this.$props.model.files = files
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
