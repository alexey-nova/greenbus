<template>
  <Modal :isOpen="model" type="lg" @onSubmit="submit">
    <div class="modal-dialog big" slot="content">
      <div class="modal-content">
        <div class="modal-header">
          <div class="list_header">
            <div class="flex">
              <div>Редактировать заявку</div>
              <div class="buttons">
                <button class="button-top close" @click="close" type="button"></button>
              </div>
            </div>
          </div>
        </div>
        <div class="active-categories">
          <div class="profile full modal-body">
            <div class="flex">
              <!-- <span>Выбранный шаблон: <span>{{model.template.name}}</span></span> -->
            </div>
            <div class="flex column">
              <div class="form-item">
                <div :class="['form-group', {'has-error': errors.has('name')}]">
                  <label for="field-name">Тема *</label>
                  <input id="field-name" v-validate="'required'" name="name" v-model="model.name" />
                  <span v-show="errors.has('name')" class="help-block">{{ errors.first('name') }}</span>
                </div>
                <div class="select-file form-group">
                  <file-upload
                    class="btn btn-default"
                    :multiple="true"
                    v-model="model.files"
                    ref="upload">
                    Прикрепить файлы
                  </file-upload>
                  <ul style="list-style: none; padding: 0;">
                    <li v-for="(file, index) in newFiles" :key="index" class="file">
                      <span class="file-remove" @click="removeFile('newFiles', index)">x</span>
                      <span>{{file.name}}</span>
                    </li>
                  </ul>
                  <ul style="list-style: none; padding: 0;">
                    <li v-for="(file, index) in model.files" :key="index" class="file">
                      <span class="file-remove" @click="removeFile('files', index)">x</span>
                      <span>{{file.name}}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div :class="['form-group']">
              <label for="field-description">Описание</label>
              <ckeditor
                id="field-description"
                v-model="model.description"
                :config="ckEditorConfig">
              </ckeditor>
            </div>
          </div>
          <div class="modal-footer">
            <div class="progress-barr" v-if="$store.getters['app/progress'] !== 100 && $store.getters['app/progress'] !== 0">
              <div class="progress-bar--status" :style="{ width: `${$store.getters['app/progress']}%` }"></div>
            </div>
            <div class="flex center">
              <button class="add-button auto-width send">Сохранить изменения <img src="~assets/img/left.png"></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Modal>
</template>

<script>
import Modal from '@/Modal'
import Ckeditor from 'vue-ckeditor2'
import FileUpload from 'vue-upload-component'

export default {
  components: {
    Modal,
    Ckeditor,
    FileUpload
  },
  data () {
    return {
      ckEditorConfig: {
        toolbar: [
          ['Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript']
        ],
        height: 150
      },
      newFiles: []
    }
  },
  props: ['model', 'users', 'onSubmit', 'onClose'],
  computed: {
  },
  methods: {
    close () {
      this.$emit('onClose')
    },
    submit () {
      this.$validator.validateAll().then(() => {
        if (!this.$_.size(this.errors.items)) {
          let model = this.$_.clone(this.$props.model)
          model.newFiles = this.newFiles
          this.$emit('onSubmit', model)
        }
      }).catch(() => {
      })
    },
    addFiles (e) {
      let files = e.target.files || e.dataTransfer.files
      if (!files.length) return
      this.$props.model.files = files
    },
    removeFile (target, index) {
      if (target === 'files') {
        this.model[target].splice(index, 1)
      } else if (target === 'newFiles') {
        this.newFiles.splice(index, 1)
      } else {

      }
    }
  },
  mounted () {
    this.newFiles = this.$_.clone(this.model.files)
    this.model.files = []
  }
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
