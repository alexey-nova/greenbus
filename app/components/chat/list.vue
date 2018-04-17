<script>
  export default {
    props: ['users', 'current'],
    methods: {
      changeCurrent (id) {
        this.$emit('changeCurrent', id)
      },
      readChat (chatId) {
        if (chatId) {
          this.$api('post', `conversations/read/${chatId}`).then(response => {})
        }
      },
      avatar (user) {
        return user.avatar ? this.$config('app.fileUrl') + user.avatar + '?' + Math.random() : false
      },
    }
  }
</script>

<template>
  <div class="list">
    <ul>
      <li v-for="user in users" :key="user._id" :class="{ active: user._id === current }" @click="changeCurrent(user._id); readChat(user.unreadMessages.chatId)">
        <div class="avatar">
          <span v-if="user.unreadMessages && user.unreadMessages.count" class="badge badge-success">{{ user.unreadMessages.count }}</span>
          <img v-if="!avatar(user)" src="./../../assets/design/avatar.jpg" width="40" height="40" class="img-circle" alt="User Image">
          <img v-if="avatar(user)" class="avatar" width="40" height="40" :src="avatar(user)">
        </div>
        <div class="name">
          <p>{{user.fullname}}</p>
          <span>{{ user.unreadMessages && user.unreadMessages.lastMessage }}</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
  .list {

    height: 292px;
    width: 220px;
    overflow-y: scroll;
    overflow-x: hidden;

    ul {
      list-style: none;
      margin: 0;
      padding: 0;
    }

    li {
      padding: 12px 15px;
      border-bottom: 1px solid #292C33;
      cursor: pointer;
      transition: background-color .1s;
      display: flex;

      &:hover {
        background-color: rgba(255, 255, 255, 0.03);
      }
      &.active {
        background-color: rgba(255, 255, 255, 0.1);
      }
    }
    .avatar, .name {
      /*vertical-align: middle;*/
      white-space: nowrap;
    }
    .avatar {
      border-radius: 2px;
      position: relative;

      .badge {
        top: -5px;
        right: -5px;
        padding: 3px 5px;
        background: #4e8348;
        position: absolute;
        font-size: .7em;
      }
    }
    .name {
      font-size: .8em;
      margin: 0 0 0 15px;
      p {
        margin: 0;
        width: 120px;
        overflow: hidden;
      }
      span {
        width: 120px;
        overflow: hidden;
        display: inline-block;
        font-size: .9em;
        opacity: .5;
      }
    }
  }
</style>
