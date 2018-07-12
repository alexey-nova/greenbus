<template>
  <ul class="list" data-widget="tree">
    <li v-for="item in sidebar" :key="item.name" :class="[{active: item.isActive(), 'menu-open': item.isActive() && item.children, 'treeview': item.children,}]">

      <router-link v-if="item.children" :to="item.link">
        <img :src="require(`assets/img/${item.imgSrc}`)"> <span :class="{'active-span': item.isActive()}">{{item.name}}</span>
      </router-link>
      <Tree :item="item"></Tree>

      <router-link v-if="!item.children" :to="item.link">
        <img :src="require(`assets/img/${item.imgSrc}`)"> <span>{{item.name}}</span>
      </router-link>
    </li>
  </ul>
</template>

<script>
import Tree from './Tree'

  export default {
    components: {
      Tree
    },
    data () {
      return {
        sidebarData: {
          users: [],
          tasks: [
            {
              link: {name: 'tasksByFilter', params: {param1: 'in'}},
              name: 'Входящие',
              imgSrc: 'left_menu/3.png',
              isActive: () => this.$isRoute('tasksByFilter', 'param1', 'in'),
            },
            {
              link: {name: 'tasksByFilter', params: {param1: 'out'}},
              name: 'Исходящие',
              imgSrc: 'left_menu/4.png',
              isActive: () => this.$isRoute('tasksByFilter', 'param1', 'out'),
            },
            {
              link: {name: 'tasksByFilter', params: {param1: 'urgent'}},
              name: 'Срочные',
              imgSrc: 'left_menu/5.png',
              isActive: () => this.$isRoute('tasksByFilter', 'param1', 'urgent'),
            },
            {
              link: {name: 'tasksByFilter', params: {param1: 'confirmation'}},
              name: 'На согласовании',
              imgSrc: 'left_menu/6.png',
              isActive: () => this.$isRoute('tasksByFilter', 'param1', 'confirmation'),
            },
            {
              link: {name: 'tasksByFilter', params: {param1: 'complete'}},
              name: 'Завершенные',
              imgSrc: 'left_menu/7.png',
              isActive: () => this.$isRoute('tasksByFilter', 'param1', 'complete'),
            },
            {
              link: {name: 'tasksByFilter', params: {param1: 'deadlined'}},
              name: 'Просроченные',
              imgSrc: 'left_menu/deadlined.png',
              isActive: () => this.$isRoute('tasksByFilter', 'param1', 'deadlined'),
            },
            {
              link: {name: 'tasks'},
              name: 'Все',
              imgSrc: 'left_menu/1.png',
              isActive: () => this.$isRoute('tasks'),
            }
          ],
          documents: [
            {
              name: 'Служебные записки',
              link: {name: 'documents'},
              imgSrc: 'left_menu/1.png',
              isActive: () => this.$isRoute(['documents', 'documentsByFilter']),
              children: [
                {
                  link: {name: 'documentsByFilter', params: {param1: 'in'}},
                  name: 'Входящие',
                  imgSrc: 'left_menu/3.png',
                  isActive: () => this.$isRoute('documentsByFilter', 'param1', 'in'),
                },
                {
                  link: {name: 'documentsByFilter', params: { param1: 'out' }},
                  name: 'Исходящие',
                  imgSrc: 'left_menu/3.png',
                  isActive: () => this.$isRoute('documentsByFilter', 'param1', 'out'),
                },
                {
                  link: {name: 'documentsByFilter', params: { param1: 'on' }},
                  name: 'На согласовании',
                  imgSrc: 'left_menu/3.png',
                  isActive: () => this.$isRoute('documentsByFilter', 'param1', 'on'),
                },
                {
                  link: { name: 'documentsByFilter' , params: { param1: 'deadlined' }},
                  name: 'Просроченные',
                  imgSrc: 'left_menu/3.png',
                  isActive: () => this.$isRoute('documentsByFilter', 'param1', 'deadlined'),
                },
                {
                  link: { name: 'documentsByFilter' , params: { param1: 'done' }},
                  name: 'Завершенные',
                  imgSrc: 'left_menu/3.png',
                  isActive: () => this.$isRoute('documentsByFilter', 'param1', 'done'),
                },
                {
                  link: {name: 'documents'},
                  name: 'Все',
                  imgSrc: 'left_menu/3.png',
                  isActive: () => this.$isRoute('documents'),
                },
              ],
            },
            {
              link: {name: 'contragents'},
              name: 'Контрагенты',
              imgSrc: 'left_menu/3.png',
              isActive: () => this.$isRoute(['folder', 'contragents']),
            }
          ],
          panel: [
            {
              link: { name: 'panel', params: { param1: 'departments' }},
              name: 'Департаменты/Отделы',
              imgSrc: 'left_menu/3.png',
              isActive: () => this.$isRoute('panel', 'param1', 'departments'),
            },
          ]
        }
      }
    },
    computed: {
      sidebar () {
        let sidebar = this.$store.state.app.sidebar
        if (!this.$_.isArray(sidebar)) {
          sidebar = this.sidebarData[sidebar]
        }
        return sidebar
      }
    }
  }
</script>

<style lang="scss" scoped>
.active-span {
  color :#1b8442 !important;
}
</style>
