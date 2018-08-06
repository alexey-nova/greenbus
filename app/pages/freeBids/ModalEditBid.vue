<template>
  <Modal :isOpen="model" @onSubmit="submit" type="lg">
    <div class="modal-dialog" slot="content">
      <div class="modal-content">
        <div class="modal-header">
          <div class="list_header">
            <div class="flex">
              <span>Редактировать заявку свободной формы</span>
              <div class="buttons">
                <button class="button-top close" type="button" @click="close"></button>
              </div>
            </div>
          </div>
        </div>
        <div class="profile full modal-body">
          <div class="flex column">
            <div class="form-item">
              <div :class="['form-group', {'has-error': errors.has('name')}]">
                <label for="field-name">Тема *</label>
                <input id="field-name" v-validate="'required'" name="name" v-model="model.name" />
                <span v-show="errors.has('name')" class="help-block">{{ errors.first('name') }}</span>
              </div>
              <div :class="['form-group']">
                <label for="field-description">Описание</label>
                <ckeditor
                  id="field-description"
                  v-model="model.description"
                  :config="$ckEditorConfig">
                </ckeditor>
              </div>
            </div>
            <div class="form-item">
              <div :class="['form-group', {'has-error': errors.has('to')}]">
                <label for="field-to">Исполнители *</label>
                <Multiselect
                  id="field-to"
                  name="to"
                  :multiple="true"
                  v-model="selectedUsers"
                  :options="usersForSelect"
                  :close-on-select="false"
                  :show-labels="false"
                  :hide-selected="true"
                  track-by="name"
                  label="name"
                  placeholder="Выберите">
                </Multiselect>
                <span v-show="errors.has('to')" class="help-block">{{ errors.first('to') }}</span>
              </div>
              <div class="sm-margin"></div>
              <div :class="['form-group', {'has-error': errors.has('deadline')}]">
                <label>Срок сдачи *</label>
                <Datepicker
                  language="ru"
                  :monday-first="true"
                  :disabled="datepickerState.disabled"
                  :highlighted="datepickerState.highlighted"
                  name="deadline"
                  v-model="model.deadline">
                </Datepicker>
                <span v-show="errors.has('deadline')" class="help-block">{{ errors.first('deadline') }}</span>
              </div>
              <div class="flex align-end column m-center m-align">
                <div class="select-file">
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
                    <li v-for="(file, index) in model.files" :key="index">
                      <span class="file-remove" @click="removeFile(index)">x</span>
                      <span>{{file.name}}</span> -
                      <span>{{Math.ceil(file.size / 1024)}} КБ</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <div class="progress-barr" v-if="$store.getters['app/progress'] !== 100 && $store.getters['app/progress'] !== 0">
            <div class="progress-bar--status" :style="{ width: `${$store.getters['app/progress']}%` }"></div>
          </div>
          <div class="flex center">
            <button type="submit" class="save pad2">Редактировать</button>
          </div>
        </div>
      </div>
    </div>
  </Modal>
</template>

<script>
import Modal from '@/Modal'
import Datepicker from 'vuejs-datepicker'
import Multiselect from 'vue-multiselect'
import FileUpload from 'vue-upload-component'
import Ckeditor from 'vue-ckeditor2'

export default {
  name: 'modal-edit-custom-bid',
  components: {
    Modal,
    Datepicker,
    Multiselect,
    FileUpload,
    Ckeditor
  },
  data () {
    return {
      datepickerState: {
        disabled: {
          to: new Date((new Date()).setDate((new Date()).getDate() - 1))
        },
        highlighted: {
          dates: [ new Date() ]
        }
      },
      newFiles: []
    }
  },
  props: ['model', 'users', 'onSubmit', 'onClose'],
  computed: {
    usersForSelect () {
      return this.$props.users.filter(user => {
        return (!user.admin || user.login !== 'admin') && user._id !== this.$auth().user._id
      }).map(user => {
        return { name: user.fullname, _id: user._id }
      })
    },
    selectedUsers: {
      get: function () {
        return this.model.to.map(item => {
          return {
            _id: item.user,
            name: this.getUser(item.user).fullname
          }
        })
      },
      set: function (newVal) {
        this.model.to = newVal.map(item => {
          return {
            _id: item._id,
            user: item._id,
            name: this.getUser(item._id).fullname
          }
        })
      }
    }
  },
  methods: {
    close () {
      this.$emit('onClose')
    },
    getUser (_id) {
      let user = this.$_.find(this.$props.users, u => u._id === _id)
      return user || {}
    },
    submit () {
      if (!this.selectedUsers) {
        this.errors.items.push({
          id: '100',
          field: 'to',
          scope: null,
          msg: 'Поле Кому обязательно для заполнения'
        })
      }
      this.model.to = this.selectedUsers
      this.$validator.validateAll().then(() => {
        if (!this.$_.size(this.errors.items)) {
          this.model.newFiles = this.newFiles
          this.$emit('onSubmit', this.model)
        }
      }).catch(() => {})
    },
    removeFile (target, index) {
      if (target === 'files') {
        this.model[target].splice(index, 1)
      } else if (target === 'newFiles') {
        this.newFiles.splice(index, 1)
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
