<template>
  <div>
    <PageTitle :title="'Служебные документы'"></PageTitle>

    <PageButtons>
      <button class="btn btn-success" @click="toggleModal('create', {})"><i class="fa fa-file-text-o"></i>&nbsp;&nbsp;Создать служебную записку</button>
    </PageButtons>

    <Box>
      <v-client-table ref="table" v-bind="tableData" :data="filteredData" :columnsDropdown="true">
        <div slot="admin" slot-scope="props">
          <button class="btn btn-sm btn-default" @click="toggleModal('edit', props.row)"><i class="fa fa-edit"></i></button>
          <!--<button class="btn btn-sm btn-danger" @click="toggleModal('reject', props.row._id)"><i class="fa fa-trash"></i></button>-->
        </div>
        <div slot="from" slot-scope="props">
          {{props.row.nameFrom}}
        </div>
        <div slot="to" slot-scope="props">
          {{props.row.nameTo}}
        </div>
        <div slot="status" slot-scope="props">
          {{statuses[props.row.status]}}
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
    <ModalShow :model="modal.show" :users="users" @onClose="toggleModal('show')"></ModalShow>
    <!--<ModalReject :model="modal.reject" @onSubmit="rejectMemo" @onClose="toggleModal('reject')"></ModalReject>-->
    <!--<ModalConfirm :model="modal.confirm" @onSubmit="confirmMemo" @onClose="toggleModal('confirm')"></ModalConfirm>-->
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
        modal: {
          show: false,
          create: false,
          edit: false,
          reject: false,
          confirm: false,
        },
        statuses: [
          'На согласовании',
          'Согласовано',
          'Отказано',
        ],
        tableData: {
          columns: ['id', 'admin', 'name', 'status', 'from', 'to', 'tools'],
          options: {
            headings: {
              id: 'ID',
              admin: '',
              name: 'Тема',
              status: 'Статус',
              from: 'Исполнитель',
              to: 'Кому',
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
      toggleModal (name, model) {
        this.modal[name] = model === undefined ? !this.modal[name] : model
      },
      createMemo (memo) {
        this.$api('post', 'memos', memo).then(response => {
          this.loadMemos()
          this.modal.create = false
          this.notify(response.data.message)
        }).catch(e => {
          this.notify('Временно нельзя создать служебную записку', 'info')
          this.$log(e, 'danger')
        })
      },
      editMemo (memo) {
        this.$api('put', 'memos/'+memo._id, memo).then(response => {
          this.loadMemos()
          this.modal.edit = false
          this.notify(response.data.message)
        }).catch(e => {
          this.notify('Временно нельзя редактировать служебную записку', 'info')
          this.$log(e, 'danger')
        })
      },
      rejectMemo (data) {
        this.$api('post', 'memos/reject/'+data.memoId, data).then(response => {
          this.loadMemos()
          this.modal.reject = false
          this.notify(response.data.message)
        }).catch(e => {
          this.notify(e, 'danger')
        })
      },
      confirmMemo (event, data) {
        this.$api('post', 'memos/confirm/'+data.memoId).then(response => {
          this.loadMemos()
          this.modalsIsOpen.confirm = false
          this.modalsData.confirm = false
          this.notify(response.data.message)
        }).catch(e => {
          this.notify(e, 'danger')
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
      }
    },
    mounted () {
      this.loadMemos()
      this.loadUsers()

      this.$store.commit('app/setSidebar', [
        {
          name: 'Служебные записки',
          isActive: () => this.$isRoute(['documents', 'documentsByFilter']),
          children: [
            {
              link: {name: 'documents'},
              name: 'Все',
              isActive: () => this.$isRoute('documents'),
            },
            {
              link: {name: 'documentsByFilter', params: {param1: 'in'}},
              name: 'Входящие',
              isActive: () => this.$isRoute('documentsByFilter', 'param1', 'in'),
            },
            {
              link: {name: 'documentsByFilter', params: {param1: 'out'}},
              name: 'Исходящие',
              isActive: () => this.$isRoute('documentsByFilter', 'param1', 'out'),
            },
            {
              link: {name: 'documentsByFilter', params: {param1: 'confirmation'}},
              name: 'На согласовании',
              isActive: () => this.$isRoute('documentsByFilter', 'param1', 'confirmation'),
            },
          ],
        },
//        {
//          link: {name: 'documentsByFilter1', params: {param1: 'doc'}},
//          name: 'Документы',
//          isActive: () => this.$isRoute('documentsByFilter1', 'param1', 'doc'),
//        },
      ])
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

<style lang="scss" scoped>

</style>
