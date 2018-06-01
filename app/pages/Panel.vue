<template>
  <div class="working_area">
    <div class="white-block no-padding">
      <div class="padding-block">
        <div class="flex margin-bottom align-center">
          <div class="search">
            <h4>Департаменты</h4>
          </div>
          <div class="add">
            <button class="add-button" @click="toggleModal('create', { type: 'department' })"><img src="~assets/img/add.png" >Добавить департамент</button>
          </div>
        </div>
        <table>
          <tr class="green">
            <td width="100%">
              <div>
                <span>Название департамента</span>
              </div>
            </td>
            <td class="button-width">&nbsp;</td>
          </tr>
          <tr v-for="dept in departments" :key="dept._id">
            <td  class="td_center">{{dept.name}}</td>
            
            <td class="border-none">
              <div class="flex">
                <button class="button-table edit" @click="toggleModal('edit', { type: 'department', name: dept.name, _id: dept._id })"></button>
                <button class="button-table remove" @click="toggleModal('delete', { type: 'department', name: dept.name })"></button>
              </div>
            </td>
          </tr>
          <tr v-if="departments.length === 0">
            <td class="td_center">Департаменты отсутствуют</td>
          </tr>
        </table>
      </div>
    </div>
    <div class="white-block no-padding">
      <div class="padding-block">
        <div class="flex margin-bottom align-center">
          <div class="search">
            <h4>Отделы</h4>
          </div>
          <div class="add">
            <button class="add-button" @click="toggleModal('create', { type: 'otdel' })"><img src="~assets/img/add.png">Добавить отдел</button>
          </div>
        </div>
        <table >
          <tr class="green">
            <td width="100%">
              <div>
                <span>Название отдела</span>
              </div>
            </td>
            <td class="button-width">&nbsp;</td>
          </tr>
          <tr v-for="dept in otdels" :key="dept._id">
            <td  class="td_center">{{dept.name}}</td>
            
            <td class="border-none">
              <div class="flex">
                <!-- <button class="button-table edit" @click="toggleModal('edit', { ...dept, type: 'otdel' })"></button> -->
                <!-- <button class="button-table remove" @click="toggleModal('delete', { type: 'otdel', name: dept.name })"></button> -->
              </div>
            </td>
          </tr>
          <tr v-if="otdels.length === 0">
            <td>Отделы отсутствуют</td>
          </tr>
        </table>
      </div>
    </div>
    <div class="white-block no-padding">
      <div class="padding-block">
        <div class="flex margin-bottom align-center">
          <div class="search">
            <h4>Должности</h4>
          </div>
          <div class="add">
            <button class="add-button" @click="toggleModal('create', { type: 'position' })"><img src="~assets/img/add.png">Добавить должность</button>
          </div>
        </div>
        <table >
          <tr class="green">
            <td width="50%">
              <div>
                <span>Название должности</span>
              </div>
            </td>
            <td>
              <div>
                <span>Отдел</span>
              </div>
            </td>
            <td class="button-width">&nbsp;</td>
          </tr>
          <tr v-for="position in positions" :key="position._id">
            <td width="50%" class="td_center">{{position.name}}</td>
            <td width="50%" class="td_center">{{position.department.name}}</td>
            
            <td class="border-none">
              <div class="flex">
                <!-- <button class="button-table edit" @click="toggleModal('edit', { type: 'position', name: position.name, _id: position._id })"></button> -->
                <!-- <button class="button-table remove" @click="toggleModal('delete', { type: 'position', name: position.name, _id: position._id })"></button> -->
              </div>
            </td>
          </tr>
          <tr v-if="positions.length === 0">
            <td>Должности отсутствуют</td>
          </tr>
        </table>
      </div>
    </div>
    <ModalCreate :model="modal.create" :departments="departments" :otdels="otdels" @onClose="toggleModal('create')" @onSubmit="submit"></ModalCreate>
    <ModalEdit :model="modal.edit" :departments="departments" :otdels="otdels" @onClose="toggleModal('edit')" @onSubmit="edit"></ModalEdit>
    <ModalDelete :model="modal.edit" @onClose="toggleModal('edit')" @onSubmit="remove"></ModalDelete>
  </div>
</template>

<script>
import ModalCreate from './panel/ModalCreate'
import ModalEdit from './panel/ModalEdit'
import ModalDelete from './panel/ModalDelete'

export default {
  name: 'Panel',
  components: {
    ModalCreate,
    ModalEdit,
    ModalDelete
  },
  data () {
    return {
      departments: [],
      otdels: [],
      positions: [],
      modal: {
        create: false,
        edit: false,
        delete: false
      },
    }
  },
  methods: {
    toggleModal (name, model, tab) {
        this.modal[name] = model === undefined ? !this.modal[name] : model
        this.modal.tab = tab ? tab : 0
      },
    loadDepartments () {
      this.$api('get', 'departments').then(response => {
        this.departments = response.data.departments.filter(item => item.departmentType === 'head')
        this.otdels = response.data.departments.filter(item => item.departmentType === 'common')
      })
    },
    loadPositions () {
      this.$api('get', 'positions').then(response => {
        this.positions = response.data.positions
      })
    },
    submit (model) {
      if (model.type && model.type === 'department') {
        this.$api('post', 'departments', { type: 'head', name: model.name }).then(response => {
          this.modal.create = false
          this.departments.push(response.data.department)
          this.notify(response.data.message)
        })
      } else if (model.type && model.type === 'otdel') {
        model.parent = model.otdel ? model.otdel : model.department ? model.department : ''
        if (!model.parent) {
          this.notify('Выберите департамент/отдел', 'danger')
          return
        } 
        this.$api('post', 'departments', { type: 'common', name: model.name, parent: model.parent }).then(response => {
          this.modal.create = false
          this.otdels.push(response.data.department)
          this.notify(response.data.message)
        })
      } else if (model.type && model.type === 'position') {
        model.parent = model.otdel ? model.otdel : model.department ? model.department : ''
        if (!model.parent) {
          this.notify('Выберите департамент/отдел', 'danger')
          return
        }
        this.$api('post', 'positions', { department: model.parent, name: model.name }).then(response => {
          this.modal.create = false
          this.positions.push(response.data.position)
          this.notify(response.data.message)
        })
      }
    },
    edit (data) {
      if (data.type === 'department') {
        this.$api('put', `departments/${data._id}`, data).then(response => {
          this.modal.edit = false
          this.departments = this.departments.map(item => {
            if (item._id === data._id) item.name = data.name
            return item
          })
          this.notify(response.data.message)
        })
      } else if (data.type === 'otdel') {
        
      } else if (data.type === 'position') {

      }
    },
    remove (data) {

    }
    // loadUsers () {
    //   return this.$api('get', 'users').then(response => {
    //     this.users = response.data
    //   }).catch(e => {
    //     this.notify(e, 'danger')
    //   })
    // }
  },
  beforeMount () {
    this.loadDepartments()
    this.loadPositions()
    // this.loadUsers()
  }
}
</script>

<style lang="scss" scoped>

</style>


