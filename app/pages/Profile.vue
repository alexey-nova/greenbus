<template>
  <div>
    <PageTitle title="Профиль"></PageTitle>

    <Box>
      <form @submit="submit" data-vv-scope="user">
        <div class="col-lg-6">
          <div :class="['form-group', {'has-error': errors.has('login')}]">
            <label for="field-login">Логин *</label>
            <input id="field-login" class="form-control" :readonly="!$auth().user.admin" v-validate="'required'" name="login" v-model="model.login">
            <span v-show="errors.has('login')" class="help-block">{{ errors.first('login') }}</span>
          </div>
          <div :class="['form-group', {'has-error': errors.has('fullname')}]">
            <label for="field-fullname">Ф.И.О *</label>
            <input id="field-fullname" class="form-control" v-validate="'required'" name="fullname" v-model="model.fullname">
            <span v-show="errors.has('fullname')" class="help-block">{{ errors.first('fullname') }}</span>
          </div>
          <div :class="['form-group', {'has-error': errors.has('email')}]">
            <label for="field-email">Email *</label>
            <input id="field-email" class="form-control" :readonly="!$auth().user.admin" v-validate="'required|email'" name="email" v-model="model.email">
            <span v-show="errors.has('email')" class="help-block">{{ errors.first('email') }}</span>
          </div>
          <div class="form-group">
            <label class="custom-file-label" for="field-files">Аватар</label>
            <input type="file" id="field-files" lang="ru" @change="addFiles">
          </div>
        </div>
        <div class="col-lg-6">
          <div :class="['form-group', {'has-error': errors.has('department')}]">
            <label for="field-department">Отдел *</label>
            <select id="field-department" class="form-control" :readonly="!$auth().user.admin" v-validate="'required'" name="department" v-model="model.department">
              <option v-for="dep in departments" :value="dep.name">{{dep.name}}</option>
            </select>
            <span v-show="errors.has('department')" class="help-block">{{ errors.first('department') }}</span>
          </div>
          <div :class="['form-group', {'has-error': errors.has('position')}]">
            <label for="field-position">Должность *</label>
            <input id="field-position" class="form-control" :readonly="!$auth().user.admin" v-validate="'required'" name="position" v-model="model.position">
            <span v-show="errors.has('position')" class="help-block">{{ errors.first('position') }}</span>
          </div>
          <div :class="['form-group', {'has-error': errors.has('phone')}]">
            <label for="field-phone">Телефон *</label>
            <masked-input id="field-phone" class="form-control" mask="\+1 (111) 111-11-11" name="phone" v-validate="'required'" v-model="model.phone"></masked-input>
            <span v-show="errors.has('phone')" class="help-block">{{ errors.first('phone') }}</span>
          </div>
          <div class="form-group">
            <label for="field-telegram">Уведомления</label>
            <SwitchInput id="field-telegram" type="checkbox" mask="\+1 (111) 111-11-11" v-model="model.telegram"></SwitchInput>
          </div>
        </div>

        <div class="buttons">
          <button class="btn btn-success"><i class="fa fa-check"></i>&nbsp;&nbsp;Сохранить</button>
        </div>
      </form>
    </Box>
    <div class="row">
      <div class="col-lg-12">
        <Box>
          <form @submit="changePassword">
            <div :class="['form-group', {'has-error': errors.has('currentPassword')}]">
              <label for="field-currentPassword">Текущий пароль *</label>
              <input id="field-currentPassword" class="form-control" type="password" v-validate="'required'" name="currentPassword" v-model="model.currentPassword">
              <span v-show="errors.has('currentPassword')" class="help-block">{{ errors.first('currentPassword') }}</span>
            </div>
            <div :class="['form-group', {'has-error': errors.has('password')}]">
              <label for="field-password">Новый пароль *</label>
              <input id="field-password" class="form-control" type="password" v-validate="'required|min:5'" name="password" v-model="model.password">
              <span v-show="errors.has('password')" class="help-block">{{ errors.first('password') }}</span>
            </div>
            <div :class="['form-group', {'has-error': errors.has('confirmPassword')}]">
              <label for="field-confirmPassword">Повторите новый пароль *</label>
              <input id="field-confirmPassword" class="form-control" type="password" v-validate="'required|confirmed:password'" name="confirmPassword" v-model="model.confirmPassword">
              <span v-show="errors.has('confirmPassword')" class="help-block">{{ errors.first('confirmPassword') }}</span>
            </div>
            <div class="buttons">
              <button class="btn btn-success"><i class="fa fa-check"></i>&nbsp;&nbsp;Сменить пароль</button>
            </div>
          </form>
        </Box>
      </div>
    </div>
  </div>
</template>

<script>
  import PageTitle from '@/PageTitle'
  import Box from '@/Box'
  import MaskedInput from 'vue-masked-input'
  import { Switch } from 'element-ui'

  export default {
    components: {
      PageTitle,
      Box,
      MaskedInput,
      SwitchInput: Switch,
    },
    data () {
      return {
        model: this.$_.cloneDeep(this.$store.state.auth.user),
        departments: [],
      }
    },
    watch: {
      '$store.state.auth.user' () {
        this.model = this.$_.cloneDeep(this.$store.state.auth.user)
      },
    },
    mounted () {
      this.loadDepartments()
    },
    methods: {
      changePassword (event) {
        event.preventDefault()

        this.$validator.validateAll(['password', 'currentPassword', 'confirmPassword']).then(() => {
          if (!(this.fields.password.invalid || this.fields.currentPassword.invalid || this.fields.confirmPassword.invalid)) {
            let data = {
              password: this.model.password,
              currentPassword: this.model.currentPassword,
            }
            let formData = this.$createFormData(data)
            this.$api('put', 'users/' + this.model._id, formData).then(response => {
              this.notify(response.data.message)
              this.model.password = ''
              this.model.currentPassword = ''
              this.model.confirmPassword = ''
            }).catch((e) => {
              this.notify('Неверный пароль', 'danger')
              this.$log(e, 'danger')
            })
          }
        }).catch((e) => {})
      },
      submit (event) {
        event.preventDefault()
        this.$validator.validateAll('login', 'fullname', 'email', 'department', 'position', 'phone').then(() => {
          if (!(this.fields.$user.login.invalid || this.fields.$user.fullname.invalid || this.fields.$user.email.invalid
              || this.fields.$user.department.invalid || this.fields.$user.position.invalid || this.fields.$user.phone.invalid)) {
            this.save(this.model)
          }
        }).catch(() => {
        })
      },
      save (data) {
        let formData = this.$createFormData(data)
        this.$api('put', 'users/' + data._id, formData).then(response => {
          this.notify(response.data.message)

          let user = response.data.user
          this.$auth().editUser(user)
        }).catch(e => {
          this.notify('Временно нельзя сохранить', 'info')
          this.$log(e, 'danger')
        })
      },
      loadDepartments () {
        this.$api('get', 'departments').then(response => {
          this.departments = response.data
        }).catch(e => {
          this.notify(e.response.data, 'danger')
        })
      },
      addFiles (e) {
        let files = e.target.files || e.dataTransfer.files
        if (!files.length) return

        this.model.avatar = files[0]
      },
    }
  }
</script>

<style lang="scss" scoped>
  .buttons { text-align: right; }
</style>