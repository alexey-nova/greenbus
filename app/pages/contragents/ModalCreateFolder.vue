<template>
  <Modal :isOpen="model" @onSubmit="submit">
    <div slot="content" class="modal-dialog small2">
      <div class="modal-content">
        <div class="modal-header">
          <div class="list_header">
            <div class="flex">
              <div>
                <span>Создать папку</span>
              </div>
              <div class="buttons">
                <button type="button" class="button-top close" data-dismiss="modal" aria-label="Close" @click="close"></button>
              </div>
            </div>
          </div>
        </div>
        <div class="profile full  modal-body">
          <div :class="['', {'has-error': errors.has('name')}]">
            <label for="field-name">Название *</label>
            <input id="field-name" v-validate="'required'" name="name" v-model="model.name">
            <span v-show="errors.has('name')" class="help-block">{{ errors.first('name') }}</span>
          </div>
          <div class="flex center">
            <button type="submit" class="add-button auto-width form-submit">Сохранить</button>
          </div>
        </div>
        <div class="modal-footer"></div>
      </div>
    </div>
  </Modal>
</template>

<script>
  import 'element-ui/lib/theme-chalk/index.css'
  import Modal from '@/Modal'
  import MaskedInput from 'vue-masked-input'

  export default {
    components: {
      Modal,
      MaskedInput,
    },
    data () {
      return {}
    },
    props: ['model', 'onSubmit', 'onClose',],
    methods: {
      close () {
        this.$emit('onClose')
      },
      submit () {
        this.$validator.validateAll().then(() => {
          if (!this.$_.size(this.errors.items)) {
            let model = this.$_.clone(this.$props.model)
            this.$emit('onSubmit', model)
          }
        }).catch(() => {
        })
      }
    },
    computed: {}
  }
</script>

<!-- <style src="vue-multiselect/dist/vue-multiselect.min.css"></style> -->
<style lang="scss" scoped>

</style>
