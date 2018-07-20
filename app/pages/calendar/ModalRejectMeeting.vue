<template>
    <Modal :isOpen="model" @onSubmit="submit">
      <div slot="content" class="modal-dialog small2">
        <div class="modal-content">
          <div class="modal-header">
            <div class="list_header">
              <div class="flex">
                <span class="modal-title">Отказаться от встречи</span>
                <div class="buttons">
                  <button type="button" class="button-top close" @click="close"></button>
                </div>
              </div>
            </div>
          </div>
          <div class="profile full modal-body">
            <div class="form-group">
              Вы действительно хотите отказаться от встречи?
            </div>
            <div class="flex flex-end m-center">
              <button type="button" class="save pad2" data-dismiss="modal" @click="close">Отмена</button>
              <button type="submit" class="save pad2 btn-danger">Отказать</button>
            </div>
          </div>
          <div class="modal-footer">
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
                this.$emit('onSubmit', this.$props.model)
            },
        }
    }
</script>

<style lang="scss" scoped>

</style>
