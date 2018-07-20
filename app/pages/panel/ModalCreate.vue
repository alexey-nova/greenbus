<template>
  <Modal :isOpen="model" @onSubmit="submit">
    <div slot="content" class="modal-dialog small2">
      <div class="modal-content">
        <div class="modal-header">
          <div class="list_header">
            <div class="flex">
              <div>
                <span>Добавить {{setTypeName}}</span>
              </div>
              <div class="buttons">
                <button type="button" class="button-top close close-add-class" @click="close"></button>
              </div>
            </div>
          </div>
        </div>
        <div class="profile full modal-body">
          <div :class="[{'has-error': errors.has('name')}]">
            <label>Название</label>
            <input type="text" v-validate="'required'" name="name" v-model="model.name">
            <span v-show="errors.has('name')" class="help-block">{{ errors.first('name') }}</span>
          </div>
          <div v-if="model.type === 'otdel' || model.type === 'position'" :class="['form-group', {'has-error': errors.has('department')}]">
            <label for="field-dept">Департамент/Отдел</label>
            <el-cascader :options="departments" change-on-select @change="setVal"></el-cascader>
            <span v-show="errors.has('department')" class="help-block">{{ errors.first('department') }}</span>
          </div>
          <div class="flex center">
              <button type="" class="add-button auto-width form-submit">Добавить</button>
          </div>
        </div>
      <!-- <div class="modal-footer"></div> -->
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
    }
  },
  props: ['model', 'users', 'onSubmit', 'onClose', 'departments'],
  computed: {
    setTypeName () {
      const names = {
        department: 'департамент',
        otdel: 'отдел',
        position: 'должность'
      }
      return names[this.model.type]
    }
  },
  methods: {
    setVal (val) {
      this.model.department = val[val.length - 1]
    },
    close () {
      this.errors.clear()
      this.$emit('onClose')
    },
    submit () {
      if (this.model.type === 'otdel' || this.model.type === 'position') {
        if (!this.model.department) {
          this.errors.items.push({
            id: '100',
            field: 'department',
            scope: null,
            msg: 'Поле Департамент/Отдел обязательно для заполнения'
          })
        } else {
          this.errors.items = this.$_.reject(this.errors.items, e => e.field === 'department')
        }
      }
      this.$validator.validateAll().then(() => {
        if (!this.$_.size(this.errors.items)) {
          this.$emit('onSubmit', this.model)
        }
      }).catch(e => console.log(e.message))
    }
  },
  mounted () {
  }
}
</script>

<style lang="scss" scoped>

</style>
