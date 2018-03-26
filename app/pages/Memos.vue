<template>
  <div>
    <PageTitle :title="'Служебные записки'"></PageTitle>

    <PageButtons>
      <button class="btn btn-success" @click="toggleModal('create', {})"><i class="fa fa-file-text-o"></i>&nbsp;&nbsp;Создать служебную записку</button>
    </PageButtons>

    <Box>
      <v-client-table ref="table" v-bind="tableData" :data="filteredData" :columnsDropdown="true">
        <div slot="admin" slot-scope="props">
          <button class="btn btn-sm btn-default" @click="toggleModal('edit', $_.clone(props.row))"><i class="fa fa-edit"></i></button>
          <button class="btn btn-sm btn-danger" @click="toggleModal('delete', props.row._id)"><i class="fa fa-trash"></i></button>
        </div>
        <div slot="from" slot-scope="props">
          {{props.row.nameFrom}}
        </div>
        <div slot="to" slot-scope="props">
          {{getUsersTo(props.row.to)}}
        </div>
        <div slot="status" slot-scope="props">
          {{statuses[props.row.status]}}
        </div>
        <div slot="info" slot-scope="props">
          <span class="tools" @click="toggleModal('show', props.row, 2)">
            <span v-if="getCommentsCount(props.row)" class="label label-success">{{getCommentsCount(props.row)}}</span>
            <i class="fa fa-comment-o"></i>
          </span>
          <span class="tools" @click="toggleModal('show', props.row, 1)">
            <span v-if="$_.size(props.row.files)" class="label label-success">{{$_.size(props.row.files)}}</span>
            <i class="fa fa-file-o"></i>
          </span>
        </div>
        <div slot="tools" slot-scope="props">
          <div v-if="props.row.status === 0">
            <!--<a @click="toggleModal('confirm', props.row._id)">Согласовать</a>-->
            <!--<a @click="toggleModal('reject', props.row._id)">Отказать</a>-->
          </div>

          <button class="btn btn-default" @click="toggleModal('show', props.row)">
            <i class="fa fa-file-text-o"></i>&nbsp;&nbsp;Подробнее
          </button>
        </div>
      </v-client-table>
    </Box>

    <ModalCreate :model="modal.create" :users="users" @onSubmit="createMemo" @onClose="toggleModal('create')"></ModalCreate>
    <ModalEdit :model="modal.edit" :users="users" @onSubmit="editMemo" @onClose="toggleModal('edit')"></ModalEdit>
    <ModalShow :model="modal.show" :tab="modal.tab" :users="users" @onConfirm="confirmMemo" @onReject="rejectMemo" @onClose="toggleModal('show')"></ModalShow>
    <ModalDelete :model="modal.delete" @onSubmit="deleteMemo" @onClose="toggleModal('delete')"></ModalDelete>
  </div>
</template>

<script>
  import PageTitle from '@/PageTitle'
  import PageButtons from '@/PageButtons'
  import Box from '@/Box'
  import ModalCreate from './memos/ModalCreate'
  import ModalEdit from './memos/ModalEdit'
  import ModalShow from './memos/ModalShow'
  import ModalReject from './memos/ModalReject'
  import ModalConfirm from './memos/ModalConfirm'
  import ModalDelete from './memos/ModalDelete'

  export default {
    components: {
      PageTitle,
      PageButtons,
      Box,
      ModalCreate,
      ModalEdit,
      ModalReject,
      ModalConfirm,
      ModalShow,
      ModalDelete
    },
    data () {
      return {
        users: [],
        memos: [],
        modal: {
          show: false,
          create: false,
          edit: false,
          reject: false,
          confirm: false,
          tab: 0,
          delete: false
        },
        statuses: [
          'На согласовании',
          'Согласовано',
          'Отказано',
        ],
        tableData: {
          columns: ['id', 'name', 'status', 'from', 'to', 'info', 'tools',],
          options: {
            headings: {
              id: 'ID',
              admin: '',
              name: 'Тема',
              status: 'Статус',
              from: 'Исполнитель',
              to: 'Кому',
              info: 'Инфо',
              tools: 'Подробнее',
            },
            orderBy: {
              column: 'id',
              ascending: false
            },
            sortable: ['id', 'name', 'status', 'from', 'to',],
            filterable: ['id', 'name', 'status', 'from', 'to',],
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
            rowClassCallback (row) {
              return (row.urgency) ? 'bg-danger' : ''
            },
            columnsClasses: {
              admin: 'admin',
            },
            skin: 'table table-bordered',
          },
        },
      }
    },
    computed: {
      filteredData: {
        get: function () {
          let data = _.merge([], this.memos)

          _.map(data, memo => {
            let userFrom = _.find(this.users, u => u._id === memo.from)
            memo.nameFrom = userFrom ? userFrom.fullname : ''

            let to = memo.to[0] ? memo.to[0].user : false
            let userTo = _.find(this.users, u => u._id === to)
            memo.nameTo = userTo ? userTo.fullname : ''

            return memo
          })
          return data
        }
      }
    },

    methods: {
      getCommentsCount (model) {
        return this.$_.reduce(model.to, (result, m) => {
          if (m.answer !== 'undefined') {
            result++
          }
          return result
        }, 0)
      },
      toggleModal (name, model, tab) {
        this.modal[name] = model === undefined ? !this.modal[name] : model
        this.modal.tab = tab ? tab : 0
      },
      createMemo (memo) {
        let data = this.$createFormData(memo)
        this.$api('post', 'memos', data).then(response => {
          this.loadMemos()
          this.modal.create = false
          this.notify(response.data.message)
        }).catch(e => {
          this.notify('Временно нельзя создать служебную записку', 'info')
          this.$log(e, 'danger')
        })
      },
      editMemo (memo) {
        let data = this.$createFormData(memo)
        this.$api('put', 'memos/'+memo._id, data).then(response => {
          this.loadMemos()
          this.modal.edit = false
          this.notify(response.data.message)
        }).catch(e => {
          this.notify('Временно нельзя редактировать служебную записку', 'info')
          this.$log(e, 'danger')
        })
      },
      rejectMemo (memo) {
        let data = this.$createFormData(memo)
        this.$api('post', 'memos/reject/'+memo._id, data).then(response => {
          this.loadMemos()
          this.modal.show  = false
          this.notify(response.data.message)
        }).catch(e => {
//          this.notify(e, 'danger')
        })
      },
      confirmMemo (data) {
        let formData = this.$createFormData(data)
        this.$api('post', 'memos/confirm/'+data._id, formData).then(response => {
          this.loadMemos()
          this.modal.show = false
          this.notify(response.data.message)
        }).catch(e => {
//          this.notify(e, 'danger')
        })
      },
      deleteMemo (data) {
        this.$api('delete', `memos/${data}`).then(response => {
          this.modal.delete = false
          this.notify(response.data.message)
          this.memos = this.memos.filter(memo => memo._id != response.data.memoId)
        }).catch(error => {
          Object.keys(error.response.data.errors).forEach(err => {
            this.notify(error.response.data.errors[err].msg, 'danger')
          })
          this.modal.delete = false
        })
      },
      loadMemos () {
        let filter = this.$route.params.param1 ? `/?f=${this.$route.params.param1}` : ''
        this.$api('get', 'memos' + filter).then(response => {
          this.memos = response.data
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
      getUsersTo (to) {
        let names = this.$_.reduce(to, (data, v) => {
          if (v) {
            let user = this.$_.find(this.users, u => u._id === v.user)
            if (user) {
              data.push(user.fullname)
            }
            return data
          }
        }, [])
        return (this.$_.isArray(names)) ? names.join(', ') : ''
      }
    },
    mounted () {
      if (this.$auth().hasRole('admin')) {
        this.tableData.columns.push('admin')
      }
      this.loadMemos()
      this.loadUsers()

      this.$store.commit('app/setSidebar', 'documents')
    },
    destroyed () {
      this.$store.commit('app/setSidebar', {})
    },
    watch: {
      '$route' (to, from) {
        this.loadMemos()
      }
    },
  }
</script>

<style lang="scss">

  .table .tools { position: relative; padding: 0 10px 0 5px; white-space: nowrap; cursor: pointer; }
  .table .tools .label { position: absolute; top: -8px; left: 8px; font-size: .6em; }
</style>
