<template>
  <div class="container">
    <div class="container-box">
      <div class="working_area">
       <div class="profile">
          <p class="profile-p">Профиль</p>
          <div class="profile-box flex column">
            <div class="profile-left">
              <div class="padding-block">
                <form @submit.prevent="submit" data-vv-scope="user">
                  <div class="flex column">
                    <div class="form-item">
                      <div>
                        <label for="field-login">Логин</label>
                        <input type="text" id="field-login" class="form-control" :readonly="!$auth().user.admin" v-validate="'required'" name="login" v-model="model.login" disabled>
                      </div>
                      <div>
                        <label for="field-fullname">ФИО</label>
                        <input type="text" id="field-fullname" class="form-control" v-validate="'required'" name="fullname" v-model="model.fullname" disabled>
                      </div>
                      <div>
                        <label for="field-email">E-mail</label>
                        <input type="text" id="field-email" class="form-control" :readonly="!$auth().user.admin" v-validate="'required|email'" name="email" v-model="model.email" disabled>
                      </div>
                    </div>
                    <div class="form-item">
                      <div>
                        <label for="field-department">Отдел</label>
                        <select id="field-department" class="form-control" :readonly="!$auth().user.admin" v-validate="'required'" name="department" v-model="model.department" disabled>
                          <option v-for="dep in departments" :key="dep._id" :value="dep.value">{{dep.text}}</option>
                        </select>
                      </div>
                      <div>
                        <label for="field-position">Должность</label>
                        <input type="text" id="field-position" class="form-control" :readonly="!$auth().user.admin" name="position" v-model="model.positionName" disabled>
                      </div>
                      <div>
                        <label for="field-phone">Телефон</label>
                        <masked-input id="field-phone" mask="\+1 (111) 111-11-11" name="phone" v-model="model.phone"></masked-input>
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
                          <input type="checkbox" v-model="telegram" :checked="telegram">
                        </div>
                      </div>
                    </div>
                    <button class="save pad">Сохранить</button>
                  </div>
                </form>
              </div>
              <hr class="line">
            </div>
            <div class="profile-right">
              <div class="padding-block">
                <form @submit.prevent="changePassword">
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
      positions: [],
      telegram: false,
      user: null
    }
  },
  methods: {
    changePassword () {
      this.$validator.validateAll(['password', 'currentPassword', 'confirmPassword']).then(() => {
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
      }).catch((e) => {})
    },
    submit () {
      this.model.telegram = this.telegram
      this.save(this.model)
    },
    save (data) {
      data.avatar = data.files && data.files[0].file
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
    getPositionName (id) {
      const dept = this.positions.find(d => d._id === id)
      return dept && dept.name
    },
    getUser () {
      return this.$api('get', `users/${this.$auth().user._id}`).then(response => {
        this.user = response.data.user
      })
    }
  },
  async mounted () {
    this.loadDepartments()
    await this.loadPositions()
    this.model.positionName = this.getPositionName(this.model.position)
    this.getUser().then(() => {
      this.telegram = this.user.telegram.notifications
    })
  },
  watch: {
    '$store.state.auth.user' () {
      this.model = this.$_.cloneDeep(this.$store.state.auth.user)
    }
  }
}
</script>

<style lang="scss" scoped>
  .buttons { text-align: right; }
</style>
