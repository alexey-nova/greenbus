<template>
  <div class="menu-item notifications-call">
    <div class="center" @click="toggle">
      <img src="~assets/img/header/8.png" :class="[{'wobble animated infinite': $_.size(pending)}]">
      <span class="notificationse" v-if="$_.size(pending)" :class="[{'wobble animated infinite': $_.size(pending)}]">{{$_.size(pending)}}</span>
    </div>
    <div v-if="isOpen" v-click-outside="close">
      <div class="not-bg"></div>
      <div class="notifications-box">
        <div class="notifications-block">
          <ul>
            <li class="bold">Уведомления</li>
          </ul>
          <ul class="notifications-menu">
            <li v-for="n in pending" :key="n._id" class="notifications-menu-left">
              <a v-if="n.module" @click="goTo(n.module.moduleType, { moduleId: n.module.moduleId })" v-html="n.description">
              </a>
              <p v-else v-html="n.description">
              </p>
            </li>
            <li v-if="$_.size(pending)"><a class="read-all" @click="readNots">Прочитать все уведомления</a></li>
            <li v-if="!$_.size(pending)"><a href="#">У вас нет уведомлений</a></li>
          </ul>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import ClickOutside from 'vue-click-outside'

export default {
  data () {
    return {
      isOpen: false,
      pending: []
    }
  },
  sockets: {
    notification: function (val) {
      if (this.$_.indexOf(val.to, this.$auth().user._id) !== -1) {
        this.pending.unshift(val)
        this.$notify(val.description, 'info')
      }
    }
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
        this.pending = response.data.pending
      }).catch(e => {})
    },
    readNots () {
      this.$api('post', 'notifications').then(response => {
        this.loadNots()
      }).catch(e => {})
    },
    readNotification (moduleId) {
      return this.$api('post', `notifications/${moduleId}`).then(response => {
        this.loadNots()
      })
    },
    goTo (location, context) {
      this.readNotification(context.moduleId).then(() => {
        if (location === 'tasks') return this.$router.push({ name: 'tasks', query: { type: 'show', task: context.moduleId }})
        else if (location === 'bids') return this.$router.push({ name: 'documents', query: { type: 'show', bid: context.moduleId }})
        else if (location === 'freebids') return this.$router.push({ name: 'freebids', query: { type: 'show', bid: context.moduleId }})
        else if (location === 'meetings') return this.$router.push({ name: 'calendar', query: { type: 'create', meeting: context.moduleId }})
      })
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
.notificationse {
  font-size: 1.3em;
  color: red;
}
</style>
