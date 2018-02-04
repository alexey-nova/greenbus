<template>
  <Modal :isOpen="isOpen">

    <h3 slot="header" class="modal-title">Согласовать служебную записку?</h3>

    <div slot="footer">
      <button type="button" class="btn btn-secondary" data-dismiss="modal" @click="onClose">Отмена</button>
      <button type="submit" class="btn btn-success" @click="click($event)">Согласовать</button>
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