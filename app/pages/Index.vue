<template>
  <div>
    <PageTitle :title="$trans('pages.index.pageTitle')"></PageTitle>

    <div class="box">
      <!--<BoxHeader title="" :controls="['collapse']"></BoxHeader>-->
      <div class="box-body">
        {{msg}}
      </div>
    </div>
  </div>
</template>

<script>
  import PageTitle from '@/PageTitle'
  import Tip from '@/Tip'

  export default {
    components: {
      PageTitle,
      Tip,
    },
    data () {
      return {
        seoTitle: this.$trans('pages.index.seoTitle'),
        msg: '',
      }
    },
    mounted () {
      _.delay(() => {
        this.msg = 'home page'
      }, 100)
    },
    methods: {
      click () {
      }
    }
  }
</script>

<style scoped>

</style>