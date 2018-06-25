<template>
  <div class="working_area">
    <div class="white-block no-padding">
      <div class="padding-block">
        <div class="flex margin-bottom align-center">
          <div class="search">
          </div>
          <div class="add" v-if="$auth().hasRole('admin')">
            <button class="add-button" @click="toggleModal('createUser', {})"><img src="~assets/img/add.png">Добавить сотрудника</button>
          </div>
        </div>
        <v-client-table ref="table" v-bind="tableData" :data="filteredUsers" :columnsDropdown="true">
          <div slot="phone" slot-scope="props">
            <a v-if="props.row.phone" :href="'tel:+'+parseInt(props.row.phone.replace(/\D+/g,''))">{{props.row.phone}}</a>
          </div>
          <div slot="email" slot-scope="props">
            <a :href="'mailto:'+props.row.email">{{props.row.email}}</a>
          </div>
          <div class="flex align-center sm-w" slot="tools" slot-scope="props">
            <button @click="toggleModal('createTask', { urgency: false, to: props.row._id })" class="add-button transparent">
              <img src="~assets/img/add2.png">
              <span>Поставить задачу</span>
            </button>
            <a @click="toggleModal('showUser', { fullname: props.row.fullname, phone: props.row.phone, email: props.row.email, department: departmentName(props.row.departmentId), position: positionName(props.row.positionId)})" class="green_anchor">Подробнее</a>
          </div>
          <div class="border-none" slot="admin" slot-scope="props" v-if="$auth().hasRole('admin')">
            <button class="button-table edit" @click="toggleModal('editUser', $_.clone(props.row))"></button>
            <button class="button-table remove" @click="toggleModal('deleteUser', props.row) "></button>
          </div>
        </v-client-table>
        <!-- <table>
          <tr class="green">
            <td width="5%" class="id">
              <div class="flex img align-center">
                <span>ID</span>
                <img src="~assets/img/sver.png" class="sort">
              </div>
            </td>
            <td width="22%">
              <div class="flex img align-center">
                <input type="text" placeholder="ФИО" class="td-search-input" disabled>
                <img src="~assets/img/search-2.png" class="td-search-button">
              </div>
            </td>
            <td width="16%">
              <div class="flex img align-center">
                <span>Должность</span>
                <img src="~assets/img/sver.png" class="sort">
              </div>
            </td>
            <td width="10%">
              <div class="flex img align-center">
                <span>Отдел</span>
              </div>
            </td>
            <td width="13%">
              <div class="flex img align-center">
                <span>Телефон</span>
              </div>
            </td>
            <td width="13%">
              <div class="flex img align-center">
                <span>E-mail</span>
              </div>
            </td>
            <td width="20%">
              <div class="flex img align-center">
                <span>Доп. информация</span>
              </div>
            </td>
            <td class="button-width">&nbsp;</td>
          </tr>
          <tr v-for="user in filteredUsers" :key="user._id">
            <td class="td_center">{{user.id}}</td>
            <td>{{user.fullname}}</td>
            <td>{{positionName(user.positionId || user.position)}}</td>
            <td>{{departmentName(user.departmentId || user.department)}}</td>
            <td><a :href="`tel:${user.phone}`" class="td_link">{{user.phone}}</a></td>
            <td><a :href="`mailto:${user.email}`" class="td_link">{{user.email}}</a></td>
            <td>
              <div class="flex align-center sm-w">
                <button @click="toggleModal('createTask', { urgency: false, to: user._id })" class="add-button transparent">
                  <img src="~assets/img/add2.png">
                  <span>Поставить задачу</span>
                </button>
                <a @click="toggleModal('showUser', { fullname: user.fullname, phone: user.phone, email: user.email, department: departmentName(user.departmentId), position: positionName(user.positionId)})" class="green_anchor">Подробнее</a>
              </div>
            </td>
            <td class="border-none" v-if="$auth().hasRole('admin')">
              <div class="flex">
                <button class="button-table edit" @click="toggleModal('editUser', user)"></button>
                <button class="button-table remove" @click="toggleModal('deleteUser', user) "></button>
              </div>
            </td>
          </tr>
        </table> -->
      </div>
    </div>
    <ModalCreateUser :model="modal.createUser" :users="users" :departments="group(departments)" :otdels="otdels" :positions="positions" @onSubmit="createUser" @onClose="toggleModal('createUser')"></ModalCreateUser>
    <ModalDeleteUser :model="modal.deleteUser" @onSubmit="deleteUser" @onClose="toggleModal('deleteUser')"></ModalDeleteUser>
    <ModalEditUser :model="modal.editUser" :departments="group(departments)" :otdels="otdels" :positions="positions" @onSubmit="editUser" @onClose="toggleModal('editUser')"></ModalEditUser>
    <ModalShowUser :model="modal.showUser" :departments="allDepartments" :positions="positions" @onClose="toggleModal('showUser')"></ModalShowUser>
    <ModalCreateTask :model="modal.createTask" :users="users" @onSubmit="createTask" @onClose="toggleModal('createTask')"></ModalCreateTask>
    <ModalShowDep :model="modal.showDep" @onClose="toggleModal('showDep')"></ModalShowDep>
  </div>
</template>

<script>
import ModalCreateUser from './users/ModalCreateUser'
import ModalEditUser from './users/ModalEditUser'
import ModalShowUser from './users/ModalShowUser'
import ModalDeleteUser from './users/ModalDeleteUser'
import ModalCreateTask from './tasks/ModalCreateTask'
import ModalShowDep from './users/ModalShowDep'

export default {
  plugins: ['auth'],
  components: {
    ModalCreateUser,
    ModalDeleteUser,
    ModalEditUser,
    ModalCreateTask,
    ModalShowUser,
    ModalShowDep
  },
  data () {
    return {
      seoTitle: this.$trans('pages.index.seoTitle'),
      users: [],
      allDepartments: [],
      departments: [],
      storeDepartments: this.$store.getters['app/departments'],
      otdels: [],
      positions: [],
      filter: false,
      modal: {
        editUser: false,
        showUser: false,
        createTask: false,
        createUser: false,
        deleteUser: false,
        showDep: false
      },
      tableData: {
        columns: ['id', 'fullname', 'posName', 'deptName', 'phone', 'email', 'tools', 'admin'],
        options: {
          headings: {
            id: 'ID',
            admin: '',
            fullname: 'ФИО',
            posName: 'Должность',
            deptName: 'Отдел',
            phone: 'Телефон',
            email: 'Email',
            tools: 'Доп. информация',
            admin: 'Управление'
          },
          orderBy: {
            column: 'id',
            ascending: false
          },
          sortable: ['id', 'fullname', 'posName', 'deptName', 'phone', 'email'],
          filterable: ['id', 'fullname', 'posName', 'deptName', 'phone', 'email'],
          customSorting: {
            id: function(ascending) {
              return (a, b) => {
                a = a.id * 1
                b = b.id * 1
                if (ascending) return a >= b ? 1 : -1;
                return a <= b ? 1 : -1;
              }
            }
          },
          columnsClasses: {
            admin: 'admin'
          },
          highlightMatches: true
        }
      }
    };
  },
  computed: {
    filteredUsers: {
      get: function() {
        let users = _.clone(this.users)
        if (this.filter !== false) {
          users = _.filter(users, ['departmentId', this.filter])
        }

        const departments = {}
        _.clone(this.allDepartments).forEach(item => {
          departments[item._id] = item.name
        })
        const positions = {}
        _.clone(this.positions).forEach(item => {
          positions[item._id] = item.name
        })
        
        users = users.map(item => {
          item.deptName = departments[item.departmentId]
          item.posName = positions[item.positionId]
          return item
        })
        return users
      }
    }
  },
  methods: {
    toggleModal(name, model) {
      this.modal[name] = model === undefined ? !this.modal[name] : model;
    },
    createUser(user) {
      user.departmentId = user.department
      user.positionId = user.position
      this.$api('post', 'users', user)
        .then(response => {
          this.loadUsers()
          this.modal.createUser = false
          this.notify(response.data.message)
        })
        .catch(e => {
          this.notify('Временно нельзя создать пользователя', 'info')
          this.$log(e, 'danger')
        })
    },
    editUser (user) {
      this.$api('put', 'users/' + user._id, user)
        .then(response => {
          this.loadUsers()
          this.modal.editUser = false
          this.notify(response.data.message)
        })
        .catch(e => {
          this.notify('Временно нельзя редактировать пользователя', 'info')
          this.modal.editUser = false
          this.$log(e, 'danger')
        })
    },
    deleteUser(user) {
      this.$api('delete', 'users/' + user._id)
        .then(response => {
          this.users = this.$_.remove(this.users, u => u._id !== user._id)
          this.modal.deleteUser = false
          this.notify(response.data.message)
        })
        .catch(e => {
          this.notify('Временно нельзя удалить пользователя', 'info')
          this.modal.deleteUser = false
          this.$log(e, 'danger')
        })
    },
    createTask(task) {
      task.files = this.$_.map(task.files, f => f.file)
      let data = this.$createFormData(task)
      this.$api('post', 'tasks', data)
        .then(response => {
          this.modal.createTask = false
          this.notify(response.data.message)
        })
        .catch(e => {
          this.notify('Временно нельзя создать задачу', 'info')
          this.$log(e, 'danger')
        })
    },
    loadUsers() {
      this.$api('get', 'users')
        .then(response => {
          if (response.data && response.data.length > 0) {
            this.users = response.data.filter(user => user._id !== this.$auth().user._id && user.login !== 'admin')
          }
        })
        .catch(e => {
          this.notify(e, 'danger')
        })
    },
    loadDepartments() {
      this.$api('get', 'departments')
        .then(response => {
          this.allDepartments = response.data.departments
          this.departments = response.data.departments.filter(
            item => item.departmentType === 'head'
          )
          this.otdels = response.data.departments.filter(
            item => item.departmentType === 'common'
          )

          let sidebar = [
            {
              link: { name: 'users' },
              isActive: () => this.$isRoute('users'),
              name: 'Все',
              imgSrc: 'folder.png'
            }
          ]
          // console.log('group', this.group(this.departments))
          sidebar = [...sidebar, ...this.group(this.departments)]
          
          this.$store.commit('app/setSidebar', sidebar)
        })
        .catch(e => {
          this.notify(e.response.data, 'danger')
        })
    },
    group(array) {
      var self = this
      let heads = array.map(item => {
        item.value = item._id
        item.label = item.name
        item.link = { name: 'usersByDep', params: { param1: item._id } }
        item.isActive = () => this.$isRoute('usersByDep', 'param1', item._id)
        item.imgSrc = 'folder.png'
        item.imgSrc2 = 'folder-h.png'
        return item
      })
      let result = []
      this.otdels.forEach(item => {
        this.setChildren(heads, { ...item })
      })
      result = [...heads]
      return result
    },
    exists(arr, key, val) {
      return arr.filter(item => item[key] === val).length > 0
    },
    setChildren(arr, item) {
      var self = this
      const target = JSON.parse(JSON.stringify(item))
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].children) {
          if (arr[i]._id === target.parent) {
            if (!this.exists(arr[i].children, '_id', target._id)) {
              target.label = target.name
              target.value = target._id
              target.link = { name: 'usersByDep', params: { param1: target._id } }
              target.isActive = () => this.$isRoute('usersByDep', 'param1', item._id)
              target.imgSrc = 'folder.png'
              target.imgSrc2 = 'folder-h.png'
              arr[i].children.push(target)
            }
          } else {
            this.setChildren(arr[i].children, target)
          }
        } else {
          if (arr[i]._id === target.parent) {
            target.label = target.name
            target.value = target._id
            target.link = { name: 'usersByDep', params: { param1: target._id } }
            target.isActive = () => this.$isRoute('usersByDep', 'param1', item._id)
            target.imgSrc2 = 'folder-h.png'
            target.imgSrc = 'folder.png'
            
            arr[i].children = [target]
          }
        }
      }
    },
    loadPositions() {
      this.$api('get', 'positions').then(response => {
        this.positions = response.data.positions;
      });
    },
    departmentName(_id) {
      if (this.allDepartments.length > 0) {
        if (this.allDepartments.filter(item => item._id === _id).length > 0) {
          return this.allDepartments.filter(item => item._id === _id)[0].name;
        }
      }
    },
    positionName(_id) {
      if (this.positions.length > 0) {
        if (this.positions.filter(item => item._id === _id).length > 0) {
          return this.positions.filter(item => item._id === _id)[0].name;
        }
      }
    },
    updateFilter() {
      let department = this.$route.params.param1
      if (department === undefined) {
        department = false;
      }
      this.filter = department
    },
  },
  mounted () {
    // if (this.$auth().hasRole('admin')) {
    //   this.tableData.columns.push('admin')
    // }
    this.loadUsers()
    this.loadDepartments()
    this.loadPositions()
    this.updateFilter()
  },
  destroyed () {
    this.$store.commit('app/setSidebar', {})
  },
  watch: {
    $route(to, from) {
      this.updateFilter()
    },
  }
};
</script>

<style lang="scss" scoped>
body .wrapper .form-control { border-width: 0 0 1px; border-radius: 0; padding-left: 5px; }
</style>