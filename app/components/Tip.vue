<template>
  <div class="tip">
    <div class="row">
      <div class="col-md-6 col-md-offset-3">
        <div :class="['callout', 'callout-' + color]">
          <h4 v-if="title">{{title}}</h4>
          <p v-if="content">{{content}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
      }
    },
    props: ['title', 'content', 'color']
  }
</script>

<style lang="scss" scoped>
  .tip { position: fixed; width: 100%; z-index: 9999; margin-top: 10vh; text-align: center; }
  .callout { display: inline-block; cursor: pointer; }
</style>