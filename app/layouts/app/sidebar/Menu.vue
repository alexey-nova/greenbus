<template>
  <ul class="sidebar-menu" data-widget="tree">
    <li v-for="item in sidebar" :key="item.name" :class="[{active: item.isActive(), 'menu-open': item.isActive() && item.children, 'treeview': item.children,}]">

      <router-link v-if="item.children" :to="item.link">
        <i class="fa fa-folder"></i> <span>{{item.name}}</span>
      </router-link>

      <ul v-if="item.children" :key="item.name" class="treeview-menu">
        <li v-for="(child, index) in item.children" :key="index" :class="[{active: child.isActive(), 'menu-open': child.isActive() && child.children}]">
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
    data () {
      return {
        sidebarData: {
          users: [],
          tasks: [
            {
              link: {name: 'tasks'},
              name: 'Все',
              isActive: () => this.$isRoute('tasks'),
            },
            {
              link: {name: 'tasksByFilter', params: {param1: 'in'}},
              name: 'Входящие',
              isActive: () => this.$isRoute('tasksByFilter', 'param1', 'in'),
            },
            {
              link: {name: 'tasksByFilter', params: {param1: 'out'}},
              name: 'Исходящие',
              isActive: () => this.$isRoute('tasksByFilter', 'param1', 'out'),
            },
            {
              link: {name: 'tasksByFilter', params: {param1: 'urgent'}},
              name: 'Срочные',
              isActive: () => this.$isRoute('tasksByFilter', 'param1', 'urgent'),
            },
            {
              link: {name: 'tasksByFilter', params: {param1: 'confirmation'}},
              name: 'На согласовании',
              isActive: () => this.$isRoute('tasksByFilter', 'param1', 'confirmation'),
            },
            {
              link: {name: 'tasksByFilter', params: {param1: 'complete'}},
              name: 'Завершенные',
              isActive: () => this.$isRoute('tasksByFilter', 'param1', 'complete'),
            },
            {
              link: {name: 'tasksByFilter', params: {param1: 'deadlined'}},
              name: 'Просроченные',
              isActive: () => this.$isRoute('tasksByFilter', 'param1', 'deadlined'),
            },
          ],
          documents: [
            {
              name: 'Служебные записки',
              link: {name: 'documents'},
              isActive: () => this.$isRoute(['documents', 'documentsByFilter']),
              children: [
                {
                  link: {name: 'documents'},
                  name: 'Все',
                  isActive: () => this.$isRoute('documents'),
                },
                {
                  link: {name: 'documentsByFilter', params: {param1: 'in'}},
                  name: 'Входящие',
                  isActive: () => this.$isRoute('documentsByFilter', 'param1', 'in'),
                },
                {
                  link: {name: 'documentsByFilter', params: {param1: 'out'}},
                  name: 'Исходящие',
                  isActive: () => this.$isRoute('documentsByFilter', 'param1', 'out'),
                },
                {
                  link: {name: 'documentsByFilter', params: {param1: 'confirmation'}},
                  name: 'На согласовании',
                  isActive: () => this.$isRoute('documentsByFilter', 'param1', 'confirmation'),
                },
              ],
            },
            // {
            //   name: 'Платежный календарь',
            //   link: { name: 'ps' },
            //   isActive: () => this.$isRoute(['folder', 'ps', 'psByFilter']),
            //   children: [
            //     {
            //       link: { name: 'ps' },
            //       name: 'Все',
            //       isActive: () => this.$isRoute('ps'),
            //     },
            //     {
            //       link: { name: 'psByFilter', params: { param1: 'in' }},
            //       name: 'Входящие',
            //       isActive: () => this.$isRoute('psByFilter', 'param1', 'in'),
            //     },
            //     {
            //       link: { name: 'psByFilter', params: { param1: 'out' }},
            //       name: 'Исходящие',
            //       isActive: () => this.$isRoute('psByFilter', 'param1', 'out'),
            //     },
            //     {
            //       link: { name: 'psByFilter', params: { param1: 'confirmation' }},
            //       name: 'На согласовании',
            //       isActive: () => this.$isRoute('psByFilter', 'param1', 'confirmation'),
            //     },
            //     {
            //       link: { name: 'psByFilter', params: { param1: 'confirmed' }},
            //       name: 'Согласованные',
            //       isActive: () => this.$isRoute('psByFilter', 'param1', 'confirmed'),
            //     }
            //   ]
            // },
            {
              link: {name: 'contragents'},
              name: 'Контрагенты',
              isActive: () => this.$isRoute(['folder', 'contragents']),
            }
          ],
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
</style>
