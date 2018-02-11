<template>
  <div class="wrapper">
    <notifications :duration="5000" :speed="1000"/>

    <AppHeader></AppHeader>

    <AppSidebar></AppSidebar>

    <main class="content-wrapper" :style="{minHeight: this.height + 'px'}">
      <section class="content">
        <router-view/>
      </section>
    </main>

    <AppFooter></AppFooter>
  </div>
</template>

<script>
  import '#/assets/jquery/jquery.min'
  import '#/assets/bootstrap/bootstrap.min'
  import '#/assets/adminlte/js/adminlte.min'
//  import 'vue-flash-message/dist/vue-flash-message.min.css'
//  import 'bootstrap/dist/css/bootstrap.css'

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
    },
    data () {
      return {
        height: 0,
      }
    },
    mounted () {
      this.height = window.innerHeight - 101
    }
  }
</script>

<style src="#/assets/bootstrap/css/bootstrap.min.css"></style>
<style src="#/assets/adminlte/css/adminlte.min.css"></style>
<style lang="scss">
  /*.wrapper { display: flex; min-height: calc(100em - 101px); flex-direction: column; }*/
  /*main { flex: 1; }*/
  html { font-size: 62.5% !important; }
  body { font-size: 150% !important; }

  // header
  body .wrapper .main-header { border-bottom: 4px solid #fff; max-height: none; }
  body .wrapper .main-header .logo { background-color: #fff; text-align: left; height: 81px; }
  body .wrapper .main-header .logo img { height: 50px; margin-top: 15px; }
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






  /*body .wrapper .main-header .nav .nav-item.active a {  }*/
  /*body .wrapper .main-header .navbar .sidebar-toggle { height: 80px; padding-top: 30px; }*/

  /*body .wrapper .main-header .navbar-custom-menu li a { padding: 30px 15px; }*/
  /*body .wrapper .main-header .navbar-custom-menu .user.user-menu { background: #3a8843; margin-left: 15px; }*/



  a { cursor: pointer; }
  body .wrapper .btn { border-radius: 5px; }
  body .wrapper .form-group { margin-bottom: 20px; }
  body .wrapper .form-group label { margin: 0 10px 5px 0; }
  body .wrapper .form-control { border-width: 0 0 1px; border-radius: 0; padding-left: 5px; }
  body .wrapper select.form-control { padding-left: 0; }
  td.admin { width: 100px; }
  input[type=file] { margin: 8px 0; }



  .modal-body { padding: 15px 20px; }
  .modal-title { font-size: 20px; }
  .modal-body { padding: 20px 20px; }


  .table th { position: relative; background: #eee; }
  .table th>span:first-child { margin-right: 30px; white-space: nowrap; }
  .table th>span:last-child { position: absolute; top: 12px; right: 10px; }
  .table-bordered>thead>tr>th, .table-bordered>tbody>tr>th, .table-bordered>tfoot>tr>th, .table-bordered>thead>tr>td, .table-bordered>tbody>tr>td, .table-bordered>tfoot>tr>td { border: 1px solid #ccc !important; }
  .table>tbody>tr>td, .table>tbody>tr>th, .table>tfoot>tr>td, .table>tfoot>tr>th, .table>thead>tr>td, .table>thead>tr>th { padding: 10px !important; }

  .label.label-default { background: #eee; }

  .vdp-datepicker .form-control { background: #fff; }

  .notifications { margin-top: 87px; margin-right: 10px; }
  .vue-notification { padding: 17px 10px; margin: 5px 3px; font-size: 16px !important; box-shadow: 2px 2px 6px -3px #000;
    color: #ffffff; background: #44A4FC; border-left: 5px solid #187FE7; cursor: pointer;
    &.warn { background: #ffb648; border-left-color: #f48a06; }
    &.error { background: #E54D42; border-left-color: #B82E24; }
    &.success { background: #68CD86; border-left-color: #42A85F; }}

  // MultiSelect
  .checkboxLayer .helperContainer>.line:first-child { display: none; }
  .checkboxLayer .tab-block { display: none; }
</style>
