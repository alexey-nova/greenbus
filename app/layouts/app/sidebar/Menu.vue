<template>
  <ul class="sidebar-menu" data-widget="tree">
    <li v-for="item in sidebar" :class="[{active: item.isActive(), 'menu-open': item.isActive() && item.children, 'treeview': item.children,}]">

      <a v-if="item.children">
        <i class="fa fa-folder"></i> <span>{{item.name}}</span>
      </a>
      <ul v-if="item.children" class="treeview-menu">
        <li v-for="child in item.children" :class="[{active: child.isActive(), 'menu-open': child.isActive() && child.children}]">
          <router-link :to="child.link">
            <i class="fa fa-folder"></i> <span>{{child.name}}</span>
          </router-link>
        </li>
      </ul>

      <router-link v-if="!item.children" :to="item.link">
        <i class="fa fa-folder"></i> <span>{{item.name}}</span>
      </router-link>
    </li>
  </ul>
</template>

<script>
  export default {
    computed: {
      sidebar () {
        return this.$store.state.app.sidebar
      }
    }
  }
</script>

<style lang="scss" scoped>
</style>