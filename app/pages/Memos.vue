<template>
  <div>
    <PageTitle :title="'Служебные документы'"></PageTitle>

    <PageButtons>
      <button class="btn btn-success" @click="toggleModal('create')"><i class="fa fa-plus"></i>&nbsp;&nbsp;Создать</button>
    </PageButtons>

    <Box>
      <v-client-table ref="table" v-bind="tableData" :data="filteredData" :columnsDropdown="true">
        <div slot="admin" slot-scope="props">
          <button class="btn btn-sm btn-default" @click="toggleModal('edit', props.row._id)"><i class="fa fa-edit"></i></button>
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
            <a @click="toggleModal('confirm', props.row._id)">Согласовать</a>
            <a @click="toggleModal('reject', props.row._id)">Отказать</a>
          </div>
        </div>
      </v-client-table>
    </Box>

    <ModalCreate v-if="modalsIsOpen.create" :isOpen="true" :users="users" @onSubmit="createMemo" @onClose="toggleModal('create')"></ModalCreate>
    <ModalEdit v-if="modalsData.edit" :isOpen="true" :model="modalsData.edit" :users="users" @onSubmit="editMemo" @onClose="toggleModal('edit')"></ModalEdit>
    <ModalReject v-if="modalsData.reject" :isOpen="true" :model="modalsData.reject" @onSubmit="rejectMemo" @onClose="toggleModal('reject')"></ModalReject>
    <ModalConfirm v-if="modalsData.confirm" :isOpen="true" :model="modalsData.confirm" @onSubmit="confirmMemo" @onClose="toggleModal('confirm')"></ModalConfirm>
  </div>
</template>

<script>
  import PageTitle from '@/PageTitle'
  import PageButtons from '@/PageButtons'
  import Box from '@/Box'
  import ModalCreate from './memos/ModalCreate'
  import ModalEdit from './memos/ModalEdit'
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
    },
    data () {
      return {
        users: [],
        memos: [],
        modalsData: {
          create: false,
          edit: false,
          reject: false,
          confirm: false,
        },
        modalsIsOpen: {
          edit: false,
          create: false,
          reject: false,
          confirm: false,
        },
        statuses: [
          'На согласовании',
          'Согласовано',
          'Отказано',
        ],
        tableData: {
          columns: ['id', 'admin', 'name', 'text', 'status', 'from', 'to', 'tools'],
          options: {
            headings: {
              id: 'ID',
              admin: '',
              name: 'Задача',
              text: 'Комментарий',
              status: 'Статус',
              from: 'От кого',
              to: 'Исполнители',
              tools: '',
            },
            orderBy: {
              column: 'id',
              ascending: false
            },
            sortable: ['id', 'name', 'text', 'status', 'from', 'to',],
            filterable: ['id', 'name', 'text', 'status', 'from', 'to',],
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
          if (this.filter !== false) {
//            data = _.filter(data, o => {
//              if (this.filter === 'in') {
//                return o.to === '1'
//              }
//              if (this.filter === 'out') {
//                return o.from === '1'
//              }
//              if (this.filter === 'warn') {
//                return o.urgency
//              }
//              if (this.filter === 'warn') {
//                return false
//              }
//            })
          }
          return data
        }
      }
    },

    methods: {
      toggleModal (name, id = 0) {
        let memo = _.assign({}, _.find(this.memos, memo => id === memo._id))
        let modal = this.modalsIsOpen[name]
        if (name !== 'create' && !modal && memo) {
          this.modalsData[name] = memo
        } else {
          this.modalsData[name] = false
        }

        this.modalsIsOpen[name] = !modal
      },
      createMemo (event, memo) {
        this.$api('post', 'memos', memo).then(response => {
          this.loadMemos()
          this.modalsIsOpen.create = false
          this.notify(response.data.message)
        }).catch(e => {
          this.notify(e, 'danger')
        })
      },
      editMemo (event, memo) {
        this.$api('put', 'memos/'+memo._id, memo).then(response => {
          this.loadMemos()
          this.modalsIsOpen.edit = false
          this.modalsData.edit = false
          this.notify(response.data.message)
        }).catch(e => {
          this.notify(e, 'danger')
        })
      },
      rejectMemo (event, data) {
        this.$api('post', 'memos/reject/'+data.memoId, data).then(response => {
          this.loadMemos()
          this.modalsIsOpen.reject = false
          this.modalsData.reject = false
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
        this.$api('get', 'memos').then(response => {
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
              link: {name: 'documentsByFilter', params: {param1: 'all'}},
              name: 'Все',
              isActive: () => this.$isRoute('documentsByFilter', 'param1', 'all'),
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
              link: {name: 'documentsByFilter', params: {param1: 'warn'}},
              name: 'На согласовании',
              isActive: () => this.$isRoute('documentsByFilter', 'param1', 'warn'),
            },
          ],
        },
        {
          link: {name: 'documentsByFilter1', params: {param1: 'qweqw'}},
          name: 'Документы',
          isActive: () => this.$isRoute('documentsByFilter1', 'param1', 'qweqw'),
        },
      ])
    },
  }
</script>

<style lang="scss" scoped>

</style>
