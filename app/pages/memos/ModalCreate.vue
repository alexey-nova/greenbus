<template>
  <Modal :isOpen="model" type="lg" @onSubmit="submit">
    <div class="modal-dialog big" slot="content">
      <div class="modal-content">
        <div class="modal-header">
          <div class="list_header">
            <div class="flex">
              <div>Создать новую служебную записку</div>
              <div class="buttons">
                <button class="button-top close" @click="close" type="button"></button>
              </div>
            </div>
          </div>
        </div>
        <div v-if="step === 0" :class="['active-categories']">
          <div class="profile full modal-body no-padding">
            <div class="cat-box">
              <div class="white-menu top">
                <div class="white-menu-box">
                  <a :class="['categories', { active: activeCategory === category._id }]" v-for="category in categories" :key="category._id" @click="loadTemplates(category._id)">
                    <div class="white-menu-img"></div>
                    <span>{{category.name}}</span>
                  </a>
                </div>
              </div>
              <div class="categories-block" id="categories-id-1">
                <div class="margin2-helper">
                  <div class="white-menu-box">
                    <a class="categories-item order" v-for="template in templates" :key="template._id" @click="chooseTemplate(template)">
                      <div class="flex flex-start">
                        <div class="categories-item-img"></div>
                        <div class="categories-item-text">
                          <span>{{template.name}}</span>
                        </div>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="step === 1" :class="['active-categories']">
          <div class="profile full modal-body">
            <memo-chain type="create" :users="users" :order="chain()" :positions="positions"></memo-chain>
            <div class="flex">
              <button class="add-button auto-width back back2" @click="step = 0" type="button"><img src="~assets/img/left.png"><span>Назад</span></button>
              <span>Выбранный шаблон: <span>{{model.template.name}}</span></span>
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
                    <li v-for="(file, index) in model.files" :key="index">
                      <span class="file-remove" @click="removeFile(index)">x</span>
                      <span>{{file.name}}</span> -
                      <span>{{Math.ceil(file.size / 1024)}} КБ</span>
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
            <div class="flex center">
              <button class="add-button auto-width send">Отправить <img src="~assets/img/left.png"></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Modal>
</template>

<script>
import 'element-ui/lib/theme-chalk/index.css'
import Modal from '@/Modal'
import FileUpload from 'vue-upload-component'
import Ckeditor from 'vue-ckeditor2'
import MemoChain from './MemoChain'

export default {
  components: {
    Modal,
    FileUpload,
    Ckeditor,
    MemoChain
  },
  props: ['model', 'onSubmit', 'onClose', 'users', 'positions'],
  data () {
    return {
      ckEditorConfig: {
        toolbar: [
          [ 'Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript' ]
        ],
        height: 150
      },
      categories: [],
      activeCategory: null,
      templates: [],
      step: 0
    }
  },
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
    },
    addFiles (e) {
      let files = e.target.files || e.dataTransfer.files
      if (!files.length) return

      this.$props.model.files = files
    },
    removeFile (index) {
      this.model.files.splice(index, 1)
    },
    loadCategories () {
      this.$api('get', 'bids/categories').then(response => {
        this.categories = response.data.categories
      }).catch(e => {
        console.log('categories error', e.response)
      })
    },
    loadTemplates (categoryId) {
      this.activeCategory = categoryId
      this.$api('get', `bids/templates/${categoryId}`).then(response => {
        this.templates = response.data.templates
      })
    },
    chooseTemplate (template) {
      this.model.template = template
      this.step = 1
    },
    chain () {
      return this.model.template.order.map(item => {
        item.user = this.users.find(u => u.positionId === item.position)
        return item
      })
    }
  },
  mounted () {
    if (this.model) {
      this.loadCategories()
    }
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
