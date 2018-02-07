<template>
  <Animation enter="fadeIn">
    <div v-if="isOpen" :class="['modal', 'show'].concat(typeClasses)" tabindex="-1" role="dialog" aria-hidden="true">
      <div :class="['modal-dialog']" role="document">
        <div class="modal-content">
          <form @submit="submit">

            <div v-if="$slots.header" class="modal-header">
              <slot name="header"></slot>
            </div>

            <div v-if="$slots.content" class="modal-body">
              <slot name="content"></slot>
            </div>

            <div v-if="$slots.footer" class="modal-footer">
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
    props: {
      isOpen: {},
      type: {},
      onSubmit: {
        default: () => {}
      },
      onClose: {},
    },
    computed: {
      typeClasses () {
        let type = this.$props.type
        let classes = []
        if (this.$_.isArray(type)) {
          classes = this.$_.map(type, t => 'type-' + t)
        } else {
          classes = (type) ? ['type-' + type] : []
        }
        return classes
      },
    },
    methods: {
      submit (event) {
        event.preventDefault()
        this.$emit('onSubmit')
      }
    },
    watch: {
      isOpen () {
        if (this.$props.isOpen) {
          document.body.classList.add('modal-open')
        } else {
          document.body.classList.remove('modal-open')
        }
      }
    }
  }
</script>

<style lang="scss">
  .modal.type-lg .modal-dialog { max-width: 900px; width: auto; }

  .modal.type-read-only .form-control[readonly] { background: #fff }
</style>