<template>
  <ul class="nav navbar-nav">
    <li :class="[{active: $isRoute('index')}, 'nav-item']">
      <router-link class="nav-link" :to="{name: 'index'}" :style="{color: colors['index']}">
        <i class="fa fa-home fa-2x"></i>
        <div>Рабочий стол</div>
      </router-link>
    </li>
    <li :class="[{active: $isRoute(['users', 'usersByDep'])}, 'nav-item']">
      <router-link class="nav-link" :to="{name: 'users'}" :style="{color: colors['users']}">
        <i class="fa fa-user fa-2x"></i>
        <div>Сотрудники</div>
      </router-link>
    </li>
    <li :class="[{active: $isRoute(['tasks', 'tasksByFilter'])}, 'nav-item']">
      <router-link class="nav-link" :to="{name: 'tasks'}" :style="{color: colors['tasks']}">
        <i class="fa fa-calendar-check-o fa-2x"></i>
        <div>Задачи</div>
      </router-link>
    </li>
    <li :class="[{active: $isRoute(['documents', 'documentsByFilter', 'folder', 'contragents', 'ps', 'psByFilter'])}, 'nav-item']">
      <router-link class="nav-link" :to="{name: 'documents'}" :style="{color: colors['documents']}">
        <i class="fa fa-file-text-o fa-2x"></i>
        <div>Документы</div>
      </router-link>
    </li>
    <li :class="[{active: $isRoute(['calendar'])}, 'nav-item']">
      <router-link class="nav-link" :to="{name: 'calendar'}" :style="{color: colors['calendar']}">
        <i class="fa fa-calendar fa-2x"></i>
        <div>Ежедневник</div>
      </router-link>
    </li>

  </ul>
</template>

<script>
  export default {
    data () {
      return {
        colors: {
          index: '#8487b7',
          users: '#5b9b64',
          usersByDep: '#5b9b64',
          tasks: '#9b340c',
          tasksByFilter: '#9b340c',
          documents: '#a5a52f',
          documentsByFilter: '#a5a52f',
          calendar: '#1b73c9',
          folder: '#a5a52f',
          contragents: '#a5a52f',
          ps: '#a5a52f',
          psByFilter: '#a5a52f',
        }
      }
    },
    calculate: {
      color () {

      }
    },
    methods: {
      changeColor () {
        let color = this.colors[this.$route.name]
        this.$store.commit('app/setHeaderColor', color)
      }
    },
    mounted () {
      this.changeColor()
    },
    watch: {
      '$route' (to, from) {
        this.changeColor()
      }
    },
  }
</script>

<style lang="scss" scoped>

</style>
