<template>
  <div>
    <div v-if="!isOpen" id="chatButton" @click="toggleChat">
      <i class="fa fa-comments"></i>
    </div>

    <div v-if="isOpen" id="chat">
      <div class="sidebar">
        <!--<card :user="users[me]"></card>-->
        <list :users="users" :current="current" @changeCurrent="changeCurrent"></list>
      </div>
      <div class="main">
        <message :messages="messages[current]" :users="users" :me="me"></message>
        <CText @sendMessage="sendMessage"></CText>
      </div>
    </div>
  </div>

</template>

<script>
  import Card from './chat/card'
  import List from './chat/list'
  import CText from './chat/text'
  import Message from './chat/message'

  export default {
    components: {
      Card,
      List,
      CText,
      Message,
    },
    data () {
      return {
        isOpen: false,
        me: 1,
        current: 2,
        users: {
          1: {
            id: 1,
            fullname: 'Alexey',
            position: 'Programmer',
          },
          2: {
            id: 2,
            fullname: 'Alexey2',
            position: 'Programmer2',
          },
          3: {
            id: 3,
            fullname: 'Эркинбаев Данияр Болотбекович',
            position: 'Programmer2',
          },
          4: {
            id: 4,
            fullname: 'Alexey2',
            position: 'Programmer2',
          },
          5: {
            id: 5,
            fullname: 'Alexey2',
            position: 'Programmer2',
          },
          6: {
            id: 6,
            fullname: 'Alexey2',
            position: 'Programmer2',
          },
          7: {
            id: 7,
            fullname: 'Alexey2',
            position: 'Programmer2',
          },
          8: {
            id: 8,
            fullname: 'Alexey2',
            position: 'Programmer2',
          },
        },
        messages: {
          2: [
            {
              id: 1,
              author: 1,
              text: 'asdasdasd',
            },
            {
              id: 2,
              author: 2,
              text: 'asdasdasd',
            },
            {
              id: 3,
              author: 1,
              text: 'asdasdasd',
            },
            {
              id: 3,
              author: 1,
              text: 'asdasdasd',
            },
            {
              id: 3,
              author: 1,
              text: 'asdasdasd',
            },
          ],
          1: [],
          3: [],
          4: [],
          5: [],
          6: [],
          7: [],
          8: [],
        },
      }
    },
    methods: {
      toggleChat () {
        this.isOpen = !this.isOpen
      },
      changeCurrent (id) {
        this.current = id
      },
      sendMessage (message) {
        message = message.trim().replace(/\r\n|\r|\n/g,"<br />")
        this.messages[this.current].push({
          id: 123,
          author: this.me,
          text: message,
        })
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