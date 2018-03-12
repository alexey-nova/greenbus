<template>
  <div>
    <notifications :duration="5000" :speed="1000"/>
    <router-view/>
  </div>
</template>

<script>
//  import './assets/jquery/jquery.min'
//  import './assets/bootstrap/bootstrap.min'
//  import './assets/AdminLTE/js/adminlte.min'
import Chat from '@/Chat'

  export default {
    name: 'auth',
    components: {
      Chat,
    },
    created () {
    }
  }
</script>

<style src="#/assets/bootstrap/css/bootstrap.min.css"></style>
<style src="#/assets/adminlte/css/adminlte.min.css"></style>

<style lang="scss">
  body { background: #d2d6de !important; }




  .notifications { margin-top: 87px; margin-right: 10px; }
  .vue-notification { padding: 17px 10px; margin: 5px 3px; font-size: 16px !important; box-shadow: 2px 2px 6px -3px #000;
    color: #ffffff; background: #44A4FC; border-left: 5px solid #187FE7; cursor: pointer;
    &.warn { background: #ffb648; border-left-color: #f48a06; }
    &.error { background: #E54D42; border-left-color: #B82E24; }
    &.success { background: #68CD86; border-left-color: #42A85F; }}
</style>
