<template>
  <Modal :isOpen="model" @onSubmit="submit">

    <h3 slot="header" class="modal-title">Редактировать пользователя</h3>

    <div slot="content">
      <div class="form-group">
        <label for="field-name">Имя</label>
        <input id="field-name" class="form-control" v-model="model.fullname">
      </div>
      <div class="form-group">
        <label for="field-department">Департамент</label>
        <select id="field-department" class="form-control" v-model="model.department">
          <option v-for="dep in departments" :value="dep.name">{{dep.name}}</option>
        </select>
      </div>
      <div class="form-group">
        <label for="field-position">Должность</label>
        <input id="field-position" class="form-control" v-model="model.position">
      </div>
      <div class="form-group">
        <label for="field-email">Email</label>
        <input id="field-email" class="form-control" v-model="model.email">
      </div>
    </div>

    <div slot="footer">
      <button type="button" class="btn btn-secondary" data-dismiss="modal" @click="close">Отмена</button>
      <button type="submit" class="btn btn-primary">Сохранить</button>
    </div>

  </Modal>
</template>

<script>
  import Modal from '@/Modal'

  export default {
    components: {
      Modal,
    },
    props: ['isOpen', 'model', 'departments', 'onSubmit', 'onClose'],
    methods: {
      close () {
        this.$emit('onClose')
      },
      submit () {
        this.$emit('onSubmit', this.model)
      },
    }
  }
</script>

<style lang="scss" scoped>

</style>