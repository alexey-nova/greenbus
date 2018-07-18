<template>
  <ul v-if="item.children" :key="item.name" class="treeview-menu" :style="[{margin: `10px`}, { display: item.isActive() ? 'block' : 'none' }]">
    <li v-for="(child, index) in item.children" :key="index" :class="[{active: child.isActive(), 'menu-open': child.isActive() && child.children, 'treeview': item.children}]">
      <router-link :to="child.link">
        <img v-if="child.isActive()" :src="item.imgSrc2 ? require(`assets/img/${item.imgSrc2}`) : require(`assets/img/${item.imgSrc}`)">
        <img v-else :src="item.imgSrc && require(`assets/img/${item.imgSrc}`)">
        <span :class="{'active-span': child.isActive()}">{{child.name}}</span>
      </router-link>
      <Tree :item="child"></Tree>
    </li>
  </ul>
</template>

<script>
import Tree from './Tree'
export default {
  name: 'Tree',
  components: {
    Tree
  },
  props: ['item', 'display']
}
</script>

<style>
.active-span {
  color :#1b8442;
}
</style>
