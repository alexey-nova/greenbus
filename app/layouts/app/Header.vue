<template>

  <header class="main-header" :style="{borderColor: $store.state.app.header.color}">
    <!-- Logo -->
    <router-link :to="{name: 'index'}" class="logo">
      <img src="./../../assets/design/logo.png">
    </router-link>

    <nav class="navbar">
      <!-- Sidebar toggle button-->
      <!--<a href="#" class="sidebar-toggle" data-toggle="push-menu" role="button">-->
        <!--<span class="sr-only">Toggle navigation</span>-->
      <!--</a>-->

      <Navigation></Navigation>

      <div class="navbar-custom-menu">
        <ul class="nav navbar-nav">
          <li class="dropdown notifications-menu">
            <a href="#" class="dropdown-toggle" data-toggle="dropdown">
              <i class="fa fa-bell-o fa-2x"></i>
              <span class="label label-warning">10</span>
            </a>
            <ul class="dropdown-menu">
              <li class="header">У вас нет уведомлений</li>
              <!--<li>-->
                <!--&lt;!&ndash; inner menu: contains the actual data &ndash;&gt;-->
                <!--<ul class="menu">-->
                  <!--<li>-->
                    <!--<a href="#">-->
                      <!--<i class="fa fa-users text-aqua"></i> 5 new members joined today-->
                    <!--</a>-->
                  <!--</li>-->
                <!--</ul>-->
              <!--</li>-->
              <!--<li class="footer"><a href="#">View all</a></li>-->
            </ul>
          </li>
        </ul>
      </div>
    </nav>
  </header>
</template>

<script>
  import Navigation from './header/Navigation'

  export default {
    components: {
      Navigation,
    },
  }
</script>

<style lang="scss" scoped>
</style>