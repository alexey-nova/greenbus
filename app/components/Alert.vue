<template>
  <transition name="fade">
    <div v-if="data.isShowed" class="tip">
      <div class="row">
        <div class="col-md-6 col-md-offset-6">
          <div :class="['callout', 'callout-' + data.type]" @click="onClose">
            <h4 v-if="data.title">{{data.title}}</h4>
            <p v-if="data.content">{{data.content}}</p>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  export default {
    data () {
      return {}
    },
    computed: {
      data () {
        return this.$store.state.app.alert
      }
    },
    methods: {
      onClose () {
        this.$store.commit('app/hideAlert')
      }
    },
  }
</script>

<style lang="scss" scoped>
  .tip { position: fixed; width: 100%; z-index: 9999; margin-top: 10vh; text-align: right; }
  .callout { display: inline-block; cursor: pointer; box-shadow: 3px 3px 3px #777; font-size: 1.2em; opacity: 0.9; padding: 15px 70px; margin: 0 40px; }

  .fade-enter-active, .fade-leave-active {
    transition: opacity 0.7s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
</style>