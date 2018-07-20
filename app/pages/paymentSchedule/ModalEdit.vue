<template>
  <Modal :isOpen="model" type="lg" @onSubmit="submit">

    <h3 slot="header" class="modal-title">Изменить платежный календарь</h3>

    <div slot="content" class="row">
      <div class="col-lg-6">
        <div :class="['form-group', {'has-error': errors.has('provider')}]">
          <label for="field-name">Наименование поставщика *</label>
          <input id="field-name" class="form-control" v-validate="'required'" name="name" v-model="model.provider">
          <span v-show="errors.has('provider')" class="help-block">{{ errors.first('provider') }}</span>
        </div>
        <div :class="['form-group', {'has-error': errors.has('contractNo')}]">
          <label for="field-name">Контракт/Дата *</label>
          <input id="field-name" class="form-control" v-validate="'required'" name="name" v-model="model.contractNo">
          <span v-show="errors.has('contractNo')" class="help-block">{{ errors.first('contractNo') }}</span>
        </div>
        <div :class="['form-group', {'has-error': errors.has('description')}]">
          <label for="field-name">Описание услуг *</label>
          <input id="field-name" class="form-control" v-validate="'required'" name="name" v-model="model.description">
          <span v-show="errors.has('description')" class="help-block">{{ errors.first('description') }}</span>
        </div>
        <div :class="['form-group', {'has-error': errors.has('totalAmount')}]">
          <label for="field-name">Общая сумма контракта/инвойса *</label>
          <input id="field-name" class="form-control" v-validate="'required'" name="name" v-model="totalAmount">
          <span v-show="errors.has('totalAmount')" class="help-block">{{ errors.first('totalAmount') }}</span>
        </div>
        <div :class="['form-group', {'has-error': errors.has('prepayment')}]">
          <label for="field-name">Сумма предоплаты *</label>
          <input id="field-name" class="form-control" v-validate="'required'" name="name" v-model="prepayment">
          <span v-show="errors.has('prepayment')" class="help-block">{{ errors.first('prepayment') }}</span>
        </div>
      </div>
      <div class="col-lg-6">

      </div>
      <div class="col-lg-6">
        <div :class="['form-group', {'has-error': errors.has('memoTo')}]">
          <label for="field-memoTo">Кому *</label><br />
          <Multiselect
            id="field-memoTo"
            v-model="selectedUsers"
            :options="usersForSelect"
            :close-on-select="false"
            :hide-selected="true"
            :clear-on-select="false"
            :multiple="true"
            track-by="name"
            label="name"
          >
          </Multiselect>
          <span v-show="errors.has('memoTo')" class="help-block">{{ errors.first('memoTo') }}</span>
        </div>
        <div :class="['form-group', {'has-error': errors.has('comment')}]">
          <label for="field-text">Описание *</label>
          <ckeditor
            id="field-text"
            v-model="model.comment"
            v-validate="'required'"
            :config="ckEditorConfig">
          </ckeditor>
          <span v-show="errors.has('comment')" class="help-block">{{ errors.first('comment') }}</span>
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
            <li v-for="file in model.files" :key="file.id">
              <span>{{file.name}}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div slot="footer">
      <button type="button" class="btn btn-default" data-dismiss="modal" @click="close"><i class="fa fa-times"></i>&nbsp;&nbsp;Отмена</button>
      <button type="submit" class="btn btn-success"><i class="fa fa-check"></i>&nbsp;&nbsp;Применить</button>
    </div>

  </Modal>
</template>

<script>
import 'element-ui/lib/theme-chalk/index.css'
import Modal from '@/Modal'
import MaskedInput from 'vue-masked-input'
import Datepicker from 'vuejs-datepicker'
import { Switch } from 'element-ui'
import Multiselect from 'vue-multiselect'
import FileUpload from 'vue-upload-component'
import Ckeditor from 'vue-ckeditor2'

export default {
  components: {
    Modal,
    MaskedInput,
    Datepicker,
    'el-switch': Switch,
    Multiselect,
    FileUpload,
    Ckeditor
  },
  data () {
    return {
      to: null,
      prepayment: '',
      totalAmount: '',
      ckEditorConfig: {
        toolbar: [
          [ 'Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript' ]
        ],
        height: 150
      }
    }
  },
  props: ['model', 'users', 'onSubmit', 'onClose'],
  watch: {
    prepayment (value) {
      value = value.replace(/(\s|\D)/g, '')
      this.prepayment = value.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ')
    },
    totalAmount (value) {
      value = value.replace(/(\s|\D)/g, '')
      this.totalAmount = value.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ')
    }
  },
  mounted () {
    this.prepayment = this.model.prepayment || ''
    this.totalAmount = this.model.totalAmount || ''
  },
  methods: {
    close () {
      this.$emit('onClose')
    },
    submit () {
      this.model.prepayment = this.prepayment.replace(/\s/g, '')
      this.model.totalAmount = this.totalAmount.replace(/\s/g, '')
      this.$validator.validateAll().then(() => {
        if (!this.$_.size(this.errors.items)) {
          let model = this.$_.clone(this.$props.model)
          model.to = this.$_.map(model.to, u => u.user)
          this.$emit('onSubmit', model)
        }
      }).catch(() => {
      })
    },
    getUser (_id) {
      let user = this.$_.find(this.$props.users, u => u._id === _id)
      return user || {}
    },
    addFiles (e) {
      let files = e.target.files || e.dataTransfer.files
      if (!files.length) return

      this.$props.model.files = files
    }
  },
  computed: {
    usersForSelect () {
      return this.$_.map(this.$props.users, u => {
        return {name: u.fullname, _id: u._id}
      })
    },
    selectedUsers: {
      get: function () {
        if (this.$_.size(this.$props.model.to) > 10) {
          this.errors.items.push({
            field: 'memoTo',
            scope: null,
            msg: 'Допустимо не больше 10 согласующих'
          })
        }
        return this.$_.map(this.$props.model.to, m => {
          return m ? {name: this.getUser(m.user).fullname, _id: m.user} : {}
        })
      },
      set: function (newValue) {
        this.errors.items = this.$_.reject(this.errors.items, e => e.field === 'memoTo')
        this.$props.model.to = this.$_.map(newValue, m => {
          return {user: m._id}
        })
      }
    }
  }
}
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style lang="scss" scoped>

</style>
