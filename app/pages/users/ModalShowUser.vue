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
          <label>Должность</label>
          <span class="form-control">{{model.position}}</span>
        </div>
        <div class="form-group">
          <label>Отдел</label>
          <span class="form-control">{{model.department}}</span>
        </div>
        <div class="form-group">
          <label>Email</label>
          <a :href="'mailto:'+model.email" class="form-control">{{model.email}}</a>
        </div>
        <div v-if="model.phone" class="form-group">
          <label>Телефон</label>
          <a :href="'tel:+'+parseInt(model.phone.replace(/\D+/g,''))" class="form-control">{{model.phone}}</a>
        </div>
        <div v-if="model.whatsapp" class="form-group">
          <label>Telegram</label>
          <a :href="'tel:+'+parseInt(model.whatsapp.replace(/\D+/g,''))" class="form-control">{{model.whatsapp}}</a>
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
  a.form-control { color: #337ab7; }
</style>