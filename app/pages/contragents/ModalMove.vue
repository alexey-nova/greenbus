<template>
  <Modal :isOpen="model" @onSubmit="submit">
    <div slot="content" class="modal-dialog small2">
      <div class="modal-content">
        <div class="modal-header">
          <div class="list_header">
            <div class="flex">
              <div>
                <span>Переместить папку</span>
              </div>
              <div class="buttons">
                <button type="button" class="button-top close" data-dismiss="modal" aria-label="Close" @click="close"></button>
              </div>
            </div>
          </div>
        </div>
        <div class="profile full modal-body">
          <div :class="['form-group', {'has-error': errors.has('name')}]">
            <label for="field-name">Выберите папку для перемещения *</label>
            <select name="dest" v-model="model.dest">
              <option v-for="folder in folders" :value="folder._id">{{ folder.finalStr }}</option>
            </select>
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
    MaskedInput
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
      if (strings.length > 0) this.folders = response.data.filter(folder => !(new RegExp(starts).test(folder.finalStr)))
      else this.folders = response.data
    })
  }
}
</script>

<!-- <style src="vue-multiselect/dist/vue-multiselect.min.css"></style> -->
<style lang="scss" scoped>

</style>
