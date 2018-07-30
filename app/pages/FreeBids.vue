<template>
  <div class="container-box">
    <div class="top-shadow text2">
    </div>
    <div class="working_area">
      <div class="white-block no-padding">
        <div class="padding-block">
          <div class="flex margin-bottom align-center">
            <div class="search">
            </div>
            <div class="add flex-end" v-if="$auth().user.position">
              <button class="add-button auto-width" @click="toggleModal('create', {})"><img src="~assets/img/add.png">Создать заявку</button>
            </div>
          </div>
          <div class="mob-none">
            <v-client-table ref="table" v-bind="tableData" :data="filteredData" :columnsDropdown="true">
              <div class="flex align-center sm-w" slot="tools" slot-scope="props">
                <a @click.stop="toggleModal('show', $_.clone(props.row))" class="green_anchor">Подробнее</a>
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
    <modal-create-custom-bid v-if="modal.create" :model="modal.create" :users="users" :positions="positions" @onSubmit="createBid" @onClose="toggleModal('create')"></modal-create-custom-bid>
    <modal-edit-custom-bid v-if="modal.edit" :model="modal.edit" :users="users" @onSubmit="editBid" @onClose="toggleModal('edit')"></modal-edit-custom-bid>
    <modal-show-custom-bid v-if="modal.show" :model="modal.show" :tab="modal.tab" :users="users" @onSubmit="acceptBid" @onClose="toggleModal('show')"></modal-show-custom-bid>
    <modal-delete-custom-bid :model="modal.delete" @onSubmit="deleteBid" @onClose="toggleModal('delete')"></modal-delete-custom-bid>
  </div>
</template>

<script>
import ModalCreateBid from './freeBids/ModalCreateBid'
import ModalEditBid from './freeBids/ModalEditBid'
import ModalShowBid from './freeBids/ModalShowBid'
import ModalDeleteBid from './freeBids/ModalDeleteBid'
import bTable from 'bootstrap-vue/es/components/table/table'
import bPagination from 'bootstrap-vue/es/components/pagination/pagination'

export default {
  name: 'free-memos',
  components: {
    'modal-create-custom-bid': ModalCreateBid,
    'modal-edit-custom-bid': ModalEditBid,
    'modal-show-custom-bid': ModalShowBid,
    'modal-delete-custom-bid': ModalDeleteBid,
    bTable,
    bPagination
  },
  data () {
    return {
      users: [],
      bids: [],
      positions: [],
      modal: {
        show: false,
        create: false,
        edit: false,
        tab: 0,
        delete: false
      },
      tableData: {
        columns: ['id', 'name', 'nameFrom', 'toUsersName', 'tools', 'admin'],
        options: {
          headings: {
            choose: '',
            id: 'ID',
            admin: '',
            name: 'Тема',
            nameFrom: 'От кого',
            toUsersName: 'Кому',
            tools: 'Подробнее'
          },
          orderBy: {
            column: 'id',
            ascending: false
          },
          sortable: ['id', 'name', 'nameFrom', 'toUsersName'],
          filterable: ['id', 'name', 'nameFrom', 'toUsersName'],
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
          { key: 'toUsersName', label: 'Кому' },
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
    filteredData () {
      let data = this.bids
      data = data.map(bid => {
        const nameFrom = this.users.find(user => user._id === bid.createdBy)
        bid.nameFrom = nameFrom && nameFrom.fullname

        let users = this.users.filter(user => bid.to.map(t => t.user).includes(user._id)).map(user => user.fullname).join(', ')
        bid.toUsersName = users
        return bid
      })
      return data
    }
  },
  methods: {
    toggleModal (name, model, tab) {
      this.modal[name] = model === undefined ? !this.modal[name] : model
      this.modal.tab = tab || 0
    },
    /**
     * isCreator - определяет, является ли текущий пользователь создателем заявки
    */
    isCreator (model) {
      return this.$auth().user._id === model.createdBy
    },
    loadBids () {
      let filter = this.$route.params.param1 ? `/?filter=${this.$route.params.param1}` : ''
      return this.$api('get', 'freebids' + filter).then(response => {
        this.bids = response.data.bids
        return this.bids
      }).catch(e => {
        this.notify(e, 'danger')
      })
    },
    createBid (bid) {
      bid.files = this.$_.map(bid.files, (f) => f.file)
      let data = this.$createFormData(bid)
      this.$api('post', 'freebids', data).then(response => {
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
      this.$api('put', `freeBids/${bid._id}`, data).then(response => {
        this.loadBids()
        this.modal.edit = false
        this.notify(response.data.message)
      }).catch(e => {
        this.notify('Временно нельзя редактировать служебную записку', 'info')
        this.$log(e, 'danger')
      })
    },
    deleteBid (data) {
      this.$api('delete', `freebids/${data._id}`).then(response => {
        this.modal.delete = false
        this.notify(response.data.message)
        this.bids = this.bids.filter(bid => bid._id !== response.data.bid._id)
      }).catch(error => {
        this.modal.delete = false
      })
    },
    acceptBid (data) {
      this.$api('post', `freebids/accept/${data._id}`, data).then(response => {
        this.notify(response.data.message)
        this.modal.show = false
        this.loadBids()
      })
    },
    loadUsers () {
      this.$api('get', 'users').then(response => {
        this.users = response.data
      }).catch(e => {
        this.notify(e, 'danger')
      })
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
  beforeMount () {
    this.loadBids()
    this.loadUsers()
  },
  mounted () {
    this.$store.commit('app/setSidebar', 'documents')
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

<style>

</style>
