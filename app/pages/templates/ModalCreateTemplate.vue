<template>
  <Modal :isOpen="model" @onSubmit="submit" type="lg">
    <div slot="content" class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
        <div class="list_header">
          <div class="flex">
            <div>
              <span>Добавить новый шаблон</span>
            </div>
            <div class="buttons">
              <button class="button-top close close-add-class" @click="close" type="button"></button>
            </div>
          </div>
        </div>
      </div>
      <div class="profile full modal-body">
        <div>
          <h1>Выбранная категория: {{model.category.name}}</h1>
        </div>
        <div :class="[{'has-error': errors.has('name')}]">
          <label>Название *</label>
          <input type="text" v-validate="'required'" name="name" v-model="model.name">
          <span v-show="errors.has('name')" class="help-block">{{ errors.first('name') }}</span>
        </div>
        <div class="flex" v-for="(n, index) in steps" :key="n+'_step'">
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
              v-model="order[index].position"
              :options="filteredPositions"
              track-by="name"
              placeholder="Выберите должность"
              label="name">
            </Multiselect>
            <span v-show="errors.has('position')" class="help-block">{{ errors.first('position') }}</span>
          </div>
          <div :class="['form-group', {'has-error': errors.has('confirmType')}]">
            <label for="field-confirmType">Тип согласования *</label>
            <select v-validate="'required'" name="confirmType" v-model="order[index].confirmType">
              <option value="default" selected>Обычный</option>
              <option value="date">С датой оплаты</option>
            </select>
            <span v-show="errors.has('confirmType')" class="help-block">{{ errors.first('type') }}</span>
          </div>
          <div :class="['form-group', {'has-error': errors.has('hours')}]">
            <label for="field-hours">Срок согласования * (в часах)</label>
            <input type="number" @change="sanitizeInput" step="24" min="24" v-validate="'required'" name="hours" v-model="order[index].hours">
            <span v-show="errors.has('hours')" class="help-block">{{ errors.first('hours') }}</span>
          </div>
          <button v-if="index > 0" type="button" class="button-table" @click="stepDown(index)">-</button>
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
  components: {
    Modal,
    Multiselect,
  },
  data () {
    return {
      steps: 1,
      departments: [],
      otdels: [],
      positions: [],
      filteredPositions: [],
      order: [{}]
    }
  },
  props: ['model', 'onSubmit', 'onClose'],
  methods: {
    sanitizeInput (event) {
      if (event.target.value % 24 !== 0) event.target.value = 24
    },
    close () {
      this.$emit('onClose')
    },
    stepUp (event) {
      this.steps++
      this.order[this.steps - 1] = {}
    },
    stepDown (index) {
      this.steps--
      this.order.splice(index, 1)
    },
    submit () {
      this.$validator.validateAll().then(() => {
        if (!this.$_.size(this.errors.items)) {
          this.model.order = this.order
          this.model.categoryId = this.model.category._id
          this.model.order = this.model.order.map(item => {
            item.position = item.position._id
            return item
          })

          this.$emit('onSubmit', this.model)
        }
      }).catch(() => {})
    },
    loadPositions() {
      this.$api('get', 'positions?all=true').then(response => {
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
      this.loadPositions()
    }
  }
}
</script>
