<template>
</template>

<script>
import Chat from './Chat'
export default {
  components: {
    Chat
  },
  props: ['users'],
  data () {
    return {
      currentUser: {}
    }
  },
  computed: {

  },
  beforeMount () {
  },
  methods: {
    openChat (user) {
      this.currentUser = user
    }
  }
}
</script>

<style lang="scss" scoped>
.friends-box {
  width: 200px;
  height: 400px;
  background: green;
}
</style>
