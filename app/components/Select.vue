<template>
  <div :class="['form-group', {'has-error': errors.has(name)}]">
    <label :for="'field-'+name">{{ title }}{{ require ? ' *' : '' }}</label>
    <select :id="'field-'+name" class="form-control" v-validate="validate" :name="name" v-model="model.department">
      <option v-for="option in options" :value="dep.name">{{option.name}}</option>
    </select>
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
      options: Array,
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