<script>
  export default {
    props: ['users', 'current'],
    methods: {
      changeCurrent (id) {
        this.$emit('changeCurrent', id)
      },
      avatar (user) {
        return user.avatar ? this.$config('app.fileUrl') + user.avatar + '?' + Math.random() : false
      },
    },
  }
</script>

<template>
  <div class="list">
    <ul>
      <li v-for="user in users" :class="{ active: user._id === current }" @click="changeCurrent(user._id)">
        <div class="avatar">
          <!-- <span class="badge badge-success">4</span> -->
          <img v-if="!avatar(user)" src="./../../assets/design/avatar.jpg" width="40" height="40" class="img-circle" alt="User Image">
          <img v-if="avatar(user)" class="avatar" width="40" height="40" :src="avatar(user)">
        </div>
        <div class="name">
          <p>{{user.fullname}}</p>
          <span>{{user.fullname}}</span>
        </div>
        <!--<p>3</p>-->
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
