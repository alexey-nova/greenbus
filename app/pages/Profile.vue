<template>
  <div>
    <PageTitle title="Профиль"></PageTitle>

    <Box>
      <form @submit="submit">
        <div class="col-lg-6">
          <div :class="['form-group', {'has-error': errors.has('login')}]">
            <label for="field-login">Логин *</label>
            <input id="field-login" class="form-control" v-validate="'required'" name="login" v-model="model.login">
            <span v-show="errors.has('login')" class="help-block">{{ errors.first('login') }}</span>
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
          <div class="form-group">
            <label class="custom-file-label" for="field-files">Аватар</label>
            <input type="file" id="field-files" lang="ru" @change="addFiles">
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
          <div class="form-group">
            <label for="field-whatsapp">Whatsapp</label>
            <masked-input id="field-whatsapp" class="form-control" mask="\+1 (111) 111-11-11" v-model="model.whatsapp"></masked-input>
          </div>
        </div>

        <div class="buttons">
          <button class="btn btn-success"><i class="fa fa-check"></i>&nbsp;&nbsp;Сохранить</button>
        </div>
      </form>
    </Box>
  </div>
</template>

<script>
  import PageTitle from '@/PageTitle'
  import Box from '@/Box'
  import MaskedInput from 'vue-masked-input'

  export default {
    components: {
      PageTitle,
      Box,
      MaskedInput,
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
      submit (event) {
        event.preventDefault()
        this.$validator.validateAll().then(() => {
          if (!this.$_.size(this.errors.items)) {
            this.save(this.model)
          }
        }).catch(() => {
        })
      },
      save (data) {
        let formData = this.$createFormData(data)
        this.$api('put', 'users/' + data._id, formData).then(response => {
          this.notify(response.data.message)

          this.$store.commit('auth/init', {token: this.$auth().token, user: response.user})
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