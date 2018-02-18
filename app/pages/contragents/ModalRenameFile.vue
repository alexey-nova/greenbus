<template>
  <Modal :isOpen="model" @onSubmit="submit">

    <h3 slot="header" class="modal-title">Переименовать файл</h3>

    <div slot="content" class="row">
      <div class="col-lg-6">
        <div :class="['form-group', {'has-error': errors.has('name')}]">
          <label for="field-name">Название *</label>
          <input id="field-name" class="form-control" v-validate="'required'" name="name" v-model="model.name">
          <span v-show="errors.has('name')" class="help-block">{{ errors.first('name') }}</span>
        </div>
      </div>
    </div>
    <div slot="footer">
      <button type="button" class="btn btn-default" data-dismiss="modal" @click="close"><i class="fa fa-times"></i>&nbsp;&nbsp;Отмена</button>
      <button type="submit" class="btn btn-success"><i class="fa fa-check"></i>&nbsp;&nbsp;Создать</button>
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
    props: ['model', 'onSubmit', 'onClose', 'folder'],
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
