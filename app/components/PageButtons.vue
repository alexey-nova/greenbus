<template>
  <div class="row buttons">
    <div class="col-lg-12">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  export default {
    props: [
      'title',
      'subtitle'
    ]
  }
</script>

<style lang="scss" scoped>
  .buttons { margin-top: 10px; margin-bottom: 10px; }
  .buttons>div { text-align: right; }
</style>