<template>
  <div class="working_area">
    <div class="white-block no-padding">
      <div class="padding-block">
        <div class="flex margin-bottom align-center">
					<div></div>
					<div class="add flex-end">
						<button class="add-button auto-width" @click="toggleModal('create', { urgency: false })"><img src="~assets/img/add.png">Создать задачу</button>
					</div>
        </div>
        <div class="mob-none">
          <v-client-table ref="table" v-bind="tableData" :data="tasks" :columnsDropdown="true">
						<div slot="admin" slot-scope="props" v-if="props.row.from === $auth().user._id">
							<button class="button-table edit" @click="toggleModal('edit', $_.clone(props.row))"></button>
							<button class="button-table remove" @click="toggleModal('deleted', props.row)"></button>
						</div>
            <div slot="info" slot-scope="props">
              <span class="tools" @click="toggleModal('show', props.row, 2)">
                <span v-if="props.row.comments" class="label label-success">{{props.row.comments}}</span>
                <i class="fa fa-comment-o"></i>
              </span>
              <span class="tools" @click="toggleModal('show', props.row, 1)">
                <span v-if="$_.size(props.row.files)" class="label label-success">{{$_.size(props.row.files)}}</span>
                <i class="fa fa-file-o"></i>
              </span>
            </div>
            <div slot="tools" slot-scope="props">
							<a class="green_anchor pointer" @click="toggleModal('show', props.row)">Подробнее</a>
            </div>
            <div slot="from" slot-scope="props">
              {{getUser(props.row.from).fullname}}
            </div>
            <div slot="to" slot-scope="props">
              {{getUser(props.row.to.user).fullname}}
            </div>
            <div slot="urgency" slot-scope="props">
              <span v-if="props.row.urgency" class="label label-danger urgency">Важная</span>
            </div>
            <div slot="status" slot-scope="props">
              {{statuses[props.row.status]}}
            </div>
            <div slot="deadline" slot-scope="props">
              {{$dateFormat(props.row.deadline, 'd mmm yyyy')}}
            </div>
          </v-client-table>
        </div>
        <div class="mob-block">
					<div class="search">
            <input type="text" placeholder="Поиск" name="search" v-model="mobTableData.filter">
          </div>
          <b-table
            stacked
            :current-page="mobTableData.currentPage"
            :filter="mobTableData.filter"
            @filtered="onFiltered"
            :per-page="mobTableData.perPage"
            :items="tasks"
            :fields="mobTableData.fields">
            <template slot="name" slot-scope="row">
              <span>{{row.value}} (<a @click="toggleModal('show', {})" class="green_anchor">Подробнее</a>)</span>
            </template>
						<template slot="status" slot-scope="row">
							{{statuses[row.value]}}
						</template>
						<template slot="deadline" slot-scope="row">
							{{$dateFormat(row.value, 'd mmm yyyy')}}
						</template>
						<template slot="from" slot-scope="row">
							{{getUser(row.value).fullname}}
						</template>
						<template slot="to" slot-scope="row">
							{{getUser(row.value.user).fullname}}
						</template>
            <template slot="actions" slot-scope="row">
              <button class="button-table edit" @click="toggleModal('edit', $_.clone(row.item))"></button>
              <button class="button-table remove" @click="toggleModal('deleted', row.item) "></button>
            </template>
          </b-table>
          <b-pagination :total-rows="mobTableData.totalRows" :per-page="mobTableData.perPage" v-model="mobTableData.currentPage"/>
        </div>
      </div>
    </div>
		<ModalCreate :model="modal.create" :users="users" @onSubmit="createTask" @onClose="toggleModal('create')"></ModalCreate>
    <ModalEdit :model="modal.edit" :users="users" @onSubmit="editTask" @onClose="toggleModal('edit')"></ModalEdit>
    <ModalDelete :model="modal.deleted" @onSubmit="deleteTask" @onClose="toggleModal('deleted')"></ModalDelete>
    <ModalShow :model="modal.show" :tab="modal.tab" :users="users" @performTask="performTask" @rejectTask="rejectTask" @confirmTask="confirmTask" @onClose="toggleModal('show')"></ModalShow>
  </div>
</template>

<script>
  import ModalCreate from './tasks/ModalCreateTask'
  import ModalEdit from './tasks/ModalEditTask'
  import ModalDelete from './tasks/ModalDeleteTask'
	import ModalShow from './tasks/ModalShowTask'
	import bTable from 'bootstrap-vue/es/components/table/table'
	import bPagination from 'bootstrap-vue/es/components/pagination/pagination'

  export default {
    components: {
      ModalCreate,
      ModalEdit,
      ModalDelete,
			ModalShow,
			'b-table': bTable,
    	'b-pagination': bPagination
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
          columns: ['id', 'name', 'urgency', 'status', 'deadline', 'from', 'to', 'tools', 'admin'],
          options: {
            headings: {
              id: 'ID',
              admin: 'Управление',
              name: 'Задача',
              description: 'Описание',
              urgency: 'Приоритет',
              status: 'Статус',
              deadline: 'Срок до',
              from: 'От кого',
              to: 'Ответственный',
              tools: 'Информация',
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
				mobTableData: {
					fields: [
						{ key: 'name', label: 'Задача'},
						{ key: 'status', label: 'Статус'},
						{ key: 'deadline', label: 'Срок до'},
						{ key: 'from', label: 'От кого'},
						{ key: 'to', label: 'Ответственный'},
						{ key: 'actions', label: 'Управление'},
					],
					currentPage: 1,
					perPage: 5,
					totalRows: 0,
					// pageOptions: [ 5, 10, 15 ],
					filter: null
				}
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
        task.to = JSON.stringify(task.to)
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
          if (e.response.data && e.response.data.errors) {
            Object.keys(e.response.data.errors).forEach(key => {
              this.notify(e.response.data.errors[key].msg, 'danger')
            })
          }
          this.modal.deleted = false
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
        let formData = this.$createFormData(model)
        this.$api('post', 'tasks/confirm/' + model._id, formData).then(response => {
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
            this.users = response.data
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
            this.toggleModal(type, (this.$_.find(tasks, ['_id', taskId])))
          })
        }
			},
			onFiltered (filteredItems) {
				this.mobTableData.totalRows = filteredItems.length
				this.mobTableData.currentPage = 1
			}
    },

    mounted () {
      this.loadTasks()
      this.loadUsers()
      this.setSidebar()
			this.showTaskFromQuery()
    	this.mobTableData.totalRows = this.tasks.length
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
