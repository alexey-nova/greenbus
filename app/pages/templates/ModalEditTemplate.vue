<template>
  <Modal :isOpen="model" @onSubmit="submit">
    <div class="modal-dialog " role="document" slot="content">
      <div class="modal-content">
        <div class="modal-header">
          <div class="list_header">
            <div class="flex">
              <span>Редактировать шаблон</span>
              <div class="buttons">
                <button type="button" class="button-top close body-add close-add-class" @click="close"></button>
              </div>
            </div>
          </div>
        </div>
        <div class="profile full modal-body">
          <div :class="[{'has-error': errors.has('name')}]">
            <label>Название *</label>
            <input type="text" v-validate="'required'" name="name" v-model="model.name">
            <span v-show="errors.has('name')" class="help-block">{{ errors.first('name') }}</span>
          </div>
          <div class="flex" v-for="(n, index) in model.order">
            <div :class="['form-group', {'has-error': errors.has('department')}]">
              <label for="field-dept">Департамент/Отдел</label>
              <el-cascader :options="group(departments.filter(item => item.departmentType === 'head'))" change-on-select @change="setVal"></el-cascader>
              <span v-show="errors.has('department')" class="help-block">{{ errors.first('department') }}</span>
            </div>
            <div :class="['form-group', {'has-error': errors.has('position')}]">
              <label for="field-position">Должность *</label>
              <Multiselect
                id="field-position"
                name="position"
                v-model="model.order[index].position"
                :options="filteredPositions"
                track-by="name"
                placeholder="Выберите должность"
                label="name">
              </Multiselect>
              <span v-show="errors.has('position')" class="help-block">{{ errors.first('position') }}</span>
            </div>
            <div :class="['form-group', {'has-error': errors.has('confirmType')}]">
              <label for="field-confirmType">Тип согласования *</label>
              <select v-validate="'required'" name="confirmType" v-model="model.order[index].confirmType">
                <option value="default" selected>Обычный</option>
                <option value="date">С датой оплаты</option>
              </select>
              <span v-show="errors.has('confirmType')" class="help-block">{{ errors.first('type') }}</span>
            </div>
            <div :class="['form-group', {'has-error': errors.has('hours')}]">
              <label for="field-hours">Срок согласования * (в часах)</label>
              <input type="number" @change="sanitizeInput" step="24" min="24" v-validate="'required'" name="hours" v-model="model.order[index].hours">
              <span v-show="errors.has('hours')" class="help-block">{{ errors.first('hours') }}</span>
            </div>
          </div>
          <div class="flex">
            <button type="button" class="button-table" @click="stepUp">+</button>
          </div>
          <div class="flex center">
            <button class="add-button auto-width form-submit">Добавить</button>
          </div>
        </div>
        <div class="modal-footer"></div>
      </div>
    </div>
  </Modal>
</template>

<script>
import Modal from '@/Modal'
import Multiselect from 'vue-multiselect'

export default {
  name: 'ModalEditTemplate',
  components: {
    Modal,
    Multiselect,
  },
  data () {
    return {
      departments: [],
      otdels: [],
      positions: [],
      filteredPositions: [],
    }
  },
  props: ['onSubmit', 'model', 'onClose'],
  methods: {
    sanitizeInput (event) {
      if (event.target.value % 24 !== 0) event.target.value = 24
    },
    close () {
      this.$emit('onClose')
    },
    stepUp (event) {
      this.model.order.push({_id: '', confirmType: '', hours: '', position: ''})
    },
    submit () {
      this.$validator.validateAll().then(() => {
        if (!this.$_.size(this.errors.items)) {

          for (var i = 0; i < this.model.order.length; i++){
            var pid = this.model.order[i].position._id
            this.model.order[i].position = pid
          }
          
          this.$emit('onSubmit', this.model)
        }
      }).catch(() => {})
    },
    loadPositions() {
      return this.$api('get', 'positions?all=true').then(response => {
        this.positions = response.data.positions
      })
    },
    loadDepartments() {
      this.$api('get', 'departments')
      .then(response => {
        this.departments = response.data.departments
        this.otdels = response.data.departments.filter(item => item.departmentType === 'common')
      })
      .catch(e => {
        this.notify(e.response.data, 'danger')
      })
    },
    setVal (val) {
      this.model.department = val[val.length - 1]
      this.filteredPositions = this.positions.filter(item => item.department._id === this.model.department)
      this.model.deptHierarchy = val
    },
    group (array) {
      let heads = array.map(item => {
        item.value = item._id
        item.label = item.name
        return item
      })
      let result = []
      this.departments.forEach(item => {
        this.setChildren(heads, {...item})
      })
      result = [...heads]
      return result
    },
    exists (arr, key, val) {
      return arr.filter( item => item[key] === val).length > 0
    },
    setChildren (arr, item) {
      const target = { ...item }
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].children) {
          if (arr[i]._id === target.parent) {
            if (!this.exists(arr[i].children, '_id', target._id)) {
              target.label = target.name
              target.value = target._id
              arr[i].children.push(target)
            }
          } else {
            this.setChildren(arr[i].children, target)
          }
        } else {
          if (arr[i]._id === target.parent) {
            target.label = target.name
            target.value = target._id
            arr[i].children = [target]
          }
        }
      }
    },
  },
  mounted () {

    if (this.model) {
      this.loadDepartments()
      this.loadPositions().then(data => {
        for (var i = 0; i < this.model.order.length; i++){
          var pid = this.model.order[i].position
          this.model.order[i].position = {}
          this.model.order[i].position._id = pid
          for (var j = 0; j < this.positions.length; j++) {
            if (this.positions[j]._id === pid) {
              this.model.order[i].position.name = this.positions[j].name
            }
          }

        }
        console.log('model', this.model)
      })
    }
  }
}
</script>