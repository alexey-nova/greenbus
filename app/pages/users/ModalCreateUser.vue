<template>
  <Modal :isOpen="model" type="lg" @onSubmit="submit">
    <div slot="content" class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <div class="list_header">
            <div class="flex">
              <span>Добавить сотрудника</span>
              <div class="buttons">
                <button class="button-top close" type="button" @click="close"></button>
              </div>
            </div>
          </div>
        </div>
        <div class="profile full modal-body">
          <div class="flex">
            <div class="form-item">
              <div :class="['form-group', {'has-error': errors.has('login')}]">
                <label for="field-login">Логин *</label>
                <input id="field-login" v-validate="'required'" v-model="model.login" />
                <span v-show="errors.has('login')" class="help-block">{{ errors.first('login') }}</span>
              </div>
              <div :class="['form-group', {'has-error': errors.has('password')}]">
                <label for="field-password">Пароль *</label>
                <input id="field-password" v-validate="'required'" name="password" type="password" v-model="model.password">
                <span v-show="errors.has('password')" class="help-block">{{ errors.first('password') }}</span>
              </div>
              <div :class="['form-group', {'has-error': errors.has('fullname')}]">
                <label for="field-fullname">ФИО *</label>
                <input id="field-fullname" v-validate="'required'" name="fullname" v-model="model.fullname">
                <span v-show="errors.has('fullname')" class="help-block">{{ errors.first('fullname') }}</span>
              </div>
              <div :class="['form-group', {'has-error': errors.has('email')}]">
                <label for="field-email">Email *</label>
                <input id="field-email" v-validate="'required|email'" name="email" v-model="model.email">
                <span v-show="errors.has('email')" class="help-block">{{ errors.first('email') }}</span>
              </div>
            </div>
            <div class="form-item">
              <div :class="['form-group', {'has-error': errors.has('dept')}]">
                <label for="field-dept">Департамент</label>
                <Multiselect
                  id="field-dept"
                  name="dept"
                  v-validate="'required'"
                  v-model="model.department"
                  :options="departments"
                  track-by="name"
                  label="name">
                </Multiselect>
                <span v-show="errors.has('dept')" class="help-block">{{ errors.first('dept') }}</span>
              </div>
              <div :class="['form-group', {'has-error': errors.has('otdel')}]">
                <label for="field-otdel">Отдел</label>
                <Multiselect
                  id="field-otdel"
                  name="otdel"
                  v-validate="'required'"
                  v-model="model.otdel"
                  :options="filteredOtdels"
                  track-by="name"
                  label="name">
                </Multiselect>
                <span v-show="errors.has('otdel')" class="help-block">{{ errors.first('otdel') }}</span>
              </div>
              <div :class="['input-exc', {'has-error': errors.has('position')}]">
                <label for="field-position">Должность</label>
                <Multiselect
                  id="field-position"
                  name="position"
                  v-validate="'required'"
                  v-model="model.position"
                  :options="filteredPositions"
                  track-by="name"
                  label="name">
                </Multiselect>
                <span v-show="errors.has('position')" class="help-block">{{ errors.first('position') }}</span>
              </div>
              <div :class="['form-group', {'has-error': errors.has('phone')}]">
                <label for="field-phone">Телефон *</label>
                <masked-input id="field-phone" class="form-control" mask="\+1 (111) 111-11-11" name="phone" v-validate="'required'" v-model="model.phone"></masked-input>
                <span v-show="errors.has('phone')" class="help-block">{{ errors.first('phone') }}</span>
              </div>
              <div class="flex flex-end">
                <button type="submit" class="save pad2">Сохранить</button>
              </div>
            </div>
          </div>
        </div>
      <div class="modal-footer"></div>
    </div>
    </div>
    <!-- <h3 slot="header" class="modal-title">Создать пользователя</h3> -->

    <!-- <div slot="content" class="row">
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
        <div :class="['form-group', {'has-error': errors.has('phone')}]">
          <label for="field-phone">Телефон *</label>
          <masked-input id="field-phone" class="form-control" mask="\+1 (111) 111-11-11" name="phone" v-validate="'required'" v-model="model.phone"></masked-input>
          <span v-show="errors.has('phone')" class="help-block">{{ errors.first('phone') }}</span>
        </div>
      </div>
    </div> -->

    <!-- <div slot="footer">
      <button type="button" class="btn btn-default" data-dismiss="modal" @click="close"><i class="fa fa-times"></i>&nbsp;&nbsp;Отмена</button>
      <button type="submit" class="btn btn-success"><i class="fa fa-check"></i>&nbsp;&nbsp;Создать</button>
    </div> -->
  </Modal>
</template>

<script>
  import Modal from '@/Modal'
  import MaskedInput from 'vue-masked-input'
  import Multiselect from 'vue-multiselect'

  export default {
    components: {
      Modal,
      MaskedInput,
      Multiselect
    },
    props: ['model', 'users', 'departments', 'onSubmit', 'onClose', 'otdels', 'positions'],
    data () {
      return {
        filteredOtdels: [],
        filteredPositions: []
      }
    },
    methods: {
      close () {
        this.$emit('onClose')
      },
      submit () {
        this.model.department = this.model.department && this.model.department._id
        this.model.otdel = this.model.otdel && this.model.otdel._id
        this.model.position = this.model.position && this.model.position._id
        this.$validator.validateAll().then(() => {
          if (this.$_.find(this.$props.users, u => u.login === this.$props.model.login)) {
            this.errors.items.push({
              field: 'login',
              scope: null,
              msg: 'Пользователь с таким логином уже существует',
            })
          } else if (!this.errors.has('login')) {
            this.errors.items = this.$_.reject(this.errors.items, e => e.field === 'login')
          }
          if (this.$_.find(this.$props.users, u => u.email === this.$props.model.email)) {
            this.errors.items.push({
              field: 'email',
              scope: null,
              msg: 'Пользователь с такой почтой уже существует',
            })
          } else if (!this.errors.has('login')) {
            this.errors.items = this.$_.reject(this.errors.items, e => e.field === 'email')
          }
          if (!this.$_.size(this.errors.items)) {
            this.$emit('onSubmit', this.model)
          }
        }).catch(() => {
        })
      },
    },
    mounted () {
    },
    watch: {
      'model.department': function (val) {
        if (val) {
          this.filteredOtdels = this.otdels.filter(item => item.parent === val._id)
        } else {
          this.filteredOtdels = []
        }
      },
      'model.otdel': function (val) {
        if (val) {
          this.filteredPositions = this.positions.filter(item => item.department._id === val._id || item.department._id === (this.model.department && this.model.department._id))
        } else {
          this.filteredPositions = []
        }
      },
    }
  }
</script>

<style scoped>
.input-exc input {
  background: red;
}
</style>