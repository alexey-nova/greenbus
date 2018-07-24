<template>
  <div class="container-box">
    <div class="top-shadow text2">
      <memo-chain v-if="memoModel" :order="chain" :users="users" :positions="positions" :model="memoModel"></memo-chain>
    </div>
    <div class="working_area">
      <div class="white-block no-padding">
        <div class="padding-block">
          <div class="flex margin-bottom align-center">
            <div class="search">
            </div>
            <div class="add flex-end" v-if="$auth().user.position">
              <button class="add-button auto-width" @click="toggleModal('create', {})"><img src="~assets/img/add.png">Создать заявку</button>
              <download-excel
                v-if="computedBids.length > 0"
                class = "add-button auto-width"
                :data = "computedBids"
                :fields = "jsonFields"
                :name = "$dateFormat(new Date(), 'dd-mm-yyyy-HHMMss') + `.xls`">
                Скачать Excel файл
              </download-excel>
            </div>
          </div>
          <div class="mob-none">
            <v-client-table ref="table" v-bind="tableData" :data="sortBids(filteredData)" :columnsDropdown="true" @row-click="showTableRow">
              <div slot="h__choose" slot-scope="props">
                <input type="checkbox" @change="toggleAll">
              </div>
              <div slot="choose" slot-scope="props">
                <input type="checkbox" @change.stop="chooseId(props.row, $event)" v-model="chosenRow[props.row._id]" :checked="chosenRow[props.row._id]">
              </div>
              <div class="flex align-center sm-w" slot="tools" slot-scope="props">
                <a @click.stop="toggleModal('show', $_.clone(props.row))" class="green_anchor">Подробнее</a>
              </div>
              <div slot="status" slot-scope="props">
                <span :class="['status-tag', setTag(props.row)]">{{setTagText(props.row)}}</span>
              </div>
              <div class="border-none" slot="admin" slot-scope="props" v-if="isCreator(props.row)">
                <button class="button-table edit" @click="toggleModal('edit', $_.clone(props.row))"></button>
                <button class="button-table remove" @click="toggleModal('delete', props.row) "></button>
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
              :items="filteredData"
              :fields="mobTableData.fields">
              <template slot="id" slot-scope="row">
                <span>{{row.value}} (<a @click="toggleModal('show', row.item)" class="green_anchor">Подробнее</a>)</span>
              </template>
              <template slot="actions" slot-scope="row" v-if="isCreator(row.item)">
                <button class="button-table edit" @click="toggleModal('edit', $_.clone(row.item))"></button>
                <button class="button-table remove" @click="toggleModal('delete', row.item) "></button>
              </template>
            </b-table>
            <b-pagination :total-rows="mobTableData.totalRows" :per-page="mobTableData.perPage" v-model="mobTableData.currentPage"/>
          </div>
        </div>
      </div>
    </div>
    <ModalCreate v-if="modal.create" :model="modal.create" :users="users" :positions="positions" @onSubmit="createBid" @onClose="toggleModal('create')"></ModalCreate>
    <ModalEdit v-if="modal.edit" :model="modal.edit" :users="users" @onSubmit="editBid" @onClose="toggleModal('edit')"></ModalEdit>
    <ModalShow v-if="modal.show" :model="modal.show" :tab="modal.tab" :users="users" :getBids="loadBids" @onClose="toggleModal('show')"></ModalShow>
    <ModalDelete :model="modal.delete" @onSubmit="deleteBid" @onClose="toggleModal('delete')"></ModalDelete>
  </div>
</template>

<script>
import ModalCreate from './memos/ModalCreate'
import ModalEdit from './memos/ModalEdit'
import ModalShow from './memos/ModalShow'
import ModalReject from './memos/ModalReject'
import ModalConfirm from './memos/ModalConfirm'
import ModalDelete from './memos/ModalDelete'
import MemoChain from './memos/MemoChain'
import bTable from 'bootstrap-vue/es/components/table/table'
import bPagination from 'bootstrap-vue/es/components/pagination/pagination'

export default {
  components: {
    ModalCreate,
    ModalEdit,
    ModalReject,
    ModalConfirm,
    ModalShow,
    ModalDelete,
    MemoChain,
    bTable,
    bPagination
  },
  data () {
    return {
      users: [],
      memos: [],
      bids: [],
      chain: [],
      positions: [],
      memoModel: null,
      chosenBids: [],
      chosenRow: {},
      jsonFields: {
        'ID': 'id',
        'Тема': 'name',
        'Статус': 'statusName',
        'От кого': 'nameFrom',
        'Текущий исполнитель': 'currentUserName'
      },
      modal: {
        show: false,
        create: false,
        edit: false,
        reject: false,
        confirm: false,
        tab: 0,
        delete: false
      },
      statuses: {
        active: 'В работе',
        done: 'Завершено'
      },
      tableData: {
        columns: ['id', 'name', 'status', 'nameFrom', 'currentUserName', 'tools', 'admin'],
        options: {
          headings: {
            choose: '',
            id: 'ID',
            admin: '',
            name: 'Тема',
            status: 'Статус',
            nameFrom: 'От кого',
            currentUserName: 'Текущий исполнитель',
            tools: 'Подробнее'
          },
          // orderBy: {
          //   column: 'id',
          //   ascending: false
          // },
          sortable: ['id', 'name', 'status', 'nameFrom', 'currentUserName'],
          filterable: ['id', 'name', 'status', 'nameFrom', 'currentUserName'],
          customSorting: {
            id: function (ascending) {
              return (a, b) => {
                a = a.id * 1
                b = b.id * 1
                if (ascending) return a >= b ? 1 : -1
                return a <= b ? 1 : -1
              }
            }
          },
          columnsClasses: {
            admin: 'admin'
          },
          skin: 'table table-bordered'
        }
      },
      mobTableData: {
        fields: [
          { key: 'id', label: 'ID' },
          { key: 'name', label: 'Тема' },
          { key: 'nameFrom', label: 'От кого' },
          { key: 'currentUserName', label: 'Текущий исполнитель' },
          { key: 'actions', label: 'Действия' }
        ],
        currentPage: 1,
        perPage: 5,
        totalRows: 0,
        // pageOptions: [ 5, 10, 15 ],
        filter: null
      }
    }
  },
  computed: {
    filteredData: {
      get: function () {
        let data = _.merge([], this.bids)
        _.map(data, bid => {
          let userFrom = _.find(this.users, u => u._id === bid.createdBy)
          bid.nameFrom = userFrom ? userFrom.fullname : ''

          let currentUserName = _.find(this.users, u => u.position === bid.order[bid.currentUser].position)
          bid.currentUserName = currentUserName ? currentUserName.fullname : ''
          // active = в работе, declined = в работе, done = выполнено
          bid.statusName = bid.status === 'done' ? 'Выполнено' : 'В работе'
          return bid
        })
        return data
      }
    },
    computedBids () {
      const bids = []
      let keys = Object.keys(this.chosenRow)
      keys = keys.filter(item => this.chosenRow[item])
      return this.filteredData.filter(item => keys.includes(item._id))
    }
  },
  methods: {
    setTag (event) {
      if (event.deadlined) return 'red'
      if (event.order[event.currentUser].position === this.$auth().user.position && event.status !== 'done') return 'yellow'
      if (event.status === 'done') return 'green'
    },
    setTagText (event) {
      if (event.deadlined) return 'Просрочено!'
      if (event.order[event.currentUser].position === this.$auth().user.position && event.status !== 'done') return 'На согласовании'
      if (event.status === 'done') return 'Готово'
      return 'В работе'
    },
    posName (positionId) {
      return this.positions.find(item => item._id === positionId).name
    },
    avatar (user) {
      return this.getUser(user).avatar ? this.$config('app.fileUrl') + this.getUser(user).avatar + '?' + Math.random() : false
    },
    getUser (id) {
      return this.users.find(u => u._id === id)
    },
    toggleModal (name, model, tab) {
      this.modal[name] = model === undefined ? !this.modal[name] : model
      this.modal.tab = tab || 0
    },
    getCommentsCount (model) {
      return this.$_.reduce(model.to, (result, m) => {
        if (m.answer !== 'undefined') {
          result++
        }
        return result
      }, 0)
    },
    createBid (bid) {
      bid.templateId = bid.template._id
      delete bid.template
      bid.files = this.$_.map(bid.files, (f) => f.file)
      let data = this.$createFormData(bid)
      this.$api('post', 'bids', data).then(response => {
        this.loadBids()
        this.modal.create = false
        this.notify(response.data.message)
      }).catch(e => {
        this.notify('Временно нельзя создать служебную записку', 'info')
        this.$log(e, 'danger')
      })
    },
    editBid (bid) {
      bid.files = this.$_.map(bid.files, (f) => f.file)
      let data = this.$createFormData(bid)
      this.$api('put', `bids/${bid._id}`, data).then(response => {
        this.loadBids()
        this.modal.edit = false
        this.notify(response.data.message)
      }).catch(e => {
        this.notify('Временно нельзя редактировать служебную записку', 'info')
        this.$log(e, 'danger')
      })
    },
    isCreator (model) {
      return this.$auth().user._id === model.createdBy && model.currentUser === 0
    },
    deleteBid (data) {
      this.$api('delete', `bids/${data._id}`).then(response => {
        this.modal.delete = false
        this.notify(response.data.message)
        this.bids = this.bids.filter(bid => bid._id !== response.data.bid._id)
      }).catch(error => {
        Object.keys(error.response.data.errors).forEach(err => {
          this.notify(error.response.data.errors[err].msg, 'danger')
        })
        this.modal.delete = false
      })
    },
    sortBids (bids) {
      function isDeadlined(prevDeadline, hours) {
        function nextWorkDay(date, weekends = [0, 6]) {
          const tempDate = new Date(date)
          while (weekends.includes(tempDate.getDay())) {
            tempDate.setHours(tempDate.getHours() + 24)
          }
          return tempDate
        }
        function getDeadline(prevDeadline, hours, weekends) {
          let nextDeadline = nextWorkDay(new Date(prevDeadline), weekends)
          for (let ind = 0; ind < hours; ind++) {
            nextDeadline.setHours(nextDeadline.getHours() + 1)
            nextDeadline = nextWorkDay(nextDeadline, weekends)
          }
          return nextDeadline
        }
        const deadline = getDeadline(prevDeadline, hours)
        return deadline.getDate() < new Date().getDate()
      }

      let result = []
      let tempBids = [...bids].reverse()
      tempBids = tempBids.filter(bid => {
        if (bid.order[bid.currentUser].position !== this.$auth().user.position) { return true }
        const prevDeadline = new Date(bid.currentUser ? bid.order[bid.currentUser - 1].confirmedDate || bid.createdAt : bid.createdAt)
        const deadlineHours = bid.order[bid.currentUser].hours
        if (isDeadlined(prevDeadline, deadlineHours)) {
          bid.deadlined = true
          result.push(bid)
          return false
        }
        return true

      })
      tempBids = tempBids.filter(bid => {
        if (bid.order[bid.currentUser].position === this.$auth().user.position) {
          result.push(bid)
          return false
        }
        return true
      })
      result = [...result, ...tempBids]
      return result
    },
    loadBids () {
      let filter = this.$route.params.param1 ? `/?filter=${this.$route.params.param1}` : ''
      return this.$api('get', 'bids' + filter).then(response => {
        this.bids = response.data.bids
        return this.bids
      }).catch(e => {
        this.notify(e, 'danger')
      })
    },
    showTableRow (bid) {
      this.chain = bid.row.order.map(item => {
        item.user = this.users.find(u => u.position === item.position)
        return item
      })
      this.memoModel = bid.row
    },
    loadUsers () {
      this.$api('get', 'users').then(response => {
        this.users = response.data
      }).catch(e => {
        this.notify(e, 'danger')
      })
    },
    getMe () {
      return this.$api('get', `users/${this.$auth().user._id}`).then(response => {
        return response.data.user
      })
    },
    loadPositions () {
      this.$api('get', 'positions?all=true').then(response => {
        this.positions = response.data.positions
      })
    },
    chooseId (data, type) {
      if (type === 'all') {
        if (this.chosenBids.length > 0) {
          return this.chosenBids.length = 0
        }
        return this.bids
      }
      if (this.chosenBids.find(item => item._id === data._id)) this.chosenBids.filter(item => item._id !== data._id)
      this.chosenBids.push(data)
    },
    toggleAll (event) {
      this.chosenRow = this.bids.reduce((prev, item) => {
        prev[item._id] = event.target.checked
        return prev
      }, {})
    },
    showBidFromQuery () {
      let type = this.$_.get(this.$route, 'query.type', '')
      let bidId = this.$_.get(this.$route, 'query.bid', '')
      if (type && bidId) {
        this.loadBids().then(bids => {
          this.toggleModal(type, (this.$_.find(bids, ['_id', bidId])))
        })
      }
    },
    onFiltered (filteredItems) {
      this.mobTableData.totalRows = filteredItems.length
      this.mobTableData.currentPage = 1
    }
  },
  mounted () {
    this.loadBids().then(() => {
      this.getMe().then(user => {
        if (user.priveleges && user.priveleges.includes('excel')) this.tableData.columns.unshift('choose')
      })
    })
    this.loadUsers()
    this.showBidFromQuery()
    this.loadPositions()
    this.$store.commit('app/setSidebar', 'documents')
    this.mobTableData.totalRows = this.bids.length
  },
  destroyed () {
    this.$store.commit('app/setSidebar', {})
  },
  watch: {
    '$route' (to, from) {
      this.loadBids()
      this.showBidFromQuery()
    }
  },
  sockets: {
    notification: function (val) {
      if (this.$_.indexOf(val.to, this.$auth().user._id) !== -1) {
        this.loadBids()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.table .tools { position: relative; padding: 0 10px 0 5px; white-space: nowrap; cursor: pointer; }
.table .tools .label { position: absolute; top: -8px; left: 8px; font-size: .6em; }
.text2 {
  min-height: 54px;
}
.status-tag {
  width: 100px;
  text-align: center;
  padding: 3px 0;
  border-radius: 3px;
  background-color: #5ba4cf;
  display: inline-block;
  color: #fff;

  &.yellow {
    background-color: #fdd835;
    color: #000;
  }

  &.red {
    background-color: #a32a2a;
  }

  &.green {
    background-color: #1b8442;
  }
}
</style>
