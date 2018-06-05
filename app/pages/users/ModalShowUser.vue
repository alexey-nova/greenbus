<template>
  <Modal :isOpen="model" :type="['read-only']">
    <div slot="content" class="modal-dialog small">
      <div class="modal-content">
            <div class="modal-header">
                <div class="list_header">
                    <div class="flex">
                        <span>Карточка сотрудника</span>
                        <div class="buttons">
                            <button class="button-top close" @click="close"></button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-body">
                <div class="cart flex">
                    <div class="cart-item left">
                        <div class="cart-img">
                          <img v-if="avatar" :src="avatar" alt="Avatar">
                          <img v-else src="~assets/img/nopicture.jpg">
                        </div>
                    </div>
                    <div class="cart-item">
                        <div class="cart-text">
                            <p class="name">{{model.fullname}}</p>
                        </div>
                        <div class="cart-inside flex">
                            <span>Должность:</span>
                            <p>{{model.position}}</p>
                        </div>
                        <div class="cart-inside flex">
                            <span>Отдел:</span>
                            <p>{{model.department}}</p>
                        </div>
                        <div class="cart-inside flex">
                            <span>Телефон:</span>
                            <p>
                                <a class="td_link" :href="`tel:${model.phone}`">{{model.phone}}</a>
                            </p>
                        </div>
                        <div class="cart-inside flex">
                            <span>E-mail:</span>
                            <p>
                                <a class="td_link" :href="`mailto:${model.email}`">{{model.email}}</a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer"></div>
        </div>
    </div>
  </Modal>
</template>

<script>
  import Modal from '@/Modal'

  export default {
    components: {
      Modal,
    },
    props: ['model', 'departments', 'positions', 'onClose'],
    methods: {
      close () {
        this.$emit('onClose')
      },
    },
    computed: {
     departmentName () {
      //  if (this.departments.filter(item => item._id === ))
       let dep = this.$_.find(this.departments, '_id', this.model.departmentId)
       return dep ? dep.name : ''
     },
     positionName () {
       let position = this.$_.find(this.positions, '_id', this.model.positionId)
       return position ? position.name : ''
     },
     avatar () {
       return this.model.avatar ? `${this.$config('app.fileUrl')}${this.model.avatar}` : false
     }
    }
  }
</script>

<style lang="scss" scoped>
  .avatar { height: 300px; max-width: 300px; }
  a.form-control { color: #337ab7; }
</style>