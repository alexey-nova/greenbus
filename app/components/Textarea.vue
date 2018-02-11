<template>
  <div :class="['form-group', {'has-error': errors.has(name)}]">
    <label :for="'field-'+name">{{ title }}{{ require ? ' *' : '' }}</label>
    <textarea :id="'field-'+ name" class="form-control" rows="4" v-validate="validate" :name="name" :value="value" @input="input($event.target.value)"></textarea>
    <span v-show="errors.has(name)" class="help-block">{{ errors.first(name) }}</span>
  </div>
</template>

<script>
  export default {
    props: {
      title: String,
      value: String,
      name: String,
      validate: String,
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