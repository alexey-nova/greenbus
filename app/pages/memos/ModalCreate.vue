<template>
  <Modal :isOpen="model" type="lg" @onSubmit="submit">
    <div class="modal-dialog big" slot="content">
      <div class="modal-content">
        <div class="modal-header">
          <div class="list_header">
            <div class="flex">
              <div>Создать новую заявку</div>
              <div class="buttons">
                <button class="button-top close" @click="close" type="button"></button>
              </div>
            </div>
          </div>
        </div>
        <div v-if="step === 0" :class="['active-categories']">
          <div class="profile full modal-body">
            <div class="cat-box">
              <div class="white-menu top">
                <div class="white-menu-box">
                  <div v-if="activeCategory">
                    <button type="button" class="add-button auto-width back" @click="goBack()"><img src="~assets/img/left.png"><span>Назад</span></button>
                  </div>
                  <a class="folders-item categories" v-for="category in categories" :key="category._id" @click="openCategory(category)">
                    <div class="folder-border">
                      <div class="white-menu-img"></div>
                      <span>{{category.name}}</span>
                    </div>
                  </a>
                  <div v-for="template in templates" :key="template._id" class="folders-item fol-box" @click="chooseTemplate(template)">
                    <span class="folder-border">
                      <div :class="['folder-img sm-img']">
                        <img src="~assets/img/file.png">
                      </div>
                      <div class="folder-text">
                        <span>{{ template.name }}</span>
                      </div>
                    </span>
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
            <div class="progress-barr" v-if="$store.getters['app/progress'] !== 100 && $store.getters['app/progress'] !== 0">
              <div class="progress-bar--status" :style="{ width: `${$store.getters['app/progress']}%` }"></div>
            </div>
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
    goBack () {
      if (this.activeCategory.parent) {
        this.getCategoryById(this.activeCategory.parent).then(() => {
          this.loadCategories(this.activeCategory)
          this.loadTemplates(this.activeCategory._id)
        })
      } else {
        this.templates = []
        this.activeCategory = null
        this.loadCategories()
      }
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
    loadCategories (category) {
      const filter = category ? `?parentId=${category._id}` : ''
      this.$api('get', `bids/categories${filter}`).then(response => {
        this.categories = response.data.categories
      }).catch(e => {
        console.log('categories error', e.response)
      })
    },
    getCategoryById (categoryId) {
      return this.$api('get', `bids/categories/${categoryId}`).then(response => {
        this.activeCategory = response.data.category
      })
    },
    openCategory (category) {
      this.activeCategory = category
      this.loadCategories(category)
      this.loadTemplates(category._id)
    },
    loadTemplates (categoryId) {
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
        item.user = this.users.find(u => u.position === item.position)
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
