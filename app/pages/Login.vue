<template>
  <section class="login">
      <div class="login-box">
        <h1 class="center">Green Bus Company</h1>
        <div class="login-form">
          <p class="login-center">Вход в систему</p>
          <form @submit.prevent="login">
            <div :class="['form-group', 'has-feedback', {'has-error': errors.has('login')}]">
              <input id="field-login" class="form-control" placeholder="Login" v-validate="'required'" name="login" v-model="loginData.login">
              <span class="glyphicon glyphicon-envelope form-control-feedback"></span>
              <span v-show="errors.has('login')" class="help-block">{{ errors.first('login') }}</span>
            </div>
            <div :class="['form-group', 'has-feedback', {'has-error': errors.has('password')}]">
              <input id="field-password" type="password" placeholder="Пароль" v-validate="'required'" name="password" class="form-control" v-model="loginData.password">
              <span class="glyphicon glyphicon-lock form-control-feedback"></span>
              <span v-show="errors.has('password')" class="help-block">{{ errors.first('password') }}</span>
            </div>
            <button class="btn btn-success btn-block">Войти</button>
          </form>
        </div>
      </div>
    </section>
</template>

<script>
export default {
  data () {
    return {
      loginData: {
        login: '',
        password: ''
      }
    }
  },
  methods: {
    async login (event) {
      try {
        const result = await this.$validator.validateAll() 
        if (!this.$_.size(this.errors.items)) {
          const response = await this.$api('post', 'auth/login', this.loginData)
          console.log('====', {response})
          await this.$login(response.data.token)
          this.$router.push({path: '/'})
        }
      } catch(e) {
        this.notify('Неверный логин или пароль', 'danger')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
