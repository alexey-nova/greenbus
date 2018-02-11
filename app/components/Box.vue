<template>
  <div :class="['box', classType]">
    <BoxHeader v-if="title" :title="title" :controls="['collapse']"></BoxHeader>
    <div class="box-body">
      <slot></slot>
    </div>
    <BoxFooter v-if="footer" :content="footer"></BoxFooter>
  </div>
</template>

<script>
  import BoxHeader from './box/Header'
  import BoxFooter from './box/Footer'

  export default {
    components: {
      BoxHeader,
      BoxFooter,
    },
    props: [
      'title',
      'controls',
      'footer',
      'type',
    ],
    computed: {
      classType () {
        return (this.$props.type) ? ' box-' + this.$props.type : ''
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>