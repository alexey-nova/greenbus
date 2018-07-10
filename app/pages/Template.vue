<template>
  <div class="working_area">
    <div class="white-block no padding">
      <div class="flex margin-bottom align-center">
        <p class="title">Категории шаблонов</p>
        <div class="add" v-if="$auth().hasRole('admin')">
          <button class="add-button" @click="toggleModal('create', {})"><img src="~assets/img/add.png">Добавить категорию</button>
        </div>
      </div>
      <div class="active-categories active show2">
        <div class="profile full modal-body no-padding">
          <div class="cat-box">
            <div class="white-menu top">
              <div class="white-menu-box">
                <a :class="['categories', { active: activeCategory && activeCategory._id === category._id }]" v-for="category in categories" :key="category._id" @click="loadTemplates(category)">
                  <div class="white-menu-img"></div>
                  <span>{{category.name}}</span>
                </a>
              </div>
            </div>
            <div class="categories-block" id="categories-id-1">
							<div class="add" v-if="$auth().hasRole('admin')">
								<button v-if="activeCategory" class="add-button" @click="toggleModal('createTemplate', { category: activeCategory })"><img src="~assets/img/add.png">Добавить шаблон</button>
							</div>
              <!-- <div class="margin2-helper">
                <div class="white-menu-box">
                  <a class="categories-item order" v-for="template in templates" :key="template._id">
                    <div class="flex flex-start" @click="toggleModal('showTemplate', template)">
                      <div class="categories-item-img"></div>
                      <div class="categories-item-text">
                        <span>{{template.name}}</span>
                      </div>
                    </div>
                    <div class="folder-buttons">
                      <button type="button" class="button-table" @click="">...</button>
                      <button type="button" class="button-table edit" @click=""></button>
                    </div>
                     <button class="button-table remove" @click="removeTemplate(template._id)"></button>
                  </a>
                </div>
              </div> -->
              <div class="">
                <div class="white-menu-box">
                  <a class="fol-box templates-item" v-if="templates" v-for="template in templates" :key="template._id">
                    <div class="folder-border" @click="toggleModal('showTemplate', template)">
                      <div class="folder-img sm-img">
                        <img src="~assets/img/file.png" class="block">
                        <img src="~assets/img/file-h.png" class="none">
                      </div>
                      <div class="folder-text">
                        <span>{{ template.name }}</span>
                      </div>
                    </div>
                    <div class="folder-buttons">
                      <button type="button" class="button-table remove" @click="toggleModal('deleteTemplate', template)"></button>
                      <button type="button" class="button-table edit" @click="toggleModal('editTemplate', template)"></button>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <ModalCreate :model="modal.create" @onClose="toggleModal('create')" @onSubmit="addCategory"></ModalCreate>
		<ModalCreateTemplate v-if="modal.createTemplate" :model="modal.createTemplate" @onClose="toggleModal('createTemplate')" @onSubmit="createTemplate"></ModalCreateTemplate>
		<ModalShowTemplate v-if="modal.showTemplate" :model="modal.showTemplate" @onClose="toggleModal('showTemplate')"></ModalShowTemplate>
		<ModalEditTemplate v-if="modal.editTemplate" :model="modal.editTemplate" @onClose="toggleModal('editTemplate')" @onSubmit="editTemplate"></ModalEditTemplate>
		<ModalDeleteTemplate v-if="modal.deleteTemplate" :model="modal.deleteTemplate" @onClose="toggleModal('deleteTemplate')" @onSubmit="deleteTemplate"></ModalDeleteTemplate>
  </div>
</template>

<script>
import ModalCreate from './templates/ModalCreate'
import ModalCreateTemplate from './templates/ModalCreateTemplate'
import ModalShowTemplate from './templates/ModalShowTemplate'
import ModalEditTemplate from './templates/ModalEditTemplate'
import ModalDeleteTemplate from './templates/ModalDeleteTemplate'

export default {
  name: 'Template',
  components: {
		ModalCreate,
		ModalCreateTemplate,
    ModalShowTemplate,
    ModalEditTemplate,
    ModalDeleteTemplate
  },
  data () {
    return {
			categories: [],
			activeCategory: null,
			templates: [],
      modal: {
        create: false,
        edit: false,
				delete: false,
				createTemplate: false,
        showTemplate: false,
        editTemplate: false,
        deleteTemplate: false
      },
    }
  },
  methods: {
    toggleModal (name, model, tab) {
      this.modal[name] = model === undefined ? !this.modal[name] : model
      this.modal.tab = tab ? tab : 0
    },
    getCategories () {
      this.$api('get', 'bids/categories').then(response => {
        this.categories = response.data.categories
      })
    },
    addCategory (data) {
      this.$api('post', 'bids/categories', data).then(response => {
        this.modal.create = false
        this.categories.push(response.data.category)
        this.notify(response.data.message)
      })
		},
		loadTemplates (category) {
        this.activeCategory = category
        this.$api('get', `bids/templates/${category._id}`).then(response => {
          this.templates = response.data.templates
        })
			},
		createTemplate (data) {
      this.$api('post', `bids/templates/`, data).then(response => {
        this.modal.createTemplate = false
        this.notify(response.data.message)
        this.templates.push(response.data.template)
      })
		},
    editTemplate (data) {
      console.log(data)
		},
    deleteTemplate (data) {
      console.log(data)
		},
    // removeTemplate (_id) {

    // }
  },
  mounted () {
    this.getCategories()
  }
}
</script>

<style scoped>

</style>
