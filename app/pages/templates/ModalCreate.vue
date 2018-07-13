<template>
  <Modal :isOpen="model" @onSubmit="submit">
    <div slot="content" class="modal-dialog small2">
      <div class="modal-content">
        <div class="modal-header">
        <div class="list_header">
          <div class="flex">
            <div>
              <span>Добавить новую категорию</span>
            </div>
            <div class="buttons">
              <button type="button" class="button-top close close-add-class" @click="close"></button>
            </div>
          </div>
        </div>
      </div>
      <div class="profile full modal-body">
        <div :class="[{'has-error': errors.has('name')}]">
          <label>Название *</label>
          <input type="text" v-validate="'required'" name="name" v-model="model.name">
          <span v-show="errors.has('name')" class="help-block">{{ errors.first('name') }}</span>
        </div>
        <div class="flex center">
            <button type="" class="add-button auto-width form-submit">Добавить</button>
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
    data () {
      return {
      }
    },
    props: ['model', 'onSubmit', 'onClose'],
    computed: {
    },
    methods: {
      close () {
        this.$emit('onClose')
      },
      submit () {
        this.$validator.validateAll().then(() => {
          if (!this.$_.size(this.errors.items)) {
            this.$emit('onSubmit', this.model)
          }
        }).catch(() => {})
      },
    }
  }
</script>

<style lang="scss" scoped>

</style>
