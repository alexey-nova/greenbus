<template>
  <div class="content-header">
    <Box>
      <div class="row">
        <!--<div class="col-lg-6">-->
          <!--<h1>-->
            <!--{{title}}-->
            <!--<small>{{subtitle}}</small>-->
          <!--</h1>-->
        <!--</div>-->
        <div class="col-lg-6 text-right">
          <ol class="breadcrumb">
            <li>
              <router-link class="nav-link" :to="{name: 'index'}">
                <i class="fa fa-home"></i>&nbsp;&nbsp;Рабочий стол
              </router-link>
            </li>
            <li class="active">{{title}}</li>
          </ol>
        </div>
      </div>
    </Box>
  </div>
</template>

<script>
  import Box from '@/Box'

  export default {
    components: {
      Box,
    },
    props: [
      'title',
      'subtitle'
    ]
  }
</script>

<style lang="scss" scoped>
  .content-header { padding: 0; }
  .content-header h1 { margin: 10px 0; font-size: 1.6em; }
  .content-header .breadcrumb { background: transparent; padding: 12px 8px; margin: 0; }
</style>