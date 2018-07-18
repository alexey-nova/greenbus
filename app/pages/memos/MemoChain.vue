<template>
  <div class="stage2">
    <a :class="['stage2-item', setOrderClass(chainItem, index)]" v-for="(chainItem, index) in modifiedBidOrder" :key="chainItem._id">
      <img :src="avatar(chainItem.user._id) || require(`assets/img/user.jpg`)">
      <div class="absolut-box">
        <div :class="['stage-flex flex', setOrderClass(chainItem, index)]">
          <div :class="['stage-text', setOrderClass]">
            <p>{{chainItem.user.fullname}}</p>
            <p class="italic">{{ posName(chainItem.user.positionId) }}</p>
          </div>
          <div v-if="type !== 'create'"  class="stage-date">
            <span class="chain-date">{{$dateFormat(chainItem.deadline, 'dd.mm.yyyy HH:MM')}}</span>
          </div>
        </div>
      </div>
    </a>
  </div>
</template>

<script>
export default {
  name: 'memo-chain',
  props: {
    order: {
      type: Array,
      required: true
    },
    users: {
      type: Array,
      required: true
    },
    positions: {
      type: Array,
      required: true
    },
    model: {
      type: Object,
      // required: function (value) {
      //   return this.$props.type !== 'create'
      // }
    },
    type: String
  },
  computed: {
    modifiedBidOrder () {
      if (this.type === 'create') return this.order
      return this.model.order.reduce((newArray, item, i) => {
        let prevDate = new Date()
        if (i === 0) {
          prevDate = new Date(this.model.createdAt)
        } else {
          prevDate = new Date(newArray[i - 1].deadline||123)
        }
        prevDate = this.nextWorkDay(prevDate)
        let nextDeadline = new Date(prevDate)
        for(let ind = 0; ind < item.hours; ind++) {
          nextDeadline.setHours(nextDeadline.getHours() + 1)
          nextDeadline = this.nextWorkDay(nextDeadline)
        }
        if (item.confirmed) {
          nextDeadline = new Date(item.confirmedDate)
        }
        item.deadline = nextDeadline
        newArray[i] = item
        return newArray
      }, [])
    },
  },
  methods: {
    posName (positionId) {
      return (this.positions.find(item => item._id === positionId) || {}).name
    },
    avatar (user) {
      return this.getUser(user).avatar ? this.$config('app.fileUrl') + this.getUser(user).avatar + '?' + Math.random() : false
    },
    getUser (id) {
      return this.users.find(u => u._id === id)
    },
    setOrderClass (orderItem, index) {
      if (this.type === 'create') return 'gray'
      if (orderItem.confirmed) return 'green'
      if (index === this.model.currentUser && orderItem.deadline.getTime() < new Date().getTime()) return 'red'
      if (index === this.model.currentUser) return 'yellow'
      return 'gray'
    },
    nextWorkDay(date, weekends = [0, 6]) {
      const tempDate = new Date(date)
      while (weekends.includes(tempDate.getDay())) {
        tempDate.setHours(tempDate.getHours() + 24)
      }
      return tempDate
    },
  }
}
</script>

<style>
.chain-date {
  text-align: center
}
</style>
