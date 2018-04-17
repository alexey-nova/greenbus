<template>
  <div class="login-box">

    <div class="login-logo">
      <b>СУЗ</b>
    </div>

    <div class="login-box-body">
      <p class="login-box-msg">Вход в систему</p>

      <form @submit="login">
        <div class="form-group has-feedback">
          <input type="text" class="form-control" placeholder="Email" v-model="loginData.login">
          <span class="glyphicon glyphicon-envelope form-control-feedback"></span>
        </div>
        <div class="form-group has-feedback">
          <input type="password" class="form-control" placeholder="Пароль" v-model="loginData.password">
          <span class="glyphicon glyphicon-lock form-control-feedback"></span>
        </div>
        <button type="submit" class="btn btn-primary btn-block btn-flat">Войти</button>
      </form>
    </div>
  </div>
</template>

<script>
  import base64js from 'base64-js'
  import TextDecoderLite from 'text-encoder-lite'

  export default {
    data () {
      return {
        loginData: {
          login: '',
          password: '',
        }
      }
    },
    methods: {
      login (event) {
        event.preventDefault()
        this.$api('post', 'auth/login', this.loginData).then(response => {
          this.$login(response.data.token)
          this.$router.push({name: 'index'})
        }).catch(e => {
          this.notify('Неверный логин или пароль', 'danger')
        })
      }
    },
  }
</script>

<style lang="scss" scoped>
  .login-box { width: auto; max-width: 420px; }
  .login-box-body { padding: 50px 50px 70px; }
</style>