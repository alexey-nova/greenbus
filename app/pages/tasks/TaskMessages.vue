<template>
  <div>
    <div v-for="(com, index) in comments" :key="`comment-${index}`" :class="[{ 'forum-response': com.replyTo && !main }]">
      <div v-if="com.isExecution" class="anti-margin">
        <div class="forum-title flex">
          <p class="forum-name">{{getUser(com.performedBy).fullname}}</p>
          <p class="forum-date">{{$dateFormat(com.createdAt, 'dd mmm yyyy, HH:MM')}}</p>
        </div>
        <div v-if="com.comment" class="forum-text">
          <span>{{com.comment}}</span>
        </div>
        <div class="file-button">
          <div v-for="(file, index) in com.files" :key="`file-${index}`" class="file-button--item">
            <a :href="$config('app.fileUrl') + file.path" target="_blank" :class="['info-button clicked left-margin']"><img src="~assets/img/2.png">{{file.name}}</a>
          </div>
        </div>
        <div class="forum-response">
          <div v-if="com.replies && com.replies[0]" class="forum-response-box">
          <div class="forum-title flex">
            <p class="forum-name">{{getUser(from).fullname}}</p>
            <p class="forum-date">{{$dateFormat(com.replies[0].createdAt, 'dd mmm yyyy, HH:MM')}}</p>
          </div>
          <div v-if="com.replies[0].comment" class="forum-text">
            <span>{{com.replies[0].comment}}</span>
          </div>
          <div class="file-button">
            <div v-for="(file, index) in com.replies[0].files" :key="`file-${index}`" class="file-button--item">
              <a :href="$config('app.fileUrl') + file.path" target="_blank" :class="['info-button clicked left-margin']"><img src="~assets/img/2.png">{{file.name}}</a>
            </div>
          </div>
        </div>
        </div>
      </div>
      <div v-else :class="[{ 'forum-response-box': com.replyTo && !main }, { 'anti-margin': child }]">
        <div class="forum-title flex">
          <p class="forum-name">{{getUser(com.user).fullname}}</p>
          <p class="forum-date">{{$dateFormat(com.createdAt, 'dd mmm yyyy, HH:MM')}}</p>
        </div>
        <div v-if="com.comment" class="forum-text">
          <span>{{com.comment}}</span>
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
        <task-messages v-if="com.replies" :getUser="getUser" :child="main ? false : true" :comments="com.replies" @onSubmit="$emit('onSubmit')"></task-messages>
      </div>
    </div>
  </div>
</template>

<script>
import TaskMessages from './TaskMessages'

export default {
  name: 'task-messages',
  components: {
    TaskMessages
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
    },
    getUser: Function,
    from: String
  },
  methods: {
    commentType (type) {
      const types = {
        'decline': '(Отклонил)',
        'confirm': '(Согласовал)'
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

  &--item:not(:first-child) {
    margin-left: 1em;
  }

}
</style>
