<script>

  export default {
    data () {
      return {
        content: ''
      }
    },
    methods: {
      onKeyup (e) {
        if (!e.ctrlKey && e.keyCode === 13 && this.content.length) {
          this.$emit('sendMessage', this.content)
          this.content = ''
        }
        if (e.ctrlKey && e.keyCode === 13 && this.content.length) {
          this.content = this.content + '\n'
        }
      }
    }
  }
</script>

<template>
  <div class="text">
    <textarea placeholder="Отправьте сообщение..." v-model="content" @keyup="onKeyup"></textarea>
  </div>
</template>

<style lang="scss" scoped>
  .text {
    height: 100px;
    border-top: solid 1px #ddd;

    textarea {
      padding: 10px;
      height: 100%;
      width: 100%;
      border: none;
      outline: none;
      resize: none;
    }
  }
</style>