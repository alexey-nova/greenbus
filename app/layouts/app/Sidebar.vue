<template>
  <aside class="main-sidebar">
    <section class="sidebar">

      <div class="user-panel">
        <div class="image">
          <img v-if="!avatar" src="./../../assets/design/avatar.jpg" class="img-circle" alt="User Image">
          <!--<img v-if="$auth().user.avatar != undefined" :src="'http://195.93.152.79:3333/' + $auth().user.avatar" class="img-circle" alt="User Image">-->
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
        <router-link :to="{name: 'logout'}">
          <div class="item">
            <i class="fa fa-power-off"></i>&nbsp;&nbsp;Выход
          </div>
        </router-link>
      </div>

      <SidebarMenu></SidebarMenu>

    </section>
  </aside>
</template>

<script>
  import User from './sidebar/User'
  import SidebarMenu from './sidebar/Menu'

  export default {
    components: {
      User,
      SidebarMenu,
    },
    data () {
      return {
        isOpen: false,
      }
    },
    computed: {
      avatar () {
        return this.$store.state.auth.user.avatar ? 'http://195.93.152.79:3333/' + this.$auth().user.avatar + '?' + Math.random() : false
      },
    },
    methods: {
      toggle () {
        this.isOpen = !this.isOpen
      }
    },
  }
</script>

<style lang="scss" scoped>
  .sidebar .user-panel .info .name { white-space: normal; }
  .profile-toggler { background: #09101a; padding: 10px 15px; color: #ddd; font-size: .9em; cursor: pointer; }

  .profile-tools .item { padding: 15px 15px; border-bottom: 1px solid #09101a; box-shadow: 0 2px 10px -7px #fff; }
  .profile-tools a { color: #ddd; }
</style>
