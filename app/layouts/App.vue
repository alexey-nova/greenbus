<template>
  <div class="wrapper">
    <notifications :duration="5000" :speed="1000"/>
    <offline @detected-condition="handleConnectivityChange">
      <div slot="offline"></div>
    </offline>
    <div v-if="!onlineStatus" class="offline">
      <p class="offline-text"><i class="fa fa-exclamation-triangle"></i> Подключение к интернету отсутствует</p>
    </div>
    <AppHeader></AppHeader>

    <div class="container">
      <AppSidebar></AppSidebar>

      <div class="container-box">
        <div class="top-shadow"></div>
          <!-- <Chat :users="users"></Chat> -->
          <router-view/>
      </div>
    </div>

  </div>
</template>
<script>
  import '#/assets/jquery/jquery.min'
  import '#/assets/adminlte/js/adminlte.min'
  import Chat from '@/Chat'
  import 'element-ui/lib/theme-chalk/index.css'
  import offline from 'v-offline'

  import AppHeader from './app/Header.vue'
  import AppFooter from './app/Footer.vue'
  import AppSidebar from './app/Sidebar.vue'
  import Alert from '@/Alert.vue'
  import VueFlashMessage from 'vue-flash-message';

  export default {
    name: 'app',
    components: {
      AppHeader,
      AppFooter,
      AppSidebar,
      Alert,
      VueFlashMessage,
      Chat,
      offline
    },
    data () {
      return {
        height: 0,
        showMessageBox: false,
        users: [],
        onlineStatus: true
      }
    },
    methods: {
      loadUsers () {
        this.$api('get', 'users').then(response => {
          this.users = response.data
        }).catch(e => {
          this.notify(e, 'danger')
        })
      },
      loadUtil () {
        return this.$api('get', 'users/utils').then(response => {
          const users = response.data.util.excelUsers
          if ((users && users.length > 0)) {
            this.$store.commit('app/setExcelUsers', users)
          }
        }).catch(err => {
          console.log(err.response)
        })
      },
      handleConnectivityChange(status) {
        this.onlineStatus = status
      }
    },
    beforeMount () {
      if (this.$auth().user) {
        this.$socket.emit('joinroom', this.$auth().user._id)
      }
    },
    mounted () {
      this.height = window.innerHeight - 101
      if (this.$auth().user) {
        this.loadUsers()
        this.loadUtil()
      }
    }
  }
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style src="#/assets/bootstrap/css/bootstrap.min.css"></style>
<style src="#/assets/css/style.css"></style>
<style src="#/assets/css/responsive.css"></style>
<style lang="scss">
  .container { padding: 0; }
  body .wrapper .main-header .navbar { background: #fff; }
  body .wrapper .main-header .navbar-nav>li>a { text-align: center; }
  body .wrapper .main-header .navbar .nav>*:not(.active)>a { color: #bdbdbd !important; }
  body .wrapper .main-header .navbar-custom-menu li a { padding: 24px; }
  body .wrapper .main-header .navbar .nav>li>a>.label { top: 20px; right: 20px; }
  .nav>li>a:hover, .nav>li>a:active, .nav>li>a:focus { background: #fff; }

  // sidebar
  body .wrapper .main-sidebar { padding-top: 80px; background: #232a38; }

  // user
  body .wrapper .user-panel { padding: 30px 0 10px; background: url('./../assets/design/user_bg4.jpg') center center; background-size: cover; }
  body .wrapper .user-panel p { color: #eee; font-size: 14px; font-weight: normal;
    &.name { font-weight: bold; font-size: 16px }}
  body .wrapper .user-panel .image { width: 100%; text-align: center; }
  body .wrapper .user-panel .image img { max-width: 80px; }
  body .wrapper .user-panel>.info { position: static; width: 100%; text-align: center; padding: 15px 0 0; margin: 0; font-size: 1.2em; }

  // menu
  body .wrapper .sidebar-menu li a { color: #ddd; font-size: 1em; border-left: 3px solid transparent; }
  body .wrapper .sidebar-menu li.active>a { background: #323743; border-left-color: #bbb; }

  // main
  /*body .wrapper .content { padding: 0; }*/
  body .wrapper .content { padding: 25px; }
  body .wrapper .content-header { margin: -25px; margin-bottom: 0; }
  body .wrapper .content-header .box { border: none; padding: 0; }
  body .wrapper .content-header .box-body { padding: 5px 15px; }
  body .wrapper .content-header .box .breadcrumb { text-align: left; padding: 10px 5px; }
  body .wrapper .content-header .box .breadcrumb>li { font-size: .9em; }

  body .wrapper .box { padding: 15px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24); border: none; }

  a { cursor: pointer; text-decoration: none; }
  body .wrapper .btn { border-radius: 5px; }
  body .wrapper .form-group { margin-bottom: 20px; }
  body .wrapper .form-group label { margin: 0 10px 5px 0; }
  body .wrapper .form-control { border-width: 0 0 1px; border-radius: 0; padding-left: 5px; }
  body .wrapper select.form-control { padding-left: 0; }
  td.admin { width: 100px; }
  input[type=file] { margin: 8px 0; }
  .modal{background:rgba(0,0,0,0.3)}
  .modal-title { font-size: 20px; }

  // .table th { position: relative; background: #eee; }
  // .table th>span:last-child { position: absolute; top: 12px; right: 10px; }
  // .table th>span:first-child { margin-right: 30px; white-space: nowrap; position: static; }
  // .table-bordered>thead>tr>th, .table-bordered>tbody>tr>th, .table-bordered>tfoot>tr>th, .table-bordered>thead>tr>td, .table-bordered>tbody>tr>td, .table-bordered>tfoot>tr>td { border: 1px solid #ccc !important; }
  // .table>tbody>tr>td, .table>tbody>tr>th, .table>tfoot>tr>td, .table>tfoot>tr>th, .table>thead>tr>td, .table>thead>tr>th { padding: 10px !important; }

  .label.label-default { background: #eee; }

  .vdp-datepicker .form-control { background: #fff; }

  .vue-notification { padding: 17px 10px; margin: 5px 3px; font-size: 16px !important; box-shadow: 2px 2px 6px -3px #000;
    color: #ffffff; background: #44A4FC; border-left: 5px solid #187FE7; cursor: pointer;
    &.warn { background: #ffb648; border-left-color: #f48a06; }
    &.error { background: #E54D42; border-left-color: #B82E24; }
    &.success { background: #68CD86; border-left-color: #42A85F; }}

  // MultiSelect
  .checkboxLayer .helperContainer>.line:first-child { display: none; }
  .checkboxLayer .tab-block { display: none; }

  .buttons { margin: -4px 0; }
  .buttons .btn { margin: 4px 0; }

  .offline {
    width: 100vw;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.7);
    z-index: 5000;
    position: absolute;

    &-text {
      font-size: 19px;
      padding: 20px;
      background: red;
      color: #fff;
    }
  }

  body .wrapper .content-wrapper .content .messenger-button {
    border: none;
    padding: 10px;
    color: white;
    background-color: cornflowerblue;
    border-radius: 3px;
    position: fixed;
    right: 100px;
    bottom: 100px;
  }
</style>
