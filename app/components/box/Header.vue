<template>
  <div class="box-header with-border">
    <h3 class="box-title">{{title}}</h3>

    <div class="box-tools pull-right">
      <button v-if="collapse" type="button" class="btn btn-box-tool" data-widget="collapse" data-toggle="tooltip" title="Collapse">
        <i :class="trans('minus')"></i></button>

      <button v-if="close" type="button" class="btn btn-box-tool" data-widget="remove" data-toggle="tooltip" title="Remove">
        <i :class="trans('cross')"></i></button>
    </div>
  </div>
</template>

<script>
  export default {
    props: [
      'title',
      'controls',
    ],
    computed: {
      collapse () {
        return this.controls.indexOf('collapse') !== -1
      },
      close () {
        return this.controls.indexOf('close') !== -1
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>