<script>
  export default {
    props: ['messages', 'users', 'me'],
    filters: {
      time (date) {
        date = new Date(date)
        if (typeof date === 'string') {
          date = new Date(date)
        }
        return `${date.getDate()} ${date.getMonth()}, ${date.getHours()}:${date.getMinutes()}`
      }
    },
    directives: {
      'scroll-bottom': function (el) {
        _.defer(() => {
          el.scrollTop = el.scrollHeight - el.clientHeight
        })
      }
    },
    methods: {
      avatar (author) {
        if (!author) return false
        if ((author._id ? author._id : author ) === this.me && this.$auth().user.avatar) {
          return `${this.$config('app.fileUrl')}${this.$auth().user.avatar}`
        } else if (this.users.filter(user => user._id === (author._id ? author._id : author))[0].avatar) {
          return `${this.$config('app.fileUrl')}${this.users.filter(user => user._id === (author._id ? author._id : author))[0].avatar}`
        } else {
          return false
        }
      },
    },
    mounted () {
      // console.log('users', this.users)
      // console.log('me', this.me)
    }
  }
</script>

<template>
  <div>
    <div class="fixed-top">
      <p>{{$props.messages.authorName}}</p>
      <div class="mob-block-sm">
        <a href="#" class="m-back">Назад</a>
      </div>
    </div>
    <div class="fixed-center style-16" id="chat-1" v-scroll-bottom="messages">
      <div :class="['message', me === message.author._id ? 'right' : 'left']" v-for="message in messages" :key="message._id">
        <p class="time">
          <span>{{ message.createdAt | time }}</span>
        </p>
        <div class="message-box"  :class="{ self: me === (message.author._id ? message.author._id : message.author) }">
          <p v-html="message.body">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus adipisci debitis</p>
        </div>
      </div>
    </div>
  </div>
  <!-- <div>
    <p class="authorName">{{$props.messages.authorName}}</p>
    <div class="message" v-scroll-bottom="messages">
      <ul v-if="messages">
        <li v-for="message in messages" :key="message._id">
          <p class="time">
            <span>{{ message.createdAt | time }}</span>
          </p>
          <div class="main" :class="{ self: me === (message.author._id ? message.author._id : message.author) }">

            <img v-if="avatar(message.author)" class="avatar" :src="avatar(message.author)" alt="Ава">
            <img v-else class="avatar" src="./../../assets/avatar.jpg" alt="Ава">
            <div class="text" v-html="message.body"></div>
          </div>
        </li>
      </ul>
    </div>
  </div> -->
</template>

<style lang="scss" scoped>
  .time {
    margin: 7px 0;
    text-align: center;

    > span {
      display: inline-block;
      font-size: 12px;
      color: gray;
    }
  }
  // .authorName {
  //   padding: 10px;
  //   font-weight: 700;
  //   border-bottom: 1px solid #d7d7d7;
  // }
  // .message {
  //   padding: 10px 15px;
  //   //overflow-y: auto;
  //   //height: 240px;
  //
  //   ul {
  //     list-style: none;
  //     margin: 0;
  //     padding: 0;
  //   }
  //
  //   li {
  //     margin-bottom: 15px;
  //   }
  //   .time {
  //     margin: 7px 0;
  //     text-align: center;
  //
  //     > span {
  //       display: inline-block;
  //       padding: 0 18px;
  //       font-size: 12px;
  //       color: #fff;
  //       border-radius: 2px;
  //       background-color: #dcdcdc;
  //     }
  //   }
  //   .avatar {
  //     float: left;
  //     margin: 0 10px 0 0;
  //     border-radius: 3px;
  //     width: 30px;
  //   }
  //   .text {
  //     display: inline-block;
  //     position: relative;
  //     padding: 0 10px;
  //     max-width: calc(100% - 40px);
  //     min-height: 30px;
  //     line-height: 2.5;
  //     font-size: 12px;
  //     text-align: left;
  //     word-break: break-all;
  //     background-color: #fafafa;
  //     border-radius: 4px;
  //
  //     &:before {
  //       content: " ";
  //       position: absolute;
  //       top: 9px;
  //       right: 100%;
  //       border: 6px solid transparent;
  //       border-right-color: #fafafa;
  //     }
  //   }
  //
  //   .self {
  //     text-align: right;
  //
  //     .avatar {
  //       float: right;
  //       margin: 0 0 0 10px;
  //       width: 30px;
  //     }
  //     .text {
  //       background-color: #b2e281;
  //
  //       &:before {
  //         right: inherit;
  //         left: 100%;
  //         border-right-color: transparent;
  //         border-left-color: #b2e281;
  //       }
  //     }
  //   }
  // }
</style>
