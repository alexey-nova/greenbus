<template>
  <Modal :isOpen="model" @onSubmit="submit" type="lg">

    <h3 slot="header" class="modal-title">Редактировать пользователя</h3>

    <div slot="content" class="row">
      <div class="col-lg-6">
        <InputBase title="Логин" name="login" required :validate="'required'" v-model="model.login"></InputBase>
        <InputBase title="Ф.И.О" name="fullname" required :validate="'required'" v-model="model.fullname"></InputBase>
        <InputBase title="Email" name="email" required :validate="'required'" v-model="model.email"></InputBase>
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
        <div :class="['form-group', {'has-error': errors.has('phone')}]">
          <label for="field-phone">Телефон *</label>
          <masked-input id="field-phone" class="form-control" mask="\+1 (111) 111-11-11" name="phone" v-validate="'required'" v-model="model.phone"></masked-input>
          <span v-show="errors.has('phone')" class="help-block">{{ errors.first('phone') }}</span>
        </div>
        <div class="form-group">
          <label for="field-whatsapp">Whatsapp</label>
          <masked-input id="field-whatsapp" class="form-control" mask="\+1 (111) 111-11-11" v-model="model.whatsapp"></masked-input>
        </div>
      </div>
    </div>

    <div slot="footer">
      <button type="button" class="btn btn-default" data-dismiss="modal" @click="close"><i class="fa fa-times"></i>&nbsp;&nbsp;Отмена</button>
      <button type="submit" class="btn btn-success"><i class="fa fa-check"></i>&nbsp;&nbsp;Сохранить</button>
    </div>

  </Modal>
</template>

<script>
  import Modal from '@/Modal'
  import InputBase from '@/Input'
  import MaskedInput from 'vue-masked-input'

  export default {
    components: {
      Modal,
      MaskedInput,
      InputBase,
    },
    props: ['isOpen', 'model', 'departments', 'onSubmit', 'onClose'],
    methods: {
      close () {
        this.$emit('onClose')
      },
      submit () {
        this.$validator.validateAll().then(() => {
          if (this.$_.find(this.$props.users, u => u.login === this.$props.model.login)) {
            this.errors.items.push({
              field: 'login',
              scope: null,
              msg: 'Пользователь с таким логином уже существует',
            })
          } else {
            this.errors.items = this.$_.reject(this.errors.items, e => e.field === 'login')
          }
          if (this.$_.find(this.$props.users, u => u.email === this.$props.model.email)) {
            this.errors.items.push({
              field: 'email',
              scope: null,
              msg: 'Пользователь с такой почтой уже существует',
            })
          } else {
            this.errors.items = this.$_.reject(this.errors.items, e => e.field === 'email')
          }
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