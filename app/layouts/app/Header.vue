<template>

  <header class="main-header" :style="{borderColor: $store.state.app.header.color}">
    <!-- Logo -->
    <router-link :to="{name: 'index'}" class="logo">
      <h1>СУЗ</h1>
      <!-- <img src="./../../assets/design/logo.png"> -->
    </router-link>

    <nav class="navbar">
      <!-- Sidebar toggle button-->
      <!--<a href="#" class="sidebar-toggle" data-toggle="push-menu" role="button">-->
        <!--<span class="sr-only">Toggle navigation</span>-->
      <!--</a>-->

      <Navigation></Navigation>

      <Notifications></Notifications>
    </nav>
  </header>
</template>

<script>
  import Navigation from './header/Navigation'
  import Notifications from './header/Notifications'

  export default {
    components: {
      Navigation,
      Notifications,
    },
  }
</script>

<style lang="scss" scoped>
</style>