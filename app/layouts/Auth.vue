<template>
  <div>

    <Chat></Chat>
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
</style>
