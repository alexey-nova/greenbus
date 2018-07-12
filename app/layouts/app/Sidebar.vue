<template>
  <div class="nav" id="nav" v-click-outside="closeSidebar">
    <div class="info-box">
      <div class="info-container">
        <img v-if="!avatar" src="~assets/img/user.jpg" alt="Аватар">
        <img v-else :src="avatar" alt="Аватар">
        <p class="light">{{ $auth().user.fullname }}</p>
        <p class="small italic">{{ $auth().user.position }}</p>
      </div>
      <button class="italic" @click="toggle">Мой профиль</button>
    </div>
    <div class="main-menu">
      <ul class="list" v-if="isOpen">
        <li>
          <router-link :to="{name: 'profile'}">
            <img src="~assets/img/left_menu/profile.png">
            Профиль
          </router-link>
        </li>
        <li>
          <router-link :to="{name: 'panel', params: { param1: 'depts'}}" v-if="$auth().user.admin">
            <div class="item">
              <img src="~assets/img/left_menu/panel.png" />Панель управления
            </div>
          </router-link>
        </li>
        <li>
          <router-link :to="{name: 'templates'}" v-if="$auth().user.admin">
            <div class="item">
              <img src="~assets/img/left_menu/template.png" />Шаблоны заявок
            </div>
          </router-link>
        </li>
        <li>
          <router-link :to="{name: 'logout'}">
            <img src="~assets/img/left_menu/logout.png">
            Выход
          </router-link>
        </li>
        <hr>
      </ul>
      <sidebar-menu></sidebar-menu>
    </div>
  </div>
  <!-- <aside class="main-sidebar">
    <section class="sidebar">

      <div class="user-panel">
        <div class="image">
          <img v-if="!avatar" src="~assets/design/avatar.jpg" class="img-circle" alt="User Image">
          <img v-if="avatar" :src="avatar" class="img-circle" alt="User Image">
        </div>
        <div class="info">
          <p class="name">{{$auth().user.fullname}}</p>
          <p>{{$auth().user.position}}</p>
        </div>
      </div>
      <div class="profile-toggler" @click="toggle">
        <i class="fa fa-angle-down" style="float: right"></i>
        <span>Мой профиль</span>
      </div>

      <div v-if="isOpen" class="profile-tools">
        <router-link :to="{name: 'profile'}">
          <div class="item">
            <i class="fa fa-user"></i>&nbsp;&nbsp;Профиль
          </div>
        </router-link>
        <router-link :to="{name: 'panel'}" v-if="$auth().user.admin">
          <div class="item">
            <i class="fa fa-columns"></i>&nbsp;&nbsp;Панель управления
          </div>
        </router-link>
        <router-link :to="{name: 'logout'}">
          <div class="item">
            <i class="fa fa-power-off"></i>&nbsp;&nbsp;Выход
          </div>
        </router-link>
      </div>

      <SidebarMenu></SidebarMenu>

    </section>
  </aside> -->
</template>

<script>
  import User from './sidebar/User'
  import SidebarMenu from './sidebar/Menu'
  import ClickOutside from 'vue-click-outside'

  export default {
    components: {
      User,
      'sidebar-menu': SidebarMenu,
    },
    data () {
      return {
        isOpen: false,
      }
    },
    directives: {
      ClickOutside
    },
    computed: {
      avatar () {
        return this.$store.state.auth.user.avatar ? this.$config('app.fileUrl') + this.$auth().user.avatar + '?' + Math.random() : false
      },
    },
    methods: {
      toggle () {
        this.isOpen = !this.isOpen
      },
      closeSidebar (e) {
        if (window.innerWidth <= 414 && !e.path[2].classList.contains('header-box-left')) {
          var current = document.getElementById('nav')
          if (current && current.classList.contains('active')) {
            current.classList.remove('active')
          }
        }
      }
    },
  }
</script>

<style lang="scss" scoped>
  p { margin: 0.2em 0 }
  .sidebar .user-panel .info .name { white-space: normal; }
  .profile-toggler { background: #09101a; padding: 10px 15px; color: #ddd; font-size: .9em; cursor: pointer; }

  .profile-tools .item { padding: 15px 15px; border-bottom: 1px solid #09101a; box-shadow: 0 2px 10px -7px #fff; }
  .profile-tools a { color: #ddd; }
</style>
