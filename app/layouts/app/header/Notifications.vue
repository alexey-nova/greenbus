<template>
  <div class="navbar-custom-menu">
    <ul class="nav navbar-nav">
      <li class="dropdown notifications-menu">
        <a href="#" class="dropdown-toggle" data-toggle="dropdown">
          <i class="fa fa-bell-o fa-2x"></i>
          <span v-if="$_.size(pending)" class="label label-warning">{{$_.size(pending)}}</span>
        </a>
        <ul class="dropdown-menu">
          <li class="header"><strong>Уведомления</strong></li>
          <li>
            <ul class="menu">
              <li v-for="n in pending">
                <a href="#">
                  <!--<i class="fa fa-users text-aqua"></i> 5 new members joined today-->
                  {{n.description}}
                </a>
              </li>
              <li v-if="!$_.size(pending)"><a href="#">У вас нет уведомлений</a></li>
            </ul>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        pending: [],
      }
    },
    methods: {
      loadNots () {
        this.$api('get', 'notifications').then(response => {
          this.pending = response.data.pending
//          console.log(this.pending)
        }).catch(e => {
        })
      },
      listen () {
        this.loadNots()
        this.$_.delay(() => {
          this.listen()
        }, 15000)
      }
    },
    mounted () {
      this.listen()
    },
  }
</script>

<style lang="scss" scoped>

</style>