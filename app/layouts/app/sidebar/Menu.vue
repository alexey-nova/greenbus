<template>
  <ul class="list" data-widget="tree">
    <li v-for="item in sidebar" :key="item.name" :class="[{active: item.isActive(), 'menu-open': item.isActive() && item.children, 'treeview': item.children,}]">

      <router-link v-if="item.children" :to="item.link">
        <img :src="require(`assets/img/left_menu/${item.imgSrc}`)"> <span>{{item.name}}</span>
      </router-link>

      <ul v-if="item.children" :key="item.name" class="treeview-menu">
        <li v-for="(child, index) in item.children" :key="index" :class="[{active: child.isActive(), 'menu-open': child.isActive() && child.children}]">
          <router-link :to="child.link">
            <img :src="require(`assets/img/left_menu/${item.imgSrc}`)"> <span>{{child.name}}</span>
          </router-link>
        </li>
      </ul>

      <router-link v-if="!item.children" :to="item.link">
        <img :src="require(`assets/img/${item.imgSrc}`)"> <span>{{item.name}}</span>
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
              link: {name: 'tasksByFilter', params: {param1: 'in'}},
              name: 'Входящие',
              imgSrc: '3.png',
              isActive: () => this.$isRoute('tasksByFilter', 'param1', 'in'),
            },
            {
              link: {name: 'tasksByFilter', params: {param1: 'out'}},
              name: 'Исходящие',
              imgSrc: '4.png',
              isActive: () => this.$isRoute('tasksByFilter', 'param1', 'out'),
            },
            {
              link: {name: 'tasksByFilter', params: {param1: 'urgent'}},
              name: 'Срочные',
              imgSrc: '5.png',
              isActive: () => this.$isRoute('tasksByFilter', 'param1', 'urgent'),
            },
            {
              link: {name: 'tasksByFilter', params: {param1: 'confirmation'}},
              name: 'На согласовании',
              imgSrc: '6.png',
              isActive: () => this.$isRoute('tasksByFilter', 'param1', 'confirmation'),
            },
            {
              link: {name: 'tasksByFilter', params: {param1: 'complete'}},
              name: 'Завершенные',
              imgSrc: '7.png',
              isActive: () => this.$isRoute('tasksByFilter', 'param1', 'complete'),
            },
            {
              link: {name: 'tasksByFilter', params: {param1: 'deadlined'}},
              name: 'Просроченные',
              imgSrc: '3.png',
              isActive: () => this.$isRoute('tasksByFilter', 'param1', 'deadlined'),
            },
            {
              link: {name: 'tasks'},
              name: 'Все',
              imgSrc: '1.png',
              isActive: () => this.$isRoute('tasks'),
            }
          ],
          documents: [
            {
              name: 'Служебные записки',
              link: {name: 'documents'},
              isActive: () => this.$isRoute(['documents', 'documentsByFilter']),
              children: [
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
                {
                  link: {name: 'documents'},
                  name: 'Все',
                  isActive: () => this.$isRoute('documents'),
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
          panel: [
            {
              link: { name: 'panel', params: { param1: 'departments' }},
              name: 'Департаменты/Отделы',
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
</style>
