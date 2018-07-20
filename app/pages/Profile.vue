<template>
  <div class="container">
    <div class="container-box">
      <div class="working_area">
       <div class="profile">
          <p class="profile-p">Профиль</p>
          <div class="profile-box flex column">
            <div class="profile-left">
              <div class="padding-block">
                <form @submit="submit" data-vv-scope="user">
                  <div class="flex column">
                    <div class="form-item">
                      <div :class="['', {'has-error': errors.has('login')}]">
                        <label for="field-login">Логин *</label>
                        <input type="text" id="field-login" class="form-control" :readonly="!$auth().user.admin" v-validate="'required'" name="login" v-model="model.login" disabled>
                        <span v-show="errors.has('login')" class="help-block">{{ errors.first('login') }}</span>
                      </div>
                      <div :class="['', {'has-error': errors.has('fullname')}]">
                        <label for="field-fullname">ФИО *</label>
                        <input type="text" id="field-fullname" class="form-control" v-validate="'required'" name="fullname" v-model="model.fullname" disabled>
                        <span v-show="errors.has('fullname')" class="help-block">{{ errors.first('fullname') }}</span>
                      </div>
                      <div :class="['', {'has-error': errors.has('email')}]">
                        <label for="field-email">E-mail *</label>
                        <input type="text" id="field-email" class="form-control" :readonly="!$auth().user.admin" v-validate="'required|email'" name="email" v-model="model.email" disabled>
                        <span v-show="errors.has('email')" class="help-block">{{ errors.first('email') }}</span>
                      </div>
                    </div>
                    <div class="form-item">
                      <div :class="['', {'has-error': errors.has('department')}]">
                        <label for="field-department">Отдел *</label>
                        <select id="field-department" class="form-control" :readonly="!$auth().user.admin" v-validate="'required'" name="department" v-model="model.department" disabled>
                          <option v-for="dep in departments" :value="dep.value">{{dep.text}}</option>
                        </select>
                        <span v-show="errors.has('department')" class="help-block">{{ errors.first('department') }}</span>
                      </div>
                      <div :class="['', {'has-error': errors.has('position')}]">
                        <label for="field-position">Должность *</label>
                        <input type="text" id="field-position" class="form-control" :readonly="!$auth().user.admin" v-validate="'required'" name="position" v-model="model.positionName" disabled>
                        <span v-show="errors.has('position')" class="help-block">{{ errors.first('position') }}</span>
                      </div>
                      <div :class="['', {'has-error': errors.has('phone')}]">
                        <label for="field-phone">Телефон *</label>
                        <masked-input id="field-phone" mask="\+1 (111) 111-11-11" name="phone" v-validate="'required'" v-model="model.phone"></masked-input>
                        <span v-show="errors.has('phone')" class="help-block">{{ errors.first('phone') }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="flex margin align-center column">
                    <div class="select-img">
                      <div class="select-img-box">
                        <div class="select-item" style="position:relative">
                          <label class="ava">Аватар</label>
                          <file-upload
                            class="btn btn-default"
                            :multiple="false"
                            v-model="model.files"
                            ref="upload">
                            Выберите файл
                          </file-upload>
                          <ul style="list-style: none; padding: 0; position: absolute; left: 12.5em; top: -0.1em">
                            <li v-if="model.files">
                               <span class="label label-success">1</span>
                            </li>
                          </ul>
                        </div>
                        <div class="select-item right">
                          <label>Уведомления&nbsp;</label>
                          <input type="checkbox">
                        </div>
                      </div>
                    </div>
                    <button type="submit" class="save pad">Сохранить</button>
                  </div>
                </form>
              </div>
              <hr class="line">
            </div>
            <div class="profile-right">
              <div class="padding-block">
                <form @submit="changePassword">
                  <div :class="['', {'has-error': errors.has('currentPassword')}]">
                    <label for="field-currentPassword">Текущий пароль *</label>
                    <input id="field-currentPassword" type="password" v-validate="'required'" name="currentPassword" v-model="model.currentPassword">
                    <span v-show="errors.has('currentPassword')" class="help-block">{{ errors.first('currentPassword') }}</span>
                  </div>
                  <div :class="['', {'has-error': errors.has('password')}]">
                    <label for="field-password">Новый пароль *</label>
                    <input id="field-password" type="password" v-validate="'required|min:5'" name="password" v-model="model.password">
                    <span v-show="errors.has('password')" class="help-block">{{ errors.first('password') }}</span>
                  </div>
                  <div :class="['', {'has-error': errors.has('confirmPassword')}]">
                    <label for="field-confirmPassword">Повторите новый пароль *</label>
                    <input id="field-confirmPassword" type="password" v-validate="'required|confirmed:password'" name="confirmPassword" v-model="model.confirmPassword">
                    <span v-show="errors.has('confirmPassword')" class="help-block">{{ errors.first('confirmPassword') }}</span>
                  </div>
                  <div class="flex margin">
                    <button class="save"><i class="fa fa-check"></i>&nbsp;&nbsp;Сменить пароль</button>
                  </div>
                </form>
              </div>
              <hr class="line">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- <div>
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
  </div> -->
</template>

<script>
import FileUpload from 'vue-upload-component'
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
    FileUpload
  },
  data () {
    return {
      model: this.$_.cloneDeep(this.$store.state.auth.user),
      departments: [],
      positions: []
    }
  },
  watch: {
    '$store.state.auth.user' () {
      this.model = this.$_.cloneDeep(this.$store.state.auth.user)
    }
  },
  async mounted () {
    this.loadDepartments()
    await this.loadPositions()
    this.model.positionName = this.getPositionName(this.model.position)
  },
  methods: {
    changePassword (event) {
      event.preventDefault()

      this.$validator.validateAll(['password', 'currentPassword', 'confirmPassword']).then(() => {
        if (!(this.fields.password.invalid || this.fields.currentPassword.invalid || this.fields.confirmPassword.invalid)) {
          let data = {
            password: this.model.password,
            currentPassword: this.model.currentPassword
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
      this.$validator.validateAll('login', 'fullname', 'email', 'department', 'position').then(() => {
        this.save(this.model)
      }).catch(() => {
      })
    },
    save (data) {
      data.avatar = data.files[0].file
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
        this.departments = response.data.departments.map(item => {
          return {
            text: item.name,
            value: item._id
          }
        })
      }).catch(e => {
        this.notify(e.response.data, 'danger')
      })
    },
    loadPositions () {
      return this.$api('get', 'positions?all=true').then(response => {
        this.positions = response.data.positions
      })
    },
    addFiles (e) {
      let files = e.target.files || e.dataTransfer.files
      if (!files.length) return

      this.model.avatar = files[0]
    },
    getPositionName (id) {
      const dept = this.positions.find(d => d._id === id)
      return dept && dept.name
    }
  }
}
</script>

<style lang="scss" scoped>
  .buttons { text-align: right; }
</style>
