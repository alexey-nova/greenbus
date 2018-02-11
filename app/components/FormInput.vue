<template>
  <div :class="['form-group', {'has-error': errors.has(name)}]">
    <label :for="'field-'+name">{{ title }}{{ require ? ' *' : '' }}</label>

    <slot></slot>

    <span v-show="errors.has(name)" class="help-block">{{ errors.first(name) }}</span>
  </div>
</template>

<script>
  export default {
    props: {
      title: String,
      name: String,
      require: Boolean,
    },
    methods: {
      input (value) {
        this.$emit('input', value)
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>