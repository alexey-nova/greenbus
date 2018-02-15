<template>
  <Modal :isOpen="model" :type="['lg', 'read-only']">

    <h3 slot="header" class="modal-title">Карточка пользователя</h3>

    <div slot="content" class="row">
      <div class="col-md-6">
        <div class="form-group text-center">
          <img class="avatar" src="./../../assets/design/avatar.jpg">
          <h2>{{model.fullname}}</h2>
        </div>
      </div>
      <div class="col-md-6">
        <div class="form-group">
          <label for="field-position">Должность</label>
          <input id="field-position" class="form-control" readonly v-model="model.position">
        </div>
        <div class="form-group">
          <label for="field-department">Отдел</label>
          <input id="field-department" class="form-control" readonly :value="model.department">
        </div>
        <div class="form-group">
          <label for="field-email">Email</label>
          <input id="field-email" class="form-control" readonly v-model="model.email">
        </div>
        <div class="form-group">
          <label for="field-phone">Телефон</label>
          <input id="field-phone" class="form-control" readonly v-model="model.phone">
        </div>
        <div class="form-group">
          <label for="field-whatsapp">Whatsapp</label>
          <input id="field-whatsapp" class="form-control" readonly v-model="model.whatsapp">
        </div>
      </div>
    </div>

    <div slot="footer">
      <button type="button" class="btn btn-default" data-dismiss="modal" @click="close"><i class="fa fa-times"></i>&nbsp;&nbsp;Закрыть окно</button>
    </div>

  </Modal>
</template>

<script>
  import Modal from '@/Modal'

  export default {
    components: {
      Modal,
    },
    props: ['model', 'departments', 'onClose'],
    methods: {
      close () {
        this.$emit('onClose')
      },
    },
    computed: {
//      departmentName () {
//        console.log(this.$props.model.department)
//        let dep = this.$_.find(this.$props.departments, 'id', this.$props.model.department)
//        return dep ? dep.name : ''
//      }
    }
  }
</script>

<style lang="scss" scoped>
  .avatar { height: 300px; max-width: 300px; }
</style>