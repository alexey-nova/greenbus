<template>
<div class="working_area">
  <div class="white-block no padding">
    <div class="flex margin-bottom align-center">
      <p class="title">Категории шаблонов</p>
      <div class="add" v-if="$auth().hasRole('admin')">
        <button v-if="$route.name === 'templatesByFilter'" class="add-button" @click="toggleModal('createTemplate', { category: activeCategory })">Добавить шаблон</button>
        <button class="add-button" @click="toggleModal('create', {})"><img src="~assets/img/add.png">Добавить категорию</button>
      </div>
    </div>
    <div class="active-categories active show2">
      <div class="profile full modal-body no-padding">
        <div class="cat-box">
          <div class="white-menu top">
            <div class="white-menu-box">
              <a v-if="$route.name === 'templatesByFilter'" @click="goBack()">
                <button class="add-button auto-width back"><img src="~assets/img/left.png"><span>Назад</span></button>
              </a>
              <a @click="openCategory(category)" class="folders-item categories" v-for="category in categories" :key="category._id">
                <div class="folder-border">
                  <div class="white-menu-img"></div>
                  <span>{{category.name}}</span>
                </div>
                <div class="folder-buttons">
                  <button class="button-table edit" @click.stop="toggleModal('edit', $_.clone(category))"></button>
                  <button class="button-table remove" @click.stop="toggleModal('remove', category)"></button>
                </div>
              </a>
              <div v-for="template in templates" :key="template._id" class="folders-item fol-box" @click="toggleModal('showTemplate', template)">
                <span target="_blank" class="folder-border">
                  <div :class="['folder-img sm-img']">
                    <img src="~assets/img/file.png">
                  </div>
                  <div class="folder-text">
                    <span>{{ template.name }}</span>
                  </div>
                </span>
                <div class="folder-buttons">
                  <button type="button" class="button-table remove" @click.stop="toggleModal('deleteTemplate', template)" style="top: -0.1em"></button>
                  <button type="button" class="button-table edit" @click.stop="toggleModal('editTemplate', $_.clone(template))"></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="white-block">
    <div class="row">
      <div class="col-md-6">
        <div :class="['form-group']">
        <label for="field-users">Сотрудники с доступом для excel</label><br />
        <Multiselect
          id="field-users"
          v-model="selectedUsers"
          :options="users"
          placeholder="Выберите сотрудников"
          :close-on-select="false"
          :hide-selected="true"
          :clear-on-select="true"
          :multiple="true"
          track-by="fullname"
          label="fullname">
        </Multiselect>
      </div>
      <div class="form-group">
        <button class="add-button" @click="addExcelUsers()">Применить</button>
      </div>
      </div>
    </div>
  </div>
  <ModalCreate :model="modal.create" @onClose="toggleModal('create')" @onSubmit="addCategory"></ModalCreate>
  <modal-edit-category v-if="modal.edit" :model="modal.edit" @onClose="toggleModal('edit')" @onSubmit="editCategory"></modal-edit-category>
  <modal-remove-category v-if="modal.remove" :model="modal.remove" @onClose="toggleModal('remove')" @onSubmit="removeCategory"></modal-remove-category>
  <ModalCreateTemplate v-if="modal.createTemplate" :model="modal.createTemplate" @onClose="toggleModal('createTemplate')" @onSubmit="createTemplate"></ModalCreateTemplate>
  <ModalShowTemplate v-if="modal.showTemplate" :model="modal.showTemplate" @onClose="toggleModal('showTemplate')"></ModalShowTemplate>
  <ModalEditTemplate v-if="modal.editTemplate" :model="modal.editTemplate" @onClose="toggleModal('editTemplate')" @onSubmit="editTemplate"></ModalEditTemplate>
  <ModalDeleteTemplate v-if="modal.deleteTemplate" :model="modal.deleteTemplate" @onClose="toggleModal('deleteTemplate')" @onSubmit="deleteTemplate"></ModalDeleteTemplate>
</div>
</template>

<script>
import ModalCreate from './templates/ModalCreate'
import ModalEditCategory from './templates/ModalEdit'
import ModalRemoveCategory from './templates/ModalRemove'
import ModalCreateTemplate from './templates/ModalCreateTemplate'
import ModalShowTemplate from './templates/ModalShowTemplate'
import ModalEditTemplate from './templates/ModalEditTemplate'
import ModalDeleteTemplate from './templates/ModalDeleteTemplate'
import Multiselect from 'vue-multiselect'

export default {
  name: 'Template',
  components: {
    ModalCreate,
    ModalEditCategory,
    ModalRemoveCategory,
    ModalCreateTemplate,
    ModalShowTemplate,
    ModalEditTemplate,
    ModalDeleteTemplate,
    Multiselect
  },
  data () {
    return {
      categories: [],
      activeCategory: null,
      templates: [],
      users: [],
      selectedUsers: [],
      modal: {
        create: false,
        edit: false,
        remove: false,
        createTemplate: false,
        showTemplate: false,
        editTemplate: false,
        deleteTemplate: false
      }
    }
  },
  methods: {
    toggleModal (name, model, tab) {
      this.modal[name] = model === undefined ? !this.modal[name] : model
      this.modal.tab = tab || 0
    },
    goBack () {
      this.$router.back()
      this.getCategoryById(this.$router.currentRoute.params.parentId)
    },
    getCategories () {
      const filter = this.$route.name === 'templatesByFilter' ? `?parentId=${this.$route.params.parentId}` : ''
      return this.$api('get', `bids/categories${filter}`).then(response => {
        this.categories = response.data.categories
      })
    },
    getCategoryById (categoryId) {
      return this.$api('get', `bids/categories/${categoryId}`).then(response => {
        this.activeCategory = response.data.category
      })
    },
    addCategory (data) {
      if (this.$route.name === 'templatesByFilter') data.parent = this.$route.params.parentId
      this.$api('post', 'bids/categories', data).then(response => {
        this.modal.create = false
        this.categories.push(response.data.category)
      })
    },
    editCategory (data) {
      if (!data.name) return
      this.$api('put', `bids/categories/${data._id}`, data).then(response => {
        this.modal.edit = false
        this.categories.find(item => item._id === data._id).name = data.name
      })
    },
    removeCategory (data) {
      this.$api('delete', `bids/categories/${data._id}`).then(response => {
        this.modal.remove = false
        this.categories = this.categories.filter(item => item._id !== data._id)
        this.notify(response.data.message)
      })
    },
    openCategory (category) {
      this.activeCategory = category
      this.$router.push({ name: 'templatesByFilter', params: { parentId: category._id }})
    },
    loadTemplates (category) {
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
      this.$api('put', `bids/templates/${data._id}`, data).then(response => {
        this.modal.editTemplate = false
        this.notify(response.data.message)
        this.loadTemplates(this.activeCategory)
      })
    },
    deleteTemplate (data) {
      this.$api('delete', `bids/templates/${data._id}`).then(response => {
        this.templates = this.templates.filter(item => item._id !== data._id)
        this.modal.deleteTemplate = false
      })
    },
    loadUsers () {
      return this.$api('get', 'users').then(response => {
        this.users = response.data
        this.selectedUsers = response.data.filter(item => item.priveleges && item.priveleges.includes('excel'))
      }).catch(e => {
        this.notify(e.message, 'danger')
      })
    },
    addExcelUsers () {
      this.$api('post', 'users/excel', { users: this.selectedUsers.map(item => item._id) }).then(response => {
        this.notify(response.data.message)
      })
    }
  },
  mounted () {
    this.getCategories()
    this.loadUsers()
    if (this.$route.name === 'templatesByFilter') {
      this.getCategoryById(this.$route.params.parentId).then(() => {
        this.loadTemplates(this.activeCategory)
      })

    }
  },
  watch: {
    '$route' (to, from) {
      this.getCategories()
      this.templates = []
      if (this.$route.name === 'templatesByFilter') {
        this.getCategoryById(this.$route.params.parentId).then(() => {
          this.loadTemplates(this.activeCategory)
        })

      }
    }
  },
}
</script>

<style scoped>
.folders-item {
  font-size: 1em;
}

a.categories {
  width: 10%;
}
</style>
