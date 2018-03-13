<script>
  export default {
    props: ['user', 'search'],
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
      }
    },
    computed: {
      avatar () {
        return this.$store.state.auth.user.avatar ? this.$config('app.fileUrl') + this.$auth().user.avatar + '?' + Math.random() : false
      },
    },
  }
</script>

<template>
  <div class="card">
    <header>
      <img v-if="!avatar" src="./../../assets/design/avatar.jpg" width="40" height="40" class="img-circle" alt="User Image">
      <img v-if="avatar" class="avatar" width="40" height="40" :src="avatar">
      <p class="name">{{$auth().user.fullname}}</p>
    </header>
    <footer>
      <input class="search" type="text" placeholder="поиск..." :value="search" @keyup="onKeyup">
    </footer>
  </div>
</template>

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