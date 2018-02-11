<template>
  <div></div>
</template>

<script>
  export default {
    mounted () {
      this.$auth().logout()
    },
  }
</script>

<style lang="scss" scoped>
  .login-box { width: auto; max-width: 420px; }
  .login-box-body { padding: 50px 50px 70px; }
</style>