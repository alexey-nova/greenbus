<template>
  <Modal :isOpen="isOpen">

    <h3 slot="header" class="modal-title">Отклонить служебную записку?</h3>

    <form slot="content" ref="form" @submit="onSubmit($event)">
      <div class="form-group">
        <label for="name">Комментарий *</label>
        <input class="form-control" id="name" v-model="comment">
      </div>
    </form>

    <div slot="footer">
      <button type="button" class="btn btn-secondary" data-dismiss="modal" @click="onClose">Отмена</button>
      <button type="submit" class="btn btn-danger" @click="click($event)">Отклонить</button>
    </div>

  </Modal>
</template>

<script>
  import 'element-ui/lib/theme-chalk/index.css'
  import Modal from '@/Modal'
  import Datepicker from 'vuejs-datepicker'
  import { Switch } from 'element-ui'

  export default {
    components: {
      Modal,
      Datepicker,
      'el-switch': Switch,
    },
    data () {
      return {
        comment: '',
      }
    },
    props: ['isOpen', 'model'],
    methods: {
      onClose () {
        this.$emit('onClose')
      },
      onSubmit (event) {
        event.preventDefault()
        this.$emit('onSubmit', event, {
          memoId: this.$props.model._id,
          comment: this.comment
        })
      },
      click (event) {
        this.onSubmit(event)
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>