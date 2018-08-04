<template>
  <div class="chat_left_top">
    <ul>
      <li>
        <a>
          <img v-if="!avatar" src="./../../assets/design/avatar.jpg" width="40" height="40" class="img-circle" alt="User Image">
          <img v-if="avatar" class="img-circle" width="40" height="40" :src="avatar">
          <div class="user_info">
            <p class="light">{{$auth().user.fullname}}</p>
            <p class="small italic">{{getPositionName($auth().user.position)}}</p>
          </div>
        </a>
        <div class="mob-block-sm">
          <img src="~assets/img/close.png" class="m-close" @click="close()">
        </div>
      </li>
    </ul>
    <div class="chat_search">
      <input class="search" type="text" placeholder="поиск..." :value="search" @keyup="onKeyup">
    </div>
  </div>
</template>

<script>
export default {
  props: ['user', 'search', 'positions'],
  model: {
    prop: 'search',
    event: 'change'
  },
  methods: {
    onKeyup (e) {
      const search = e.target.value.trim()
      //        if (search.length > 0) {
      this.$emit('change', search)
      //        }
    },
    getPositionName (id) {
      const position = this.positions.find(p => p._id === id)
      return position && position.name
    },
    close () {
      this.$emit('closeChat')
    }
  },
  computed: {
    avatar () {
      return this.$store.state.auth.user.avatar ? this.$config('app.fileUrl') + this.$auth().user.avatar + '?' + Math.random() : false
    }
  }
}
</script>

<style scoped lang="scss">
  header {
    display: flex;
  }
  .card {
    padding: 12px;
    border-bottom: solid 1px #24272c;

    footer {
      margin-top: 10px;
    }

    .avatar, .name {
      vertical-align: middle;
    }
    .avatar {
      border-radius: 2px;
      flex-grow: 1;
    }
    .name {
      display: inline-block;
      margin: 0 0 0 15px;
      font-size: 0.8em;
    }
    .search {
      padding: 0 10px;
      width: 100%;
      font-size: 12px;
      color: #fff;
      height: 30px;
      line-height: 30px;
      border: solid 1px #3a3a3a;
      border-radius: 4px;
      outline: none;
      background-color: #26292e;
    }
  }
</style>
