<template>
  <Modal :isOpen="model" @onSubmit="submit" type="lg">
    <div class="modal-dialog" slot="content">
      <div class="modal-content">
        <div class="modal-header">
          <div class="list_header">
            <div class="flex">
              <span>Редактировать задачу</span>
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
              <div :class="['form-group', {'has-error': errors.has('description')}]">
                <label for="field-description">Описание *</label>
                <ckeditor
                  id="field-description"
                  v-model="model.description"
                  v-validate="'required'"
                  :config="ckEditorConfig">
                </ckeditor>
                <span v-show="errors.has('description')" class="help-block">{{ errors.first('description') }}</span>
              </div>
            </div>
            <div class="form-item">
              <div :class="['form-group', {'has-error': errors.has('to')}]">
                <label for="field-to">Ответственный *</label>
                <Multiselect
                  id="field-to"
                  name="to"
                  v-validate="'required'"
                  v-model="selectedUser"
                  :options="usersForSelect"
                  track-by="name"
                  label="name"
                  placeholder="Выберите">
                </Multiselect>
                <span v-show="errors.has('to')" class="help-block">{{ errors.first('to') }}</span>
              </div>
              <div :class="['form-group', {'has-error': errors.has('coExecutives')}]">
                <label for="field-to">Соисполнители</label>
                <Multiselect
                  id="field-coExecutives"
                  name="coExecutives"
                  v-model="selectedUsers"
                  :options="usersForSelect"
                  :close-on-select="false"
                  :hide-selected="true"
                  :clear-on-select="false"
                  :multiple="true"
                  track-by="name"
                  label="name"
                  placeholder="Выберите">
                </Multiselect>
                <span v-show="errors.has('coExecutives')" class="help-block">{{ errors.first('coExecutives') }}</span>
              </div>
              <div class="sm-margin"></div>
              <div :class="['form-group', {'has-error': errors.has('deadline')}]">
                <label>Срок сдачи *</label>
                <Datepicker
                  language="ru"
                  name="deadline"
                  :monday-first="true"
                  :disabled="datepickerState.disabled"
                  :highlighted="datepickerState.highlighted"
                  v-validate="'required'"
                  v-model="model.deadline">
                </Datepicker>
                <span v-show="errors.has('deadline')" class="help-block">{{ errors.first('deadline') }}</span>
              </div>
              <div class="flex align-end column m-center m-align">
                <div class="select-file">
                  <div :class="['form-group', {'has-error': errors.has('urgency')}]">
                    <label for="field-urgency">Важно</label>
                    <el-switch id="field-urgency" v-validate="'required'" name="urgency" v-model="model.urgency"></el-switch>
                    <span v-show="errors.has('urgency')" class="help-block">{{ errors.first('urgency') }}</span>
                  </div>
                  <file-upload
                    class="btn btn-default"
                    :multiple="true"
                    v-model="model.files"
                    ref="upload">
                    Прикрепить файлы
                  </file-upload>
                  <ul style="list-style: none; padding: 0;">
                    <li v-for="(file, index) in model.files" :key="index" class="file">
                      <span class="file-remove" @click="removeFile('files', index)">x</span>
                      <span>{{file.name}}</span>
                    </li>
                    <li v-for="(file, index) in newFiles" :key="index" class="file">
                      <span class="file-remove" @click="removeFile('newFiles', index)">x</span>
                      <span>{{file.name}}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <div class="flex center">
            <button type="submit" class="save pad2">Сохранить</button>
          </div>
        </div>
      </div>
    </div>
  </Modal>
</template>

<script>
import Modal from '@/Modal'
import Datepicker from 'vuejs-datepicker'
import { Switch } from 'element-ui'
import Multiselect from 'vue-multiselect'
import FileUpload from 'vue-upload-component'
import Ckeditor from 'vue-ckeditor2'

export default {
  components: {
    Modal,
    Datepicker,
    'el-switch': Switch,
    Multiselect,
    FileUpload,
    Ckeditor
  },
  props: ['model', 'users', 'onSubmit', 'onClose'],
  data () {
    return {
      ckEditorConfig: {
        toolbar: [
          [ 'Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript' ]
        ],
        height: 150
      },
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
  computed: {
    usersForSelect () {
      return this.$_.map(this.$props.users, u => {
        return {name: u.fullname, _id: u._id}
      })
    },
    selectedUser: {
      get: function () {
        if (this.$props.model.to) return { name: this.getUser(this.$props.model.to.user).fullname, _id: this.$props.model.to}
        return {}
      },
      set: function (newValue) {
        this.errors.items = this.$_.reject(this.errors.items, e => e.field === 'to')
        this.$props.model.to = newValue ? newValue._id : ''
      }
    },
    selectedUsers: {
      get: function () {
        if (this.$_.size(this.$props.model.coExecutives) > 10) {
          this.errors.items.push({
            field: 'participants',
            scope: null,
            msg: 'Допустимо не больше 10 участников'
          })
        }
        return this.$_.map(this.$props.model.coExecutives, m => {
          return (m && m.user) ? {name: this.getUser(m.user).fullname, _id: m.user} : {}
        })
      },
      set: function (newValue) {
        this.$props.model.coExecutives = this.$_.map(newValue, m => {
          return {_id: m._id, user: m._id, name: this.getUser(m._id).fullname}
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
    removeFile (target, index) {
      if (target === 'files') {
        this.model[target].splice(index, 1)
      } else if (target === 'newFiles') {
        this.newFiles.splice(index, 1)
      } else {

      }
    },
    submit () {
      if (!this.model.to) {
        this.errors.items.push({
          id: '100',
          field: 'to',
          scope: null,
          msg: 'Поле Кому обязательно для заполнения'
        })
      }
      this.model.coExecutives = this.selectedUsers
      this.model.newFiles = this.newFiles
      this.$validator.validateAll().then(() => {
        if (!this.$_.size(this.errors.items)) {
          this.$emit('onSubmit', this.model)
        }
      }).catch(() => {
      })
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
