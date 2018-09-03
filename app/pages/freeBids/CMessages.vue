<template>
  <div>
    <div v-for="(com, index) in comments" :key="`comment-${index}`" :class="[{ 'forum-response': com.replyTo && !main }]">
      <div :class="[{ 'forum-response-box': com.replyTo && !main }, { 'anti-margin': child }]">
        <div class="forum-title flex">
          <p v-if="com.user" class="forum-name">{{com.user.fullname}} {{ commentType(com.type) }}</p>
          <p class="forum-date">{{$dateFormat(com.createdAt, 'dd mmm yyyy, HH:MM')}}</p>
        </div>
        <div v-if="com.comment" class="forum-text">
          <span v-html="com.comment"></span>
        </div>
        <div class="file-button">
          <div v-for="(file, index) in com.files" :key="`file-${index}`" class="file-button--item">
            <a :href="$config('app.fileUrl') + file.path"
              target="_blank"
              :class="['info-button clicked left-margin']">
              <img src="~assets/img/2.png">
              <span>{{file.name}}</span>
            </a>
          </div>
        </div>
        <div class="flex flex-end forum-button">
          <button type="button" class="add-button auto-width reply" @click="toggleReplyArea(index)">{{ replyBox[index] ? 'Закрыть' : 'Ответить' }}</button>
        </div>
        <div v-if="replyBox[index]">
          <div class="forum-response">
            <div class="forum-response-box">
              <div class="forum-textarea">
                <textarea placeholder="Введите текст" v-model="reply[index]"></textarea>
              </div>
              <div class="flex flex-end forum-button">
                <button type="button" class="add-button auto-width" @click="replyMessage(com, reply[index], index)">Отправить</button>
              </div>
            </div>
          </div>
        </div>
        <c-messages v-if="com.replies" :child="main ? false : true" :comments="com.replies" @onSubmit="$emit('onSubmit')"></c-messages>
      </div>
    </div>
  </div>
</template>

<script>
import CMessages from './CMessages'

export default {
  name: 'c-messages',
  components: {
    'c-messages': CMessages
  },
  data () {
    return {
      replyBox: {},
      reply: []
    }
  },
  props: {
    comments: {
      type: Array,
      required: true
    },
    main: {
      type: Boolean
    },
    child: {
      type: Boolean
    }
  },
  methods: {
    commentType (type) {
      const types = {
        'confirm': '(Принял к исполнению)',
        'decline': '(Отклонил)'
      }
      return types[type]
    },
    toggleReplyArea (index) {
      this.$set(this.replyBox, index, !this.replyBox[index])
    },
    replyMessage (comment, text, index) {
      this.$api('post', `comments`, { moduleId: comment.moduleId, comment: text, replyTo: comment._id }).then(response => {
        this.$emit('onSubmit')
        this.reply[index] = ''
        this.$set(this.replyBox, index, !this.replyBox[index])
      }).catch(e => {
        console.log(e.message)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.anti-margin {
  width: 100% !important;
}

.forum-title {
  margin-top: 10px;
}

.file-button {
  display: flex;
  margin-top: 0.5em;

  &--item {
    &:not(:first-child) {
      margin-left: 1em;
    }

    span {
      width: 80%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
</style>
