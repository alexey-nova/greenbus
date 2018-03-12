<template>
  <div>
    <PageTitle :title="'Платежный календарь'"></PageTitle>

    <PageButtons>
      <button class="btn btn-success" @click="toggleModal('create', {})"><i class="fa fa-file-text-o"></i>&nbsp;&nbsp;Создать платежный календарь</button>
    </PageButtons>

    <Box>
      <v-client-table ref="table" v-bind="tableData" :data="filteredData" :columnsDropdown="true">
        <div slot="admin" slot-scope="props">
          <button class="btn btn-sm btn-default" @click="toggleModal('edit', $_.clone(props.row))"><i class="fa fa-edit"></i></button>
          <!--<button class="btn btn-sm btn-danger" @click="toggleModal('reject', props.row._id)"><i class="fa fa-trash"></i></button>-->
        </div>
        <div slot="to" slot-scope="props">
          {{getUsersTo(props.row.to)}}
        </div>
        <div slot="createdAt" slot-scope="props">
          {{ getDate(props.row.createdAt) }}
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

    <ModalCreate :model="modal.create" :users="computedUsers" @onSubmit="addPS" @onClose="toggleModal('create')"></ModalCreate>
    <ModalEdit :model="modal.edit" :users="computedUsers" @onSubmit="editPS" @onClose="toggleModal('edit')"></ModalEdit>
    <ModalShow :model="modal.show" :tab="modal.tab" :users="users" @onConfirm="confirmPS" @onReject="rejectPS" @onClose="toggleModal('show')"></ModalShow>
  </div>
</template>

<script>
  import PageTitle from '@/PageTitle'
  import PageButtons from '@/PageButtons'
  import Box from '@/Box'
  import ModalCreate from './paymentSchedule/ModalCreate'
  import ModalEdit from './paymentSchedule/ModalEdit'
  import ModalShow from './paymentSchedule/ModalShow'
  import ModalReject from './memos/ModalReject'
  import ModalConfirm from './memos/ModalConfirm'

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
    },
    data () {
      return {
        users: [],
        memos: [],
        ps: [],
        currentHead: '',
        modal: {
          show: false,
          create: false,
          edit: false,
          reject: false,
          confirm: false,
          tab: 0,
        },
        statuses: [
          'На согласовании',
          'Согласовано',
          'Отказано',
        ],
        tableData: {
          columns: ['id', 'provider', 'to', 'createdAt', 'contractNo', 'totalAmount', 'prepayment', 'info', 'tools',],
          options: {
            headings: {
              id: 'ID',
              admin: '',
              // name: 'Тема',
              // status: 'Статус',
              provider: 'Поставщик',
              createdAt: 'Дата',
              contractNo: 'Контракт #/Дата',
              totalAmount: 'Общая сумма контракта, инвойса',
              prepayment: 'Сумма предоплаты',
              to: 'Кому',
              info: '',
              tools: '',
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
              info: 'td-tools',
            },
            skin: 'table table-bordered',
          },
        },
      }
    },
    computed: {
      filteredData: {
        get: function () {
          let data = _.merge([], this.ps)

          _.map(data, ps => {
            let userFrom = _.find(this.users, u => u._id === ps.from)
            ps.nameFrom = userFrom ? userFrom.fullname : ''

            let to = ps.to[0] ? ps.to[0].user : false
            let userTo = _.find(this.users, u => u._id === to)
            ps.nameTo = userTo ? userTo.fullname : ''

            return ps
          })
          return data
        }
      },
      computedUsers () {
        return this.users.filter(user => {
          if (user._id !== this.$auth().user._id && user._id !== this.currentHead && user.login !== 'admin') return true
        })
      }
    },

    methods: {
      getDate (date) {
        const newDate = new Date(date)
        const dates = ['янв', 'фев', 'мар', 'апр', 'мая', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек']
        return `${newDate.getDate()} ${dates[newDate.getMonth()]} ${newDate.getFullYear()} ${newDate.getHours()}:${newDate.getMinutes()}`
      },
      loadPS () {
        const filter = this.$route.params.param1 ? `?f=${this.$route.params.param1}` : ''
        this.$api('get', `paymentSchedules/${filter}`).then(response => {
          this.ps = response.data
        }).catch(e => {
          this.notify(e, 'danger')
        })
      },
      addPS (ps) {
        ps.files = this.$_.reduce(ps.files, (result, f) => {
          if (f.file) {
            result.push(f.file)
          }
          return result
        }, [])
        const data = this.$createFormData(ps)
        this.$api('post', 'paymentSchedules', data).then(response => {
          if (response.data.paymentSchedule) {
            this.ps.push(response.data.paymentSchedule)
            this.modal.create = false
            this.notify(response.data.message)
          }
        }).catch(e => {
          this.notify(e, 'danger')
        })
      },
      editPS (ps) {
        ps.files = this.$_.reduce(ps.files, (result, f) => {
          if (f.file) {
            result.push(f.file)
          }
          return result
        }, [])
        const data = this.$createFormData(ps)
        this.$api('put', 'paymentSchedules/'+ps._id, data).then(response => {
            this.loadPS()
            this.modal.edit = false
            this.notify(response.data.message)
        }).catch(e => {
          this.notify(e, 'danger')
        })
      },
      confirmPS (ps) {
        this.$api('post', `paymentSchedules/confirm/${ps._id}`).then(response => {
          this.modal.show = false
          this.notify(response.data.message)
          this.loadPS()
        }).catch(e => {
          this.notify(e, 'danger')
        })
      },
      rejectPS (ps) {
        this.$api('post', `paymentSchedules/reject/${ps._id}`, ps).then(response => {
          this.modal.show = false
          this.notify(response.data.message)
        }).catch(e => {
          this.notify(e, 'danger')
        })
      },
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
      loadUsers () {
        this.$api('get', 'users').then(response => {
          this.$api('get', 'users/psHead').then(psResponse => {
            if (response.data && response.data.length > 0) {
              this.currentHead = psResponse.data.user.currentHead
              this.users = response.data
            }
          })

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
      this.loadUsers()
      this.loadPS()
      this.$store.commit('app/setSidebar', 'documents')
    },
    destroyed () {
      this.$store.commit('app/setSidebar', {})
    },
    watch: {
      '$route' (to, from) {
        this.loadPS()
      }
    },
  }
</script>

<style lang="scss">
  .table .td-tools { min-width: 80px; }

  .table .tools { position: relative; padding: 0 10px 0 5px; white-space: nowrap; }
  .table .tools .label { position: absolute; top: -8px; left: 8px; font-size: .6em; }
</style>
