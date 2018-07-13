<template>
  <Modal :isOpen="model" @onSubmit="submit">
    <div slot="content" class="modal-dialog small2">
      <div class="modal-content">
        <div class="modal-header">
          <div class="list_header">
            <div class="flex">
              <div>
                <span>{{ setTypeName }}</span>
              </div>
              <div class="buttons">
                <button type="button" class="button-top close close-add-class" @click="close"></button>
              </div>
            </div>
          </div>
        </div>
        <div class="profile full modal-body">
          <div>
            <label>Комментарий</label>
            <textarea v-model="model.comment"></textarea>
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
                <span>{{file.name}}</span> -
                <span>{{Math.ceil(file.size / 1024)}} КБ</span>
              </li>
            </ul>
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
    components: {
      Modal,
      FileUpload,
    },
    props: ['model', 'onSubmit', 'onClose'],
    computed: {
      setTypeName () {
        return this.model.type === 'confirm' ? 'Согласовать задачу' : this.model.type === 'reject' ? 'Отклонить задачу на шаг' : 'Отклонить задачу до заявителя'
      }
    },
    methods: {
      close () {
        this.$emit('onClose')
      },
      submit () {
        this.$emit('onSubmit', this.$props.model)
      },
      addFiles (e) {
        let files = e.target.files || e.dataTransfer.files
        if (!files.length) return

        this.$props.model.files = files
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>