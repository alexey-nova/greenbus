<template>
  <Modal :isOpen="model" @onSubmit="submit" type="lg">
    <div class="modal-dialog" slot="content">
      <div class="modal-content">
        <div class="modal-header">
          <div class="list_header">
            <div class="flex">
              <span>Создать задачу</span>
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
              <div :class="['form-group', {'has-error': errors.has('urgency')}]">
                <label for="field-urgency">Важно</label>
                <el-switch id="field-urgency" v-validate="'required'" name="urgency" v-model="model.urgency"></el-switch>
                <span v-show="errors.has('urgency')" class="help-block">{{ errors.first('urgency') }}</span>
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
                  v-model="model.coExecutives"
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
                  :monday-first="true"
                  :disabled="datepickerState.disabled"
                  :highlighted="datepickerState.highlighted"
                  name="deadline"
                  v-validate="'required'"
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
        }
      }
    },
    props: ['model', 'users', 'onSubmit', 'onClose'],
    computed: {
      usersForSelect () {
        return this.$props.users.filter(user => {
          return (!user.admin || user.login !== 'admin') && user._id !== this.$auth().user._id
        }).map(user => {
          return {name: user.fullname, _id:user._id}
        })
      },
      selectedUser: {
        get: function () {
          return {name: this.getUser(this.$props.model.to).fullname, _id: this.$props.model.to}
        },
        set: function (newValue) {
          this.errors.items = this.$_.reject(this.errors.items, e => e.field === 'to')
          this.$props.model.to = newValue ? newValue._id : ''
        }
      }
    },
    methods: {
      close () {
        this.$emit('onClose')
      },
      getUser (_id) {
        let user = this.$_.find(this.$props.users, u => u._id === _id)
        return user ? user : {}
      },
      removeFile (index) {
        this.model.files.splice(index, 1)
      },
      submit () {
        if (!this.model.to) {
          this.errors.items.push({
            id: '100',
            field: 'to',
            scope: null,
            msg: 'Поле Кому обязательно для заполнения',
          })
        }
        this.$validator.validateAll().then(() => {
          if (!this.$_.size(this.errors.items)) {
            this.$emit('onSubmit', this.model)
          }
        }).catch(() => {})
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
