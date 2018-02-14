<template>
  <div class="chat-box">
    <textarea v-model="text"></textarea>
    <button type="button" name="send" @click="sendMessage">send</button>
  </div>
</template>

<script>
  export default {
    props: ['user'],
    data () {
      return {
        text: ''
      }
    },
    methods: {
      sendMessage () {
        this.$api('post', `conversations/new/${this.user._id}`, { message: this.text }).then(response => {
          console.log(response)
        }).catch(e => {

        })
      }
    }
  }
</script>

<style lang="scss" scoped>
.chat-box {
  width: 200px;
  height: 400px;
  background: red;
}
</style>
