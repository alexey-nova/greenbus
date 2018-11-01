<template>
  <div></div>
</template>

<script>
export default {
  async mounted () {
    await this.$auth().logout()
    this.$router.push({name: 'login'})
  }
}
</script>

<style lang="scss" scoped>
  .login-box { width: auto; max-width: 420px; }
  .login-box-body { padding: 50px 50px 70px; }
</style>
