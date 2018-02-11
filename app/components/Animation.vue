<template>
  <transition name="animate" v-bind="classes">
    <slot></slot>
  </transition>
</template>

<script>
  import 'animate.css'

  export default {
    props: ['enter', 'leave'],
    computed: {
      classes () {
        let classes = {}
        if (this.$props.enter) {
          classes['enter-active-class'] = 'animated ' + this.$props.enter
        }
        if (this.$props.leave) {
          classes['leave-active-class'] = 'animated ' + this.$props.leave
        }
        return classes
      },
    }
  }
</script>

<style lang="scss" scoped>

</style>