<template>
  <Modal :isOpen="model" type="lg" @onSubmit="submit">

    <h3 slot="header" class="modal-title">Создать пользователя</h3>

    <div slot="content" class="row">
      <div class="col-lg-6">
        <div :class="['form-group', {'has-error': errors.has('login')}]">
          <label for="field-login">Логин *</label>
          <input id="field-login" class="form-control" v-validate="'required'" name="login" v-model="model.login" />
          <span v-show="errors.has('login')" class="help-block">{{ errors.first('login') }}</span>
        </div>
        <div :class="['form-group', {'has-error': errors.has('password')}]">
          <label for="field-password">Пароль *</label>
          <input id="field-password" class="form-control" v-validate="'required'" name="password" type="password" v-model="model.password">
          <span v-show="errors.has('password')" class="help-block">{{ errors.first('password') }}</span>
        </div>
        <div :class="['form-group', {'has-error': errors.has('fullname')}]">
          <label for="field-fullname">Ф.И.О *</label>
          <input id="field-fullname" class="form-control" v-validate="'required'" name="fullname" v-model="model.fullname">
          <span v-show="errors.has('fullname')" class="help-block">{{ errors.first('fullname') }}</span>
        </div>
        <div :class="['form-group', {'has-error': errors.has('email')}]">
          <label for="field-email">Email *</label>
          <input id="field-email" class="form-control" v-validate="'required|email'" name="email" v-model="model.email">
          <span v-show="errors.has('email')" class="help-block">{{ errors.first('email') }}</span>
        </div>
      </div>
      <div class="col-lg-6">
        <div :class="['form-group', {'has-error': errors.has('department')}]">
          <label for="field-department">Отдел *</label>
          <select id="field-department" class="form-control" v-validate="'required'" name="department" v-model="model.department">
            <option v-for="dep in departments" :value="dep.name">{{dep.name}}</option>
          </select>
          <span v-show="errors.has('department')" class="help-block">{{ errors.first('department') }}</span>
        </div>
        <div :class="['form-group', {'has-error': errors.has('position')}]">
          <label for="field-position">Должность *</label>
          <input id="field-position" class="form-control" v-validate="'required'" name="position" v-model="model.position">
          <span v-show="errors.has('position')" class="help-block">{{ errors.first('position') }}</span>
        </div>
        <div class="form-group">
          <label for="field-phone">Телефон</label>
          <masked-input id="field-phone" class="form-control" mask="\+\7 (111) 111-11-11" v-model="model.phone"></masked-input>
        </div>
        <div class="form-group">
          <label for="field-whatsapp">Whatsapp</label>
          <masked-input id="field-whatsapp" class="form-control" mask="\+\7 (111) 111-11-11" v-model="model.whatsapp"></masked-input>
        </div>
      </div>
    </div>

    <div slot="footer">
      <button type="button" class="btn btn-default" data-dismiss="modal" @click="close"><i class="fa fa-times"></i>&nbsp;&nbsp;Отмена</button>
      <button type="submit" class="btn btn-success"><i class="fa fa-check"></i>&nbsp;&nbsp;Создать</button>
    </div>

  </Modal>
</template>

<script>
  import Modal from '@/Modal'
  import MaskedInput from 'vue-masked-input'

  export default {
    components: {
      Modal,
      MaskedInput,
    },
    props: ['model', 'departments', 'onSubmit', 'onClose'],
    methods: {
      close () {
        this.$emit('onClose')
      },
      submit () {
        this.$validator.validateAll().then(() => {
          if (!this.$_.size(this.errors.items)) {
            this.$emit('onSubmit', this.model)
          }
        }).catch(() => {
        })
      },
    }
  }
</script>

<style lang="scss" scoped>

</style>