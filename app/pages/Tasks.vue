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
        <div slot="info" slot-scope="props">
          <span class="tools" @click="toggleModal('show', props.row, 2)">
            <span v-if="$_.size(props.row.comments)" class="label label-success">{{$_.size(props.row.comments)}}</span>
            <i class="fa fa-comment-o"></i>
          </span>
          <span class="tools" @click="toggleModal('show', props.row, 1)">
            <span v-if="$_.size(props.row.files)" class="label label-success">{{$_.size(props.row.files)}}</span>
            <i class="fa fa-file-o"></i>
          </span>
        </div>
        <div slot="tools" slot-scope="props">
          <button class="btn btn-default" @click="toggleModal('show', props.row)"><i class="fa fa-calendar"></i>&nbsp;&nbsp;Подробнее</button>
        </div>
        <div slot="from" slot-scope="props">
          {{getUser(props.row.from).fullname}}
        </div>
        <div slot="to" slot-scope="props">
          {{getUser(props.row.to).fullname}}
        </div>
        <div slot="urgency" slot-scope="props">
          <span v-if="props.row.urgency" class="label label-danger urgency">Важная</span>
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
    <ModalShow :model="modal.show" :tab="modal.tab" :users="users" @performTask="performTask" @rejectTask="rejectTask" @confirmTask="confirmTask" @onClose="toggleModal('show')"></ModalShow>
  </div>
</template>

<script>
  import PageTitle from '@/PageTitle'
  import PageButtons from '@/PageButtons'
  import Box from '@/Box'
  import ModalCreate from './tasks/ModalCreateTask'
  import ModalEdit from './tasks/ModalEditTask'
  import ModalDelete from './tasks/ModalDeleteTask'
  import ModalShow from './tasks/ModalShowTask'

  export default {
    components: {
      PageTitle,
      PageButtons,
      Box,
      ModalCreate,
      ModalEdit,
      ModalDelete,
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
          tab: 0,
        },
        statuses: [
          'В работе',
          'На согласовании',
          'Завершена',
          'Отказано',
        ],
        tableData: {
          columns: ['id', 'name', 'urgency', 'status', 'deadline', 'from', 'to', 'info', 'tools',],
          options: {
            headings: {
              id: 'ID',
              admin: '',
              name: 'Задача',
              description: 'Описание',
              urgency: 'Приоритет',
              status: 'Статус',
              deadline: 'Срок до',
              from: 'От кого',
              to: 'Ответственный',
              info: 'Инфо',
              tools: 'Доп. информация',
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
          },
        },
      }
    },

    methods: {
      toggleModal (name, model, tab) {
        this.modal[name] = model === undefined ? !this.modal[name] : model
        this.modal.tab = tab ? tab : 0
      },
      createTask (task) {
        task.files = this.$_.map(task.files, (f) => f.file)
        let data = this.$createFormData(task)
        this.$api('post', 'tasks', data).then(response => {
          this.modal.create = false
          this.loadTasks()
          this.notify(response.data.message)
        }).catch(e => {
          this.notify('Временно нельзя создать задачу', 'info')
          this.$log(e, 'danger')
        })
      },
      editTask (task) {
        task.files = this.$_.reduce(task.files, (result, f) => {
          if (f.file) {
            result.push(f.file)
          }
          return result
        }, [])
        let data = this.$createFormData(task)
        this.$api('put', 'tasks/' + task._id, data).then(response => {
          this.modal.edit = false
          this.loadTasks()
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
      performTask (task) {
        let data = this.$createFormData(task)
        this.$api('post', 'tasks/perform/' + task._id, data).then(response => {
          this.modal.show = false
          this.loadTasks()
          this.notify(response.data.message)
        }).catch(e => {
          this.notify('Временно нельзя завершить задачу', 'info')
          this.$log(e, 'danger')
        })
      },
      confirmTask (model) {
        this.$api('post', 'tasks/confirm/' + model._id).then(response => {
          this.modal.show = false
          this.loadTasks()
          this.notify(response.data.message)
        }).catch(e => {
          this.notify('Временно нельзя согласовать задачу', 'info')
          this.$log(e, 'danger')
        })
      },
      rejectTask (data) {
        let formData = this.$createFormData(data)
        this.$api('post', 'tasks/reject/' + data._id, formData).then(response => {
          this.modal.show = false
          this.loadTasks()
          this.notify(response.data.message)
        }).catch(e => {
          this.notify('Временно нельзя отменить задачу', 'info')
          this.$log(e, 'danger')
        })
      },
      loadTasks () {
        let filter = this.$route.params.param1 ? `/?f=${this.$route.params.param1}` : ''
        this.tasks = []
        return this.$api('get', 'tasks' + filter).then(response => {
          return this.tasks = response.data.tasks
        }).catch(e => {
          this.notify(e, 'danger')
        })
      },
      loadUsers () {
        return this.$api('get', 'users').then(response => {
          if (response.data && response.data.length > 0) {
            this.users = response.data.filter(user => user._id !== this.$auth().user._id && user.login !== 'admin')
          }
        }).catch(e => {
          this.notify(e, 'danger')
        })
      },
      setSidebar () {
        this.$store.commit('app/setSidebar', 'tasks')
      },
      getUser (_id) {
        let user = this.$_.find(this.users, u => u._id === _id)
        return user ? user : {}
      },
      showTaskFromQuery () {
        let type = this.$_.get(this.$route, 'query.type', '')
        let taskId = this.$_.get(this.$route, 'query.task', '')
        if (type && taskId) {
          this.loadTasks().then((tasks) => {
            this.toggleModal(type, (this.$_.find(tasks, ['id', taskId*1])))
          })
        }
      }
    },

    mounted () {
      if (this.$auth().hasRole('admin')) {
        this.tableData.columns.push('admin')
      }
      this.loadTasks()
      this.loadUsers()
      this.setSidebar()
      this.showTaskFromQuery()
    },
    destroyed () {
      this.$store.commit('app/setSidebar', {})
    },
    watch: {
      '$route' (to, from) {
        this.loadTasks()
        this.showTaskFromQuery()
      }
    },
  }
</script>

<style lang="scss">
  /*tr.bg-danger { background-color: #ffebeb; }*/
  .table .urgency { font-size: 0.8em; padding: 5px 10px;
    /*&.label-default { background: #eee; }*/
  }

  .table .tools { position: relative; padding: 0 10px 0 5px; white-space: nowrap; cursor: pointer; }
  .table .tools .label { position: absolute; top: -8px; left: 8px; font-size: .6em; }
</style>
