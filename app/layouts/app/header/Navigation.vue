<template>
  <!-- <ul class="nav navbar-nav">
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
      <router-link class="nav-link" :to="{name: 'tasksByFilter', params: { param1: 'in' }}" :style="{color: colors['tasks']}">
        <i class="fa fa-calendar-check-o fa-2x"></i>
        <div>Задачи</div>
      </router-link>
    </li>
    <li :class="[{active: $isRoute(['documents', 'documentsByFilter', 'folder', 'contragents', 'ps', 'psByFilter'])}, 'nav-item']">
      <router-link class="nav-link" :to="{name: 'documentsByFilter', params: { param1: 'in' }}" :style="{color: colors['documents']}">
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

  </ul> -->
  <div class="header-box">
		<div class="header-box-left">
			<div class="logo">
				<img src="~assets/img/logo.png">
			</div>
			<!-- <router-link :to="{name: 'index'}" class="logo">
				
			</router-link> -->
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
				<router-link :to="{name: 'tasksByFilter', params: { param1: 'in' }}" class="menu-item">
					<div class="center">
						<img src="~assets/img/header/3.png">
						<span>Задачи</span>
					</div>
				</router-link>
				<router-link :to="{name: 'index'}" class="menu-item">
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
								<span class="notificationse">+1</span>
						</div>
				</router-link>
				<a class="menu-item chat-call">
					<div class="center">
						<img src="~assets/img/header/7.png">
						<span class="notificationse">+22</span>
					</div>
				</a>
				<a href="#" class="menu-item notifications-call">
					<div class="center">
						<img src="~assets/img/header/8.png">
						<span class="notificationse">+13</span>
					</div>
				</a>
		</div>

		<!--Уведомления-->
		<div class="not-bg"></div>
		<div class="notifications-box">
				<div class="notifications-block">
						<ul>
								<li class="bold">Уведомления</li>
						</ul>
						<ul class="notifications-menu">
								<li><a href="#">У вас нет уведомлений</a></li>
						</ul>
				</div>
		</div>
		<!--///Уведомления-->
	</div>
</template>

<script>
  import Chat from '@/Chat'

  export default {
    name: 'Navigation',
    components: {
      Chat
    },
    data () {
      return {
        unreadMessagesCount: 0
      }
    },
    methods: {
      openChat () {
        console.log(Chat)
        Chat.openChat();
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
