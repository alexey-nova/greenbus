<template>
  <div>
    <div v-if="!isOpen" id="chatButton" @click="openChat">
      <i class="fa fa-comments"></i>
    </div>

    <div v-if="isOpen">
      <div id="chat" v-click-outside="closeChat">
        <div class="sidebar">
          <card :user="users[me]" v-model="search"></card>
          <list :users="filteredUsers" :current="currentUser" @changeCurrent="changeCurrent"></list>
        </div>
        <div class="main">
          <message :messages="messages" :users="users" :me="me"></message>
          <CText @sendMessage="sendMessage"></CText>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
  import Card from './chat/card'
  import List from './chat/list'
  import CText from './chat/text'
  import Message from './chat/message'
  import ClickOutside from 'vue-click-outside'

  export default {
    components: {
      Card,
      List,
      CText,
      Message,
    },
    props: ['users'],
    data () {
      return {
        search: '',
        isOpen: false,
        me: this.$auth().user._id,
        currentUser: -1,
        currentChat: 0,
        messages: []
      }
    },
    directives: {
      ClickOutside
    },
    computed: {
      filteredUsers () {
        if (this.search) {
          return this.$_.filter(this.$props.users, (user) => {
            if (user.fullname.toLowerCase().search(this.search.toLowerCase()) !== -1) {
              return user
            }
          })
        } else {
          return this.$props.users
        }
      },
    },
    methods: {
      openChat () {
        this.isOpen = true
        // this.$api('get', 'conversations').then(response => {
        // }).catch(err => {
        //   console.log(err)
        // })
      },
      closeChat () {
        this.isOpen = false
      },
      changeCurrent (id) {
        this.$api('post', 'conversations', { to: id }).then(response => {
          this.currentUser = id
          this.currentChat = response.data.conversation._id
          this.messages = response.data.messages || []
        }).catch(err => {
          if (err) console.log(err.response, 'qwe')
        })
      },
      sendMessage (message) {
        message = message.trim().replace(/\r\n|\r|\n/g,"<br />")
        if (this.currentChat === 0 || this.currentChat.length !== 24) {
          return
        }
        this.$api('post', `conversations/${this.currentChat}`, { message }).then(response => {
          this.messages.push(response.data.message)
        }).catch(err => {
          if (err) console.log(err, 'asd')
        })
      },
    },
    sockets: {
      newMessage (data) {
        console.log(data)
        if (data.author === this.currentUser) {
          this.messages.push(data)
        } else {
          this.notify('У вас новое сообщение')
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  #chatButton {
    position: fixed;
    z-index: 90;
    bottom: 10px;
    right: 10px;
    padding: 10px 13px;
    border-radius: 100px;
    background: #4e8348;
    color: #fff;
    cursor: pointer;
  }

  #chat {
    border-top: 3px solid #4e8348;
    position: fixed;
    z-index: 90;
    bottom: -10px;
    right: 10px;
    margin: 20px auto;
    width: 650px;
    height: 400px;
    overflow: hidden;
    border-radius: 3px;
    box-shadow: 1px 1px 7px 1px #a5a5a5;

    .sidebar, .main {
      height: 100%;
    }
    .sidebar {
      float: left;
      width: 200px;
      color: #f4f4f4;
      background-color: #2e3238;
    }
    .main {
      position: relative;
      overflow: hidden;
      background-color: #eee;
    }
    .text {
      position: absolute;
      width: 100%;
      bottom: 0;
      left: 0;
    }
    .message {
      height:calc(100% - 100px);
    }
  }
</style>
