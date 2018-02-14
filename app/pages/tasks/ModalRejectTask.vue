<template>
  <Modal :isOpen="model" @onSubmit="submit">

    <h3 slot="header" class="modal-title">Отказать</h3>

    <div slot="content">
      <div class="form-group">
        <label for="field-comment">Комментарий</label>
        <textarea id="field-comment" class="form-control" v-model="model.comment"></textarea>
      </div>
      <div class="form-group">
        <label class="custom-file-label" for="field-files">Прикрепить файлы</label>
        <input type="file" multiple id="field-files" lang="ru" @change="addFiles">
      </div>
    </div>

    <div slot="footer">
      <button type="button" class="btn btn-secondary" data-dismiss="modal" @click="close"><i class="fa fa-times"></i>&nbsp;&nbsp;Отмена</button>
      <button type="submit" class="btn btn-success"><i class="fa fa-times"></i>&nbsp;&nbsp;Отказать</button>
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