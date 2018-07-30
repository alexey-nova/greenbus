<template>
  <div class="header-box">
    <div class="header-box-left">
      <a class="logo" @click="toggleOrLink()">
        <img src="~assets/img/logo.png">
      </a>
      <div class="top_menu_left">
        <router-link :to="{name: 'index'}" :class="[{active: $isRoute('index')}, 'menu-item']">
          <div class="center">
            <img src="~assets/img/header/1.png">
            <span>Рабочий стол</span>
          </div>
        </router-link>
        <router-link :to="{name: 'users'}" :class="[{active: $isRoute('users')}, 'menu-item']">
          <div class="center">
            <img src="~assets/img/header/2.png">
            <span>Сотрудники</span>
          </div>
        </router-link>
        <router-link :to="{name: 'tasksByFilter', params: { param1: 'in' }}" :class="['menu-item', { active: ($isRoute(['tasks', 'tasksByFilter'])) }]">
          <div class="center">
            <img src="~assets/img/header/3.png">
            <span>Задачи</span>
          </div>
        </router-link>
        <router-link :class="['menu-item', { active: $isRoute(['documents', 'documentsByFilter', 'folder', 'contragents', 'freebids', 'freebidsByFilter']) }]" :to="{name: 'documentsByFilter', params: { param1: 'in' }}">
          <div class="center">
            <img src="~assets/img/header/4.png">
            <span>Документы</span>
          </div>
        </router-link>
      </div>
    </div>
    <div class="top_menu_right">
      <router-link :to="{name: 'calendar'}" class="menu-item">
          <div class="center">
            <img src="~assets/img/header/6.png">
          </div>
      </router-link>
      <a class="menu-item chat-call pointer" @click="$store.commit('app/openChat')">
        <div class="center">
          <img src="~assets/img/header/7.png">
          <span class="notificationse" v-if="unreadMessagesCount && unreadMessagesCount > 0">{{ count }}</span>
        </div>
      </a>
      <a >
          <Notifications></Notifications>
      </a>
    </div>
  </div>
</template>

<script>
import Chat from '@/Chat'
import Notifications from './Notifications'

export default {
  name: 'Navigation',
  components: {
    Chat,
    Notifications
  },
  data () {
    return {
      unreadMessagesCount: this.$store.getters['app/unreadMessagesCount']
    }
  },
  computed: {
    count () {
      return this.$store.getters['app/unreadMessagesCount']
    }
  },
  methods: {
    getMessages () {
      this.$api('get', 'conversations').then(response => {
        this.unreadMessagesCount = response.data.conversations.map(c => c.unreadMessages).reduce((a, b) => a + b, 0)
        this.$store.commit('app/setUnreadMessagesCount', this.unreadMessagesCount)
      }).catch(err => console.log(err))
    },
    toggleOrLink () {
      if (window.innerWidth > 414) {
        this.$router.push({
          name: 'index'
        })
      }
      if (window.innerWidth <= 414) {
        var current = document.getElementById('nav')
        if (current) {
          current.className += ' active'
        }
      }
    }
  },
  mounted () {
    this.getMessages()
  },
  sockets: {
    newMessage (data) {
      this.$store.commit('app/setUnreadMessagesCount', ++this.unreadMessagesCount)
      this.notify('У вас новое сообщение')
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
