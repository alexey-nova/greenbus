<template>
  <li class="dropdown user user-menu">
    <a href="#" class="dropdown-toggle" data-toggle="dropdown">
      <img :src="{avatar}" class="user-image" alt="User Image">
      <span class="hidden-xs">Alexander Pierce</span>
    </a>
    <ul class="dropdown-menu">
      <!-- User image -->
      <li class="user-header">
        <img :src="{avatar}" class="img-circle" alt="User Image">
        <p>
          Alexander Pierce - Web Developer
          <small>Member since Nov. 2012</small>
        </p>
      </li>
      <!-- Menu Body -->
      <li class="user-body">
        <div class="row">
          <div class="col-xs-4 text-center">
            <a href="#">{{trans('followers')}}</a>
          </div>
          <div class="col-xs-4 text-center">
            <a href="#">Sales</a>
          </div>
          <div class="col-xs-4 text-center">
            <a href="#">Friends</a>
          </div>
        </div>
      </li>
      <!-- Menu Footer-->
      <li class="user-footer">
        <div class="pull-left">
          <a href="#" class="btn btn-default btn-flat">Profile</a>
        </div>
        <div class="pull-right">
          <a href="#" class="btn btn-default btn-flat">Sign out</a>
        </div>
      </li>
    </ul>
  </li>
</template>

<script>
  import avatar from '../../../assets/design/avatar.jpg'
  export default {}
</script>

<style lang="scss" scoped>

</style>