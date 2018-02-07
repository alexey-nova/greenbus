<template>
  <div>
    <PageTitle :title="'Задачи'"></PageTitle>

    <PageButtons>
      <button class="btn btn-success" @click="toggleModal('create', {urgency: false})"><i class="fa fa-calendar-o"></i>&nbsp;&nbsp;Создать задачу</button>
    </PageButtons>

    <Box>
      <v-client-table ref="table" v-bind="tableData" :data="tasks" :columnsDropdown="true">
        <div slot="admin" slot-scope="props">
          <button class="btn btn-sm btn-default" @click="toggleModal('edit', $_.clone(props.row))"><i class="fa fa-edit"></i></button>
          <button class="btn btn-sm btn-default" @click="toggleModal('deleted', props.row)"><i class="fa fa-trash"></i></button>
        </div>
        <div slot="tools" slot-scope="props">
          <button class="btn btn-default" @click="toggleModal('show', props.row)">
            <i class="fa fa-calendar"></i>&nbsp;&nbsp;Подробнее
          </button>
          <!--<button v-if="props.row.to === $auth().user._id" class="btn btn-primary" @click="toggleModal('end', props.row)">-->
            <!--<i class="fa fa-calendar-check-o"></i>&nbsp;&nbsp;Завершить задачу-->
          <!--</button>-->
        </div>
        <div slot="from" slot-scope="props">
          {{getUser(props.row.from).fullname}}
        </div>
        <div slot="to" slot-scope="props">
          {{getUser(props.row.to).fullname}}
        </div>
        <div slot="urgency" slot-scope="props">
          <span v-if="props.row.urgency" class="label label-danger">Важная</span>
          <!--<span v-if="!props.row.urgency" class="label label-default">Обычная</span>-->
        </div>
        <div slot="status" slot-scope="props">
          {{statuses[props.row.status]}}
        </div>
        <div slot="deadline" slot-scope="props">
          {{$dateFormat(props.row.deadline, 'd mmm yyyy')}}
        </div>
      </v-client-table>
    </Box>

    <ModalCreate :model="modal.create" :users="users" @onSubmit="createTask" @onClose="toggleModal('create')"></ModalCreate>
    <ModalEdit :model="modal.edit" :users="users" @onSubmit="editTask" @onClose="toggleModal('edit')"></ModalEdit>
    <ModalDelete :model="modal.deleted" @onSubmit="deleteTask" @onClose="toggleModal('deleted')"></ModalDelete>
    <!--<ModalEnd :model="modal.end" @onSubmit="endTask" @onClose="toggleModal('end')"></ModalEnd>-->
    <ModalShow :model="modal.show" :users="users" @endTask="endTask" @rejectTask="endTask" @onClose="toggleModal('show')"></ModalShow>
  </div>
</template>

<script>
  import PageTitle from '@/PageTitle'
  import PageButtons from '@/PageButtons'
  import Box from '@/Box'
  import ModalCreate from './tasks/ModalCreateTask'
  import ModalEdit from './tasks/ModalEditTask'
  import ModalDelete from './tasks/ModalDeleteTask'
  import ModalEnd from './tasks/ModalEndTask'
  import ModalShow from './tasks/ModalShowTask'

  export default {
    components: {
      PageTitle,
      PageButtons,
      Box,
      ModalCreate,
      ModalEdit,
      ModalDelete,
      ModalEnd,
      ModalShow,
    },
    data () {
      return {
        tasks: [],
        users: [],
        modal: {
          create: false,
          edit: false,
          deleted: false,
          end: false,
          show: false,
        },
        statuses: [
          'В работе',
          'Согласовано',
          'Отказано',
        ],
        tableData: {
          columns: ['id', 'admin', 'name', 'urgency', 'status', 'deadline', 'from', 'to', 'tools'],
          options: {
            headings: {
              id: 'ID',
              admin: '',
              name: 'Задача',
              description: 'Описание',
              urgency: '',
              status: 'Статус',
              deadline: 'Срок до',
              from: 'От кого',
              to: 'Ответственный',
              tools: '',
            },
            orderBy: {
              column: 'id',
              ascending: false
            },
            sortable: ['id', 'name', 'description', 'urgency', 'status', 'deadline', 'from', 'to',],
            filterable: ['id', 'name', 'description', 'urgency', 'status', 'deadline', 'from', 'to',],
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
            rowClassCallback (row) {
//              return (row.urgency) ? 'bg-danger' : ''
            },
          },
        },
      }
    },

    methods: {
      toggleModal (name, model) {
        this.modal[name] = model === undefined ? !this.modal[name] : model
      },
      createTask (task) {
        this.$api('post', 'tasks', task).then(response => {
          this.modal.create = false
          this.loadTasks()
          this.notify(response.data.message)
        }).catch(e => {
          this.notify('Временно нельзя создать задачу', 'info')
          this.$log(e, 'danger')
        })
      },
      editTask (task) {
        this.$api('put', 'tasks/' + task._id, task).then(response => {
          this.modal.edit = false
          this.tasks = this.$_.assign(this.tasks, task)
          this.notify(response.data.message)
        }).catch(e => {
          this.notify('Временно нельзя редактировать задачу', 'info')
          this.$log(e, 'danger')
        })
      },
      deleteTask (task) {
        this.$api('delete', 'tasks/' + task._id).then(response => {
          this.modal.deleted = false
          this.loadTasks()
          this.notify(response.data.message)
        }).catch(e => {
          this.notify('Временно нельзя удалить задачу', 'info')
          this.$log(e, 'danger')
        })
      },
      endTask (task) {
        console.log(task)
        let data = {
          comment: task.comment,
          files: task.files,
        }
        this.$api('post', 'tasks/perform/' + task._id, data).then(response => {
//          this.modal.end = false
          this.$_.assign(this.users, user)
          this.notify(response.data.message)
        }).catch(e => {
          this.notify('Временно нельзя завершить задачу', 'info')
          this.$log(e, 'danger')
        })
      },
      rejectTask (task) {
        let data = {
          comment: task.comment,
          files: task.files,
        }
        this.$api('post', 'tasks/reject/' + task._id, data).then(response => {
//          this.modal.end = false
          this.$_.assign(this.users, user)
          this.notify(response.data.message)
        }).catch(e => {
          this.notify('Временно нельзя отменить задачу', 'info')
          this.$log(e, 'danger')
        })
      },
      loadTasks () {
        let filter = this.$route.params.param1 ? `/?f=${this.$route.params.param1}` : ''
        this.$api('get', 'tasks' + filter).then(response => {
          this.tasks = response.data
        }).catch(e => {
          this.notify(e, 'danger')
        })
      },
      loadUsers () {
        this.$api('get', 'users').then(response => {
          this.users = response.data
        }).catch(e => {
          this.notify(e, 'danger')
        })
      },
      setSidebar () {
        this.$store.commit('app/setSidebar', [
          {
            link: {name: 'tasks'},
            name: 'Все',
            isActive: () => this.$isRoute('tasks'),
          },
          {
            link: {name: 'tasksByFilter', params: {param1: 'in'}},
            name: 'Входящие',
            isActive: () => this.$isRoute('tasksByFilter', 'param1', 'in'),
          },
          {
            link: {name: 'tasksByFilter', params: {param1: 'out'}},
            name: 'Исходящие',
            isActive: () => this.$isRoute('tasksByFilter', 'param1', 'out'),
          },
          {
            link: {name: 'tasksByFilter', params: {param1: 'urgent'}},
            name: 'Срочные',
            isActive: () => this.$isRoute('tasksByFilter', 'param1', 'urgent'),
          },
          {
            link: {name: 'tasksByFilter', params: {param1: 'confirmation'}},
            name: 'Завершенные',
            isActive: () => this.$isRoute('tasksByFilter', 'param1', 'confirmation'),
          },
        ])
      },
      getUser (_id) {
        let user = this.$_.find(this.users, u => u._id === _id)
        return user ? user : {}
      },
    },

    mounted () {
      this.loadTasks()
      this.loadUsers()
      this.setSidebar()
    },
    destroyed () {
      this.$store.commit('app/setSidebar', {})
    },
    watch: {
      '$route' (to, from) {
        this.loadTasks()
      }
    },
  }
</script>

<style lang="scss">
  /*tr.bg-danger { background-color: #ffebeb; }*/
  .table .label { font-size: 0.8em; padding: 5px 10px;
    /*&.label-default { background: #eee; }*/
  }
</style>