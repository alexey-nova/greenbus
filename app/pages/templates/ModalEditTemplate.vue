<template>
  <div>
    <Modal :isOpen="model" type="lg">
      <div class="modal-dialog" slot="content">
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
              <input type="text" v-validate="'required'" name="name" v-model="currentModel.name">
              <span v-show="errors.has('name')" class="help-block">{{ errors.first('name') }}</span>
            </div>
            <table>
              <tr class="green">
                <td width="30%">Департамент</td>
                <td width="30%">Должность</td>
                <td width="15%">Тип согласования</td>
                <td width="15%">Срок согласования * (в часах)</td>
                <td width="5%">Действия</td>
              </tr>
              <Container
                tag="tbody"
                @drop="onDrop($event)">
                <Draggable tag="tr" v-for="(n, index) in currentModel.order" :key="index">
                  <td>
                    <div :class="[{'has-error': errors.has('department')}]">
                      <el-cascader :options="group(departments.filter(item => item.departmentType === 'head'))" @change="setVal" change-on-select expand-trigger="hover"></el-cascader>
                      <span v-show="errors.has('department')" class="help-block">{{ errors.first('department') }}</span>
                    </div>
                  </td>
                  <td>
                    <div :class="[{'has-error': errors.has('position')}]">
                      <Multiselect
                        id="field-position"
                        name="position"
                        v-model="currentModel.order[index].position"
                        :options="filteredPositions"
                        track-by="name"
                        placeholder="Выберите должность"
                        :show-labels="false"
                        label="name">
                      </Multiselect>
                      <span v-show="errors.has('position')" class="help-block">{{ errors.first('position') }}</span>
                    </div>
                  </td>
                  <td>
                    <div :class="[{'has-error': errors.has('confirmType')}]">
                      <select v-validate="'required'" name="confirmType" v-model="currentModel.order[index].confirmType">
                        <option value="default" selected>Обычный</option>
                        <option value="date">С датой оплаты</option>
                        <option value="shipment">С датой отгрузки</option>
                      </select>
                      <span v-show="errors.has('confirmType')" class="help-block">{{ errors.first('type') }}</span>
                    </div>
                  </td>
                  <td>
                    <div :class="[{'has-error': errors.has('hours')}]">
                      <input type="number" @change="sanitizeInput" step="24" min="24" v-validate="'required'" name="hours" v-model="currentModel.order[index].hours">
                      <span v-show="errors.has('hours')" class="help-block">{{ errors.first('hours') }}</span>
                    </div>
                  </td>
                  <td>
                    <button type="button" class="button-table" @click="stepDown(index)">-</button>
                    <button type="button" class="button-table" @click="addStep(index)">+</button>
                  </td>
                </Draggable>
              </Container>
            </table>
            <div class="flex">
              <button type="button" class="button-table" @click="stepUp">+</button>
            </div>
            <div class="flex center">
              <button class="add-button auto-width form-submit" type="button" @click="toggleModal('confirm', currentModel)">Редактировать</button>
            </div>
          </div>
          <div class="modal-footer"></div>
        </div>
      </div>
    </Modal>
    <ModalConfirmEdit v-if="modal.confirm" :model="modal.confirm" @onSubmit="submit" @onClose="toggleModal('confirm')"></ModalConfirmEdit>
  </div>
</template>

<script>
import Modal from '@/Modal'
import Multiselect from 'vue-multiselect'
import ModalConfirmEdit from './ModalConfirmEdit'
import { Container, Draggable } from "vue-smooth-dnd"

export default {
  name: 'ModalEditTemplate',
  components: {
    Modal,
    Multiselect,
    ModalConfirmEdit,
    Container,
    Draggable
  },
  data () {
    return {
      departments: [],
      otdels: [],
      positions: [],
      filteredPositions: [],
      currentModel: JSON.parse(JSON.stringify(this.model)),
      modal: {
        confirm: false
      }
    }
  },
  props: ['onSubmit', 'model', 'onClose'],
  methods: {
    toggleModal (name, model) {
      this.modal[name] = model === undefined ? !this.modal[name] : model
    },
    sanitizeInput (event) {
      if (event.target.value % 24 !== 0) event.target.value = 24
    },
    close () {
      this.$emit('onClose')
    },
    stepUp (event) {
      this.currentModel.order.push({_id: '', confirmType: '', hours: '', position: ''})
    },
    addStep (index) {
      this.currentModel.order.splice(index + 1, 0, { _id: '', confirmType: '', hours: '', position: ''})
    },
    stepDown (index) {
      this.currentModel.order.splice(index, 1)
    },
    submit () {
      this.$validator.validateAll().then(() => {
        if (!this.$_.size(this.errors.items)) {
          for (var i = 0; i < this.currentModel.order.length; i++) {
            var pid = this.currentModel.order[i].position._id
            this.currentModel.order[i].position = pid
          }
          this.$emit('onSubmit', this.currentModel)
        }
      }).catch(() => {})
    },
    loadPositions () {
      return this.$api('get', 'positions?all=true').then(response => {
        this.positions = response.data.positions
      })
    },
    loadDepartments () {
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
      this.currentModel.department = val[val.length - 1]
      this.filteredPositions = this.positions.filter(item => item.department._id === this.currentModel.department)
      this.currentModel.deptHierarchy = val
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
      return arr.filter(item => item[key] === val).length > 0
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
    onDrop (event) {
      const newModel = Object.assign({}, this.currentModel)
      const { removedIndex, addedIndex, payload } = event
      if (removedIndex === null && addedIndex === null) return this.currentModel
      let itemToAdd = undefined
      const result = [...newModel.order]

      if (removedIndex !== null) {
        itemToAdd = result.splice(removedIndex, 1)[0]
      }

      if (addedIndex !== null) {
        result.splice(addedIndex, 0, itemToAdd)
      }

      newModel.order = result

      this.currentModel = newModel
    }
  },
  mounted () {
    if (this.currentModel) {
      this.loadDepartments()
      this.loadPositions().then(data => {
        for (var i = 0; i < this.currentModel.order.length; i++) {
          var pid = this.currentModel.order[i].position
          this.currentModel.order[i].position = {}
          this.currentModel.order[i].position._id = pid
          for (var j = 0; j < this.positions.length; j++) {
            if (this.positions[j]._id === pid) {
              this.currentModel.order[i].position.name = this.positions[j].name
            }
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@media (min-width: 768px) {
  .modal-dialog {
    width: 900px;
  }
}

input, select, td {
  font-size: 1rem;
}

.aic {
  align-items: center;
}

.form-group:not(:first-child) {
  margin-left: 10px;
}
</style>
