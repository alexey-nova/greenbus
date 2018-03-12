<template>
  <div class="friends-box">
    <div v-for="(user, i) in users" :key="i" @click="openChat(user)">
      {{user.fullname}} {{msgCount[i]}}
    </div>
    <!-- <FriendsList></FriendsList> -->
    <Chat :user="currentUser" v-if="currentUser._id"></Chat>
  </div>
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
      msgCount () {
        var tempArr = []
        var tempCount = 0
        this.users.forEach(item => {
          tempCount = this.$store.getters['message/getUnreadMessages'](item._id)
          if (tempCount.length === 0) tempArr.push(0)
          else tempArr.push(tempCount[0].messages.length)
        })
        return tempArr
      }
    },
    beforeMount () {
      console.log(this.$store.getters['message/getUnreadMessages']('5a7d7sds72ffda86e8c25fd0d'))
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
