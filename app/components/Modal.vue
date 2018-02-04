<template>
  <Animation enter="fadeIn">
    <div v-if="isOpen" class="modal show" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <form @submit="submit">

            <div class="modal-header">
              <slot name="header"></slot>
            </div>

            <div class="modal-body">
              <slot name="content"></slot>
            </div>

            <div class="modal-footer">
              <slot name="footer"></slot>
            </div>

          </form>
        </div>
      </div>
    </div>
  </Animation>
</template>

<script>
  import Animation from '@/Animation'

  export default {
    components: {
      Animation,
    },
    props: [
      'isOpen',
      'onSubmit',
      'onClose'
    ],
    methods: {
      submit (event) {
        event.preventDefault()
        this.$emit('onSubmit')
      }
    }
  }
</script>

<style lang="scss" scoped>
</style>