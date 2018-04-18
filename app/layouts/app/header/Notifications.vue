<template>
  <div class="navbar-custom-menu">
    <ul class="nav navbar-nav">
      <li class="dropdown notifications-menu" v-click-outside="close">
        <a href="#" class="dropdown-toggle" data-toggle="dropdown" @click="toggle">
          <i class="fa fa-bell-o fa-2x"></i>
          <span v-if="$_.size(pending)" class="label label-warning">{{$_.size(pending)}}</span>
        </a>
        <ul v-if="isOpen" class="dropdown-menu">
          <li class="header"><strong>Уведомления</strong></li>
          <li>
            <ul class="menu">
              <li v-for="n in pending" :key="n._id">
                <a v-if="n.module" href="#" @click="goTo(n.module.moduleType, { moduleId: n.module.moduleId })">
                  {{n.description}}
                </a>
                <p v-else>
                  {{n.description}}
                </p>
              </li>
              <li v-if="$_.size(pending)"><a class="read-all" href="#" @click="readNots">Прочитать все уведомления</a></li>
              <li v-if="!$_.size(pending)"><a href="#">У вас нет уведомлений</a></li>
            </ul>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
  import ClickOutside from 'vue-click-outside'

  export default {
    data () {
      return {
        isOpen: false,
        pending: [],
      }
    },
    sockets: {
      notification: function (val) {
        if (this.$_.indexOf(val.to, this.$auth().user._id) !== -1) {
          this.pending.push(val)
          this.$notify(val.description, 'info')
        }
      },
    },
    methods: {
      toggle () {
        this.isOpen = !this.isOpen
      },
      close () {
        this.isOpen = false
      },
      loadNots () {
        this.$api('get', 'notifications').then(response => {
          console.log(response.data)
          this.pending = response.data.pending
        }).catch(e => {})
      },
      readNots () {
        this.$api('post', 'notifications').then(response => {
          this.loadNots()
        }).catch(e => {})
      },
      goTo (location, context) {
        console.log(context.moduleId)
        if (location === 'tasks') return this.$router.push({ name: 'tasks', query: { type: 'show', task: context.moduleId }})
        // else if (location === 'memos') return this.$router.push({ name: 'memos', query: { type: 'show', memo: context.moduleId }})
        // else if (location === 'meetings') return this.$router.push({ name: 'meetings', query: { type: 'show', meeting: context.moduleId }})
      }
    },
    mounted () {
      this.loadNots()
    },
    directives: {
      ClickOutside
    }
  }
</script>

<style lang="scss" scoped>
  .dropdown-menu { display: block; }
  .read-all { text-decoration: underline !important; }
</style>