<template>
  <Modal :isOpen="model" @onSubmit="submit">
    <div slot="content" class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <div class="list_header">
            <div class="flex">
              <div>
                <span>Принять заявку к исполнению</span>
              </div>
              <div class="buttons">
                <button type="button" class="button-top close close-add-class" @click="close"></button>
              </div>
            </div>
          </div>
        </div>
        <div class="profile full modal-body">
          <div :class="['form-group']">
            <label>Комментарий</label>
            <textarea name="comment" v-model="model.comment"></textarea>
          </div>
          <div class="select-file">
            <file-upload
              class="btn btn-default"
              :multiple="true"
              v-model="model.files"
              ref="upload">
              Прикрепить файлы
            </file-upload>
            <ul style="list-style: none; padding: 0;">
              <li v-for="(file, index) in model.files" :key="index">
                <span class="file-remove" @click="removeFile(index)">x</span>
                <span>{{file.name}}</span> -
                <span>{{Math.ceil(file.size / 1024)}} КБ</span>
              </li>
            </ul>
          </div>
          <div class="progress-barr" v-if="$store.getters['app/progress'] !== 100 && $store.getters['app/progress'] !== 0">
            <div class="progress-bar--status" :style="{ width: `${$store.getters['app/progress']}%` }"></div>
          </div>
          <div class="flex center">
            <button class="add-button auto-width form-submit">Отправить</button>
          </div>
        </div>
      </div>
    </div>
  </Modal>
</template>

<script>
import Modal from '@/Modal'
import FileUpload from 'vue-upload-component'

export default {
  name: 'modal-accept-custom-bid',
  components: {
    Modal,
    FileUpload
  },
  props: ['model', 'onSubmit', 'onClose'],
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
    removeFile (index) {
      this.model.files.splice(index, 1)
    },
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
