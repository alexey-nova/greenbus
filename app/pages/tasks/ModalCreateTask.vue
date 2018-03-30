<template>
  <Modal :isOpen="model" @onSubmit="submit" type="lg">

    <h3 slot="header" class="modal-title">Создать задачу</h3>

    <div slot="content" class="row">

      <div class="col-lg-6">
        <div :class="['form-group', {'has-error': errors.has('name')}]">
          <label for="field-name">Название *</label>
          <input id="field-name" class="form-control" v-validate="'required'" name="name" v-model="model.name" />
          <span v-show="errors.has('name')" class="help-block">{{ errors.first('name') }}</span>
        </div>
        <div :class="['form-group', {'has-error': errors.has('description')}]">
          <label for="field-description">Описание *</label>
          <textarea id="field-description" class="form-control" rows="4" v-validate="'required'" name="description" type="password" v-model="model.description"></textarea>
          <span v-show="errors.has('description')" class="help-block">{{ errors.first('description') }}</span>
        </div>
        <div :class="['form-group', {'has-error': errors.has('urgency')}]">
          <label for="field-urgency">Важно</label>
          <el-switch id="field-urgency" v-validate="'required'" name="urgency" v-model="model.urgency"></el-switch>
          <span v-show="errors.has('urgency')" class="help-block">{{ errors.first('urgency') }}</span>
        </div>
      </div>
      <div class="col-lg-6">
        <div :class="['form-group', {'has-error': errors.has('to')}]">
          <label for="field-to">Ответственный *</label>
          <Multiselect
            id="field-to"
            name="to"
            v-validate="'required'"
            v-model="selectedUser"
            :options="usersForSelect"
            track-by="name"
            label="name">
          </Multiselect>
          <span v-show="errors.has('to')" class="help-block">{{ errors.first('to') }}</span>
        </div>
        <div :class="['form-group', {'has-error': errors.has('coExecutives')}]">
          <label for="field-to">Соисполнители *</label>
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
            label="name">
          </Multiselect>
          <span v-show="errors.has('coExecutives')" class="help-block">{{ errors.first('coExecutives') }}</span>
        </div>
        <div :class="['form-group', {'has-error': errors.has('deadline')}]">
          <label>Срок сдачи *</label>
          <Datepicker input-class="form-control" language="ru" name="deadline" v-validate="'required'" v-model="model.deadline"></Datepicker>
          <span v-show="errors.has('deadline')" class="help-block">{{ errors.first('deadline') }}</span>
        </div>
        <div class="form-group">
          <label class="custom-file-label">Прикрепить файлы</label>
          <br />
          <file-upload
            class="btn btn-default"
            :multiple="true"
            v-model="model.files"
            ref="upload">
            <i class="fa fa-plus"></i>
            Выбрать файлы
          </file-upload>
          <ul style="list-style: none; padding: 0;">
            <li v-for="(file, index) in model.files" :key="index">
              <span>{{file.name}}</span> -
              <span>{{Math.ceil(file.size / 1024)}} КБ</span>
            </li>
          </ul>
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
  import Modal from '@/Modal'
  import Datepicker from 'vuejs-datepicker'
  import { Switch } from 'element-ui'
  import Multiselect from 'vue-multiselect'
  import FileUpload from 'vue-upload-component'

  export default {
    components: {
      Modal,
      Datepicker,
      'el-switch': Switch,
      Multiselect,
      FileUpload,
    },
    data () {
      return {
        dropzoneOptions: {
          url: 'https://httpbin.org/post',
          thumbnailWidth: 150,
        }
      }
    },
    props: ['model', 'users', 'onSubmit', 'onClose'],
    computed: {
      usersForSelect () {
        return this.$props.users.filter(user => {
          return (!user.admin && user.login !== 'admin') && user._id !== this.$auth().user._id
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

</style>