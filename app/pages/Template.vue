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
                <a href="#" class="categories" v-for="category in categories" :key="category._id">
                  <div class="white-menu-img"></div>
                  <span>{{category.name}}</span>
                </a>
              </div>
            </div>
            <!-- <div class="categories-block" id="categories-id-1">
                <div class="margin2-helper">
                    <div class="white-menu-box">
                        <a href="#" class="categories-item order" data-order="1">
                            <div class="flex flex-start">
                                <div class="categories-item-img"></div>
                                <div class="categories-item-text">
                                    <span>Название шаблона</span>
                                    <p>заявки</p>
                                </div>
                            </div>
                            <button class="button-table edit"></button>
                        </a>
                        <a href="#" class="categories-item order" data-order="1">
                            <div class="flex flex-start">
                                <div class="categories-item-img"></div>
                                <div class="categories-item-text">
                                    <span>Название шаблона</span>
                                    <p>заявки</p>
                                </div>
                            </div>
                            <button class="button-table edit"></button>
                        </a>
                        <a href="#" class="categories-item order" data-order="1">
                            <div class="flex flex-start">
                                <div class="categories-item-img"></div>
                                <div class="categories-item-text">
                                    <span>Название шаблона</span>
                                    <p>заявки</p>
                                </div>
                            </div>
                            <button class="button-table edit"></button>
                        </a>
                        <a href="#" class="categories-item order" data-order="1">
                            <div class="flex flex-start">
                                <div class="categories-item-img"></div>
                                <div class="categories-item-text">
                                    <span>Название шаблона</span>
                                    <p>заявки</p>
                                </div>
                            </div>
                            <button class="button-table edit"></button>
                        </a>
                        <a href="#" class="categories-item order" data-order="1">
                            <div class="flex flex-start">
                                <div class="categories-item-img"></div>
                                <div class="categories-item-text">
                                    <span>Название шаблона</span>
                                    <p>заявки</p>
                                </div>
                            </div>
                            <button class="button-table edit"></button>
                        </a>
                        <a href="#" class="categories-item order" data-order="1">
                            <div class="flex flex-start">
                                <div class="categories-item-img"></div>
                                <div class="categories-item-text">
                                    <span>Название шаблона</span>
                                    <p>заявки</p>
                                </div>
                            </div>
                            <button class="button-table edit"></button>
                        </a>
                        <a href="#" class="categories-item order" data-order="1">
                            <div class="flex flex-start">
                                <div class="categories-item-img"></div>
                                <div class="categories-item-text">
                                    <span>Название шаблона</span>
                                    <p>заявки</p>
                                </div>
                            </div>
                            <button class="button-table edit"></button>
                        </a>
                        <a href="#" class="categories-item order" data-order="1">
                            <div class="flex flex-start">
                                <div class="categories-item-img"></div>
                                <div class="categories-item-text">
                                    <span>Название шаблона</span>
                                    <p>заявки</p>
                                </div>
                            </div>
                            <button class="button-table edit"></button>
                        </a>
                        <a href="#" class="categories-item order" data-order="1">
                            <div class="flex flex-start">
                                <div class="categories-item-img"></div>
                                <div class="categories-item-text">
                                    <span>Название шаблона</span>
                                    <p>заявки</p>
                                </div>
                            </div>
                            <button class="button-table edit"></button>
                        </a>
                    </div>
                </div>
            </div> -->
          </div>
        </div>
          <!-- <div class="modal-footer border-none cat-box">
              <div class="more more2">
                  <button class="more-button">Еще 4 записи</button>
              </div>
          </div> -->
      </div>
    </div>
    <ModalCreate :model="modal.create" @onClose="toggleModal('create')" @onSubmit="addCategory"></ModalCreate>
  </div>
</template>

<script>
import ModalCreate from './templates/ModalCreate'

export default {
  name: 'Template',
  components: {
    ModalCreate
  },
  data () {
    return {
      categories: [],
      modal: {
        create: false,
        edit: false,
        delete: false
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
    }
  },
  mounted () {
    this.getCategories()
  }
}
</script>

<style scoped>

</style>
