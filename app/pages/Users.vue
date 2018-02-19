<template>
  <div>
    <PageTitle :title="'Сотрудники'"></PageTitle>

    <PageButtons>
      <button class="btn btn-success" @click="toggleModal('showDep', {})"><i class="fa fa-id-badge"></i>&nbsp;&nbsp;Управление отделами</button>
      <button class="btn btn-success" @click="toggleModal('createUser', {})"><i class="fa fa-user"></i>&nbsp;&nbsp;Добавить сотрудника</button>
    </PageButtons>

    <Box>
      <v-client-table ref="table" v-bind="tableData" :data="filteredUsers" :columnsDropdown="true">
        <div v-if="$store.state.auth.user.login" slot="admin" slot-scope="props">
          <button class="btn btn-sm btn-default" @click="toggleModal('editUser', $_.clone(props.row))"><i class="fa fa-edit"></i></button>
          <button class="btn btn-sm btn-default" @click="toggleModal('deleteUser', props.row)"><i class="fa fa-trash"></i></button>
        </div>
        <div slot="tools" slot-scope="props">
          <button class="btn btn-default" @click="toggleModal('showUser', props.row)">
            <i class="fa fa fa-user"></i>&nbsp;&nbsp;Подробнее
          </button>
          <button class="btn btn-primary" @click="toggleModal('createTask', {urgency: false, to: props.row._id})">
            <i class="fa fa fa-calendar-check-o"></i>&nbsp;&nbsp;Поставить задачу
          </button>
        </div>
        <div slot="email" slot-scope="props">
          <a :href="'mailto:'+props.row.email">{{props.row.email}}</a>
        </div>
        <div slot="phone" slot-scope="props">
          <a v-if="props.row.phone" :href="'tel:+'+parseInt(props.row.phone.replace(/\D+/g,''))">{{props.row.phone}}</a>
        </div>
      </v-client-table>
    </Box>

    <ModalCreateUser :model="modal.createUser" :users="users" :departments="departments" @onSubmit="createUser" @onClose="toggleModal('createUser')"></ModalCreateUser>
    <ModalDeleteUser :model="modal.deleteUser" @onSubmit="deleteUser" @onClose="toggleModal('deleteUser')"></ModalDeleteUser>
    <ModalEditUser :model="modal.editUser" :departments="departments" @onSubmit="editUser" @onClose="toggleModal('editUser')"></ModalEditUser>
    <ModalShowUser :model="modal.showUser" :departments="departments" @onClose="toggleModal('showUser')"></ModalShowUser>
    <ModalCreateTask :model="modal.createTask" :users="users" @onSubmit="createTask" @onClose="toggleModal('createTask')"></ModalCreateTask>
    <ModalShowDep :model="modal.showDep" @onClose="toggleModal('showDep')"></ModalShowDep>
  </div>
</template>

<script>
  import PageTitle from '@/PageTitle'
  import PageButtons from '@/PageButtons'
  import Box from '@/Box'
  import ModalCreateUser from './users/ModalCreateUser'
  import ModalEditUser from './users/ModalEditUser'
  import ModalShowUser from './users/ModalShowUser'
  import ModalDeleteUser from './users/ModalDeleteUser'
  import ModalCreateTask from './tasks/ModalCreateTask'
  import ModalShowDep from './users/ModalShowDep'

  export default {
    plugins: ['auth'],
    components: {
      PageTitle,
      PageButtons,
      Box,
      ModalCreateUser,
      ModalDeleteUser,
      ModalEditUser,
      ModalCreateTask,
      ModalShowUser,
      ModalShowDep,
    },
    data () {
      return {
        seoTitle: this.$trans('pages.index.seoTitle'),
        users: [],
        departments: [],
        filter: false,
        modal: {
          editUser: false,
          showUser: false,
          createTask: false,
          createUser: false,
          deleteUser: false,
          showDep: false,
        },
        tableData: {
          columns: ['id', 'fullname', 'position', 'department', 'phone', 'email', 'tools'],
          options: {
            headings: {
              id: 'ID',
              admin: '',
              fullname: 'Ф.И.О',
              position: 'Должность',
              department: 'Отдел',
              phone: 'Телефон',
              email: 'Email',
              tools: 'Доп. информация',
            },
            orderBy: {
              column: 'id',
              ascending: false
            },
            sortable: ['id', 'fullname', 'position', 'department', 'phone', 'email',],
            filterable: ['id', 'fullname', 'position', 'department', 'phone', 'email',],
            customSorting: {
              id: function (ascending) {
                return (a, b) => {
                  a = a.id * 1
                  b = b.id * 1

                  if (ascending)
                    return a >= b ? 1 : -1

                  return a <= b ? 1 : -1
                }
              }
            },
            columnsClasses: {
              admin: 'admin',
            },
          },
        },
      }
    },
    computed: {
      filteredUsers: {
        get: function () {
          let users = _.clone(this.users)
          if (this.filter !== false) {
            users = _.filter(users, ['department', this.filter])
          }
          return users
        }
      }
    },
    methods: {
      toggleModal (name, model) {
        this.modal[name] = model === undefined ? !this.modal[name] : model
      },
      createUser (user) {
        this.$api('post', 'users', user).then(response => {
          this.loadUsers()
          this.modal.createUser = false
          this.notify(response.data.message)
        }).catch((e) => {
          this.notify('Временно нельзя создать пользователя', 'info')
          this.$log(e, 'danger')
        })
      },
      editUser (user) {
        this.$api('put', 'users/' + user._id, user).then(response => {
          this.loadUsers()
          this.modal.editUser = false
          this.notify(response.data.message)
        }).catch(e => {
          this.notify('Временно нельзя редактировать пользователя', 'info')
          this.modal.editUser = false
          this.$log(e, 'danger')
        })
      },
      deleteUser (user) {
        this.$api('delete', 'users/' + user._id).then(response => {
          this.users = this.$_.remove(this.users, u => u._id !== user._id)
          this.modal.deleteUser = false
          this.notify(response.data.message)
        }).catch(e => {
          this.notify('Временно нельзя удалить пользователя', 'info')
          this.modal.deleteUser = false
          this.$log(e, 'danger')
        })
      },
      createTask (task) {
        this.$api('post', 'tasks', task).then(response => {
          this.modal.createTask = false
          this.notify(response.data.message)
        }).catch(e => {
          this.notify('Временно нельзя создать задачу', 'info')
          this.$log(e, 'danger')
        })
      },
      loadUsers () {
        this.$api('get', 'users').then(response => {
          this.users = response.data
        }).catch(e => {
          this.notify(e, 'danger')
        })
      },
      loadDepartments () {
        this.$api('get', 'departments').then(response => {
          this.departments = response.data
          let sidebar = [
            {
              link: {name: 'users'},
              isActive: () => this.$isRoute('users'),
              name: 'Все'
            }
          ]
          _.map(response.data, value => {
            let item = _.assign({}, value)
            item.link = {name: 'usersByDep', params: {param1: value.name}}
            item.isActive = () => this.$isRoute('usersByDep', 'param1', value.name)
            item.name = value.name
            sidebar.push(item)
          })

          this.$store.commit('app/setSidebar', sidebar)

        }).catch(e => {
          this.notify(e.response.data, 'danger')
        })
      },
      updateFilter () {
        let department = this.$route.params.param1
        if (department === undefined) {
          department = false
        }
        this.filter = department
      },
    },

    mounted () {
      if (this.$auth().hasRole('admin')) {
        this.tableData.columns.push('admin')
      }

      this.loadUsers()
      this.loadDepartments()

      this.updateFilter()
    },
    destroyed () {
      this.$store.commit('app/setSidebar', {})
    },
    watch: {
      '$route' (to, from) {
        this.updateFilter()
      }
    },
  }
</script>

<style lang="scss" scoped>
</style>