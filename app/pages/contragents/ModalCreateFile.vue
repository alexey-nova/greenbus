<template>
  <Modal :isOpen="model" @onSubmit="submit">
    <div slot="content" class="modal-dialog small2">
      <div class="modal-content">
        <div class="modal-header">
          <div class="list_header">
            <div class="flex">
              <div>
                <span>Создать файл</span>
              </div>
              <div class="buttons">
                <button type="button" class="button-top close" data-dismiss="modal" aria-label="Close" @click="close"></button>
              </div>
            </div>
          </div>
        </div>
        <div class="profile full  modal-body">
          <label>Загрузить файлы</label>
          <!-- <input type="file" multiple id="field-files" lang="ru" @change="addFiles"> -->
          <div class="select-file">
            <file-upload
              class="btn btn-default"
              :multiple="true"
              v-model="files"
              ref="upload">
              Прикрепить файлы
            </file-upload>
            <ul style="list-style: none; padding: 0;">
              <li v-for="(file, index) in files" :key="index">
                <span class="file-remove" @click="removeFile(index)">x</span>
                <span>{{file.name}}</span> -
                <span>{{Math.ceil(file.size / 1024)}} КБ</span>
              </li>
            </ul>
          </div>
          <div class="flex center">
            <button type="submit" class="add-button auto-width form-submit">Загрузить</button>
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
import Multiselect from 'vue-multiselect'
import FileUpload from 'vue-upload-component'

export default {
  components: {
    Modal,
    MaskedInput,
    Multiselect,
    FileUpload
  },
  data () {
    return {
      files: []
    }
  },
  props: ['model', 'onSubmit', 'onClose', 'uploadingFiles'],
  methods: {
    close () {
      this.$emit('onClose')
    },
    submit () {
      this.$validator.validateAll().then(() => {
        if (!this.$_.size(this.errors.items)) {
          // let model = this.$_.clone(this.$props.model)
          this.$emit('onSubmit', this.files)
          this.files = []
        }
      }).catch(() => {
        console.log('t')
      })
    },
    removeFile (index) {
      this.files.splice(index, 1)
    }
  },
  computed: {}
}
</script>

<style lang="scss" scoped>
.file {
  padding: 3px;
  &-remove {
    color: #ff0000;
    padding: 0 5px;
    border-radius: 10px;
    cursor: pointer;
  }
}
</style>
