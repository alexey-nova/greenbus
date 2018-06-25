<template>
  <div>
    <div v-if="!isOpen" id="chatButton" @click="openChat">
      <span v-if="unreadMessagesCount" class="chat-count">{{ unreadMessagesCount }}</span>
      <i class="fa fa-comments"></i>
    </div>

    <div v-if="isOpen">
      <!-- <div class="chat-bg"></div> -->
      <div v-click-outside="closeChat" class="chat">
        <div class="flex">
          <div class="chat_left">
            <card :user="users[me]" v-model="search"></card>
            <list :users="filteredUsers" :current="currentUser" @changeCurrent="changeCurrent"></list>
          </div>
          <div class="chat_right" v-if="currentUser==-1">
            <div class="fixed-top">
              <p>Чат не выбран </p>
            </div>
          </div>
          <div class="chat_right" v-else>
            <message :messages="messages" :users="users" :me="me"></message>
            <CText @sendMessage="sendMessage"></CText>
          </div>
        </div>
      </div>

      <!-- <div id="chat" v-click-outside="closeChat">
        <div class="sidebar">
          <card :user="users[me]" v-model="search"></card>
          <list :users="filteredUsers" :current="currentUser" @changeCurrent="changeCurrent"></list>
        </div>
        <div class="main">
          <message :messages="messages" :users="users" :me="me"></message>
          <CText @sendMessage="sendMessage"></CText>
        </div>
      </div> -->
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
        messages: [],
        unreadMessages: [],
        unreadMessagesCount: 0
      }
    },
    directives: {
      ClickOutside
    },
    computed: {
      filteredUsers () {
        let users = []
        if (this.search) {
          users = this.$_.filter(this.$props.users, (user) => {
            if (user.fullname.toLowerCase().search(this.search.toLowerCase()) !== -1 && user._id !== this.$auth().user._id) {
              return user
            }
          })
        } else {
          users = this.$props.users.filter(user => user._id !== this.$auth().user._id)
        }
        users = users.map(user => {
          return {
            ...user,
            unreadMessages: this.unreadMessages.filter(message => message.userId === user._id)[0]
          }
        })

        users = this.$_.orderBy(users, [(o) => o.unreadMessages || '', 'unreadMessages.date'], ['desc', 'desc'])
        console.log(users)
        return users
      },
    },
    methods: {
      openChat () {
        this.isOpen = true
      },
      closeChat () {
        this.isOpen = false
      },
      changeCurrent (id) {
        this.$api('post', 'conversations', { to: id }).then(response => {
          this.currentUser = id
          this.currentChat = response.data.conversation._id
          this.messages = response.data.messages || []
          this.messages.authorName = this.$props.users.filter(user => user._id === id)[0].fullname
          this.getMessages()
        }).catch(err => {
          if (err) console.log(err.response, 'qwe')
        })
      },
      getMessages () {
        this.$api('get', 'conversations').then(response => {
          this.unreadMessages = response.data.conversations.map(conversation => {
            return {
              count: conversation.unreadMessages,
              lastMessage: conversation.message.body,
              userId: conversation.chat.userId,
              chatId: conversation.chat.chatId,
              date: conversation.message.createdAt || new Date(2014, 1)
            }
          })
          this.unreadMessagesCount = response.data.conversations.map(c => c.unreadMessages).reduce((a, b) => a + b)
        }).catch(err => console.log(err))
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
    beforeMount () {
      this.getMessages()
    },
    sockets: {
      newMessage (data) {
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
    bottom: 30px;
    right: 10px;
    padding: 10px 13px;
    border-radius: 100px;
    background: #4e8348;
    box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
    transition: all 0.3s cubic-bezier(.25,.8,.25,1);
    color: #fff;
    cursor: pointer;

    &:hover {
      box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
    }

    .chat-count {
      position: absolute;
      top: -5px;
      right: -5px;
      width: 20px;
      height: 20px;
      text-align: center;
      background-color: crimson;
      border-radius: 50%;
    }
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
