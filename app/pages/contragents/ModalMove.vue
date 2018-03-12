<template>
  <Modal :isOpen="model" @onSubmit="submit">

    <h3 slot="header" class="modal-title">Создать папку</h3>

    <div slot="content" class="row">
      <div class="col-lg-6">
        <div :class="['form-group', {'has-error': errors.has('name')}]">
          <label for="field-name">Выберите папку для перемещения *</label>
          <select name="dest" v-model="model.dest">
            <option v-for="folder in folders" :value="folder._id">{{ folder.finalStr }}</option>
          </select>
        </div>
      </div>
    </div>
    <div slot="footer">
      <button type="button" class="btn btn-default" data-dismiss="modal" @click="close"><i class="fa fa-times"></i>&nbsp;&nbsp;Отмена</button>
      <button type="submit" class="btn btn-success"><i class="fa fa-check"></i>&nbsp;&nbsp;Переместить</button>
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
      return {
        folders: []
      }
    },
    props: ['model', 'onSubmit', 'onClose', 'ids'],
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
    computed: {},
    mounted () {
      this.$api('get', 'ca/folders').then(response => {
        const strings = []
        response.data.map(folder => {
          if (this.ids.includes(folder._id)) {
            strings.push(folder.finalStr)
          }
        })
        const starts = `^(${strings.join('|')})`
        if(strings.length > 0) this.folders = response.data.filter(folder => !(new RegExp(starts).test(folder.finalStr)))
        else this.folders = response.data
      })
    }
  }
</script>

<!-- <style src="vue-multiselect/dist/vue-multiselect.min.css"></style> -->
<style lang="scss" scoped>

</style>
