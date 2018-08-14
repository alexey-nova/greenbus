<template>
  <header>
  	<div class="header-box">
	    <div class="header-box-left">
	    	<router-link to="/" class="logo mob-none">
	    		<img src="~assets/img/maint.png" class="logo-img">
	    	</router-link>
	      <a class="logo mob-block" @click="toggleSidebar()">
	        <img src="~assets/img/maint.png" class="logo-img">
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
	      <a>
	        <app-notifications></app-notifications>
	      </a>
	    </div>
	  </div>
  </header>
</template>

<script>
import Notifications from './header/Notifications'

export default {
  name: 'app-naviagation',
  components: {
    'app-notifications': Notifications
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
    toggleSidebar () {
    	this.$store.commit('app/toggleMobSidebar')
    }
  },
  mounted () {
    this.getMessages()
  },
  sockets: {
    newMessage (data) {
      let count = this.$store.getters['app/unreadMessagesCount']
      this.$store.commit('app/setUnreadMessagesCount', ++count)
      this.notify('У вас новое сообщение')
    }
  }
}
</script>

<style lang="scss" scoped>
.mob-none .logo-img {
  width: 200px !important;
  height: 40px !important;
  object-fit: contain;
}

.mob-block .logo-img {
  width: 140px !important;
  height: 40px !important;
  object-fit: contain;
}
</style>
