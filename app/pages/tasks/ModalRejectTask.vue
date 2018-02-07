<template>
  <Modal :isOpen="model" @onSubmit="submit">

    <h3 slot="header" class="modal-title">Отменить задачу</h3>

    <div slot="content">
      <div class="form-group">
        <label for="field-comment">Комментарий</label>
        <textarea id="field-comment" class="form-control" v-model="model.comment"></textarea>
      </div>
      <div class="form-group">
        <label for="field-files">Прикрепить файл</label>
        <input id="field-files" type="file">
      </div>
    </div>

    <div slot="footer">
      <button type="button" class="btn btn-secondary" data-dismiss="modal" @click="close"><i class="fa fa-times"></i>&nbsp;&nbsp;Отмена</button>
      <button type="submit" class="btn btn-danger"><i class="fa fa-times"></i>&nbsp;&nbsp;Отменить задачу</button>
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