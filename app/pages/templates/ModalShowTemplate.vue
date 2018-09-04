<template>
  <Modal :isOpen="model">
    <div slot="content" class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <div class="list_header">
            <div class="flex">
              <div>
                <span>Просмотр шаблона</span>
              </div>
              <div class="buttons">
                <button type="button" class="button-top close close-add-class" @click="close"></button>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-body">
          <h2>Название шаблона: {{model.name}}</h2>
          <div class="chain">
            <div v-for="(orderItem, index) in model.order" :key="`${orderItem._id}-${index}`" class="container chain-item">
              <div class="chain-index">{{index + 1}}</div>
              <div>
                <p>Должность: {{getPositionName(orderItem.position)}}</p>
                <p>Тип согласования: {{ confirmType(orderItem.confirmType) }}</p>
                <p>Сроки: {{orderItem.hours}} часов</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Modal>
</template>

<script>
import Modal from '@/Modal'

export default {
  components: {
    Modal
  },
  data () {
    return {
      positions: []
    }
  },
  props: ['model'],
  methods: {
    close () {
      this.$emit('onClose')
    },
    confirmType (item) {
      const types = {
        default: 'Обычный',
        date: 'С датой',
        shipment: 'С датой отгрузки'
      }

      return types[item]
    },
    loadPositions () {
      this.$api('get', 'positions?all=true').then(response => {
        this.positions = response.data.positions
      })
    },
    getPositionName (_id) {
      const position = this.positions.find(item => item._id === _id)
      if (position) return position.name
      return ''
    }
  },
  mounted () {
    if (this.model) {
      this.loadPositions()
    }
  }
}
</script>

<style lang="scss">
.chain {
  &-item {
    border: 1px solid #b9b9b9;
    padding: 10px;

    &:not(:last-child) {
      margin-bottom: 10px;
    }
  }

  &-index {
    margin-right: 10px;
    background: #b9b9b9;
    padding: 10px;
    color: #fff;
  }

}
</style>
