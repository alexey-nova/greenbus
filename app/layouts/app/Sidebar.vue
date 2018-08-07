<template>
  <div :class="['nav', { 'active': $store.getters['app/mobileSidebar'] }]" v-click-outside="closeSidebar">
    <div class="info-box">
      <div class="info-container">
        <img v-if="!avatar" class="img-circle" src="~assets/avatar.jpg" alt="Аватар">
        <img v-else :src="avatar" class="img-circle" alt="Аватар">
        <div class="mob-none">
          <p>{{ $auth().user.fullname }}</p>
          <p>{{ getPositionName($auth().user.position) }}</p>
        </div>
        <div class="mob-flex mob-block">
          <p>{{ $auth().user.fullname }}</p>
          <p>{{ getPositionName($auth().user.position) }}</p>
        </div>
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
</template>

<script>
import SidebarMenu from './sidebar/Menu'
import ClickOutside from 'vue-click-outside'

export default {
  components: {
    'sidebar-menu': SidebarMenu
  },
  data () {
    return {
      isOpen: false,
      positions: []
    }
  },
  directives: {
    ClickOutside
  },
  computed: {
    avatar () {
      return this.$auth().user.avatar ? this.$config('app.fileUrl') + this.$auth().user.avatar + '?' + Math.random() : false
    }
  },
  methods: {
    toggle () {
      this.isOpen = !this.isOpen
    },
    closeSidebar (e) {
      if (e.target.className !== 'logo-img' && this.$store.getters['app/mobileSidebar']) {
        this.$store.commit('app/toggleMobSidebar', 'close')
      }
      // if (window.innerWidth <= 414 && !e.path[2].classList.contains('header-box-left')) {
      //   var current = document.getElementById('nav')
      //   if (current && current.classList.contains('active')) {
      //     current.classList.remove('active')
      //   }
      // }
    },
    loadPositions () {
      return this.$api('get', 'positions?all=true').then(response => {
        this.positions = response.data.positions
      })
    },
    getPositionName (id) {
      const position = this.positions.find(p => p._id === id)
      return position && position.name
    }
  },
  beforeMount () {
    this.loadPositions()
  }
}
</script>

<style lang="scss" scoped>
div {
  .sidebar .user-panel .info .name { white-space: normal; }
  .profile-toggler { background: #09101a; padding: 10px 15px; color: #ddd; font-size: .9em; cursor: pointer; }

  .profile-tools .item { padding: 15px 15px; border-bottom: 1px solid #09101a; box-shadow: 0 2px 10px -7px #fff; }
  .profile-tools a { color: #ddd; }

  .img-circle {
    width: 120px;
    height: 120px;
    object-fit: cover;
    border: 5px solid #1b8442;
  }
}
</style>
