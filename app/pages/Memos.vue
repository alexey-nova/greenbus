<template>
  <div class="container-box">
    <div class="top-shadow text2">
      <div class="stage2">
        <a class="stage2-item green">
          <img src="~assets/img/user.jpg">
          <div class="absolut-box">
            <div class="stage-flex flex green">
              <div class="stage-text">
                <p>Жумагалиев АБ</p>
                <p class="italic">Должность</p>
              </div>
              <div class="stage-date">
                <span>24.05.2017</span>
              </div>
            </div>
          </div>
        </a>
        <a href="#" class="stage2-item gray">
          <img src="~assets/img/user.jpg">
          <div class="absolut-box">
            <div class="stage-flex flex gray">
              <div class="stage-text">
                <p>Жумагалиев АБ</p>
                <p class="italic">Должность</p>
              </div>
              <div class="stage-date">
                <span>24.05.2017</span>
              </div>
            </div>
          </div>
        </a>
        <a href="#" class="stage2-item gray">
          <img src="~assets/img/user.jpg">
          <div class="absolut-box">
            <div class="stage-flex flex gray">
              <div class="stage-text">
                <p>Жумагалиев АБ</p>
                <p class="italic">Должность</p>
              </div>
              <div class="stage-date">
                <span>24.05.2017</span>
              </div>
            </div>
          </div>
        </a>
        <a href="#" class="stage2-item yellow">
          <img src="~assets/img/user.jpg">
          <div class="absolut-box">
            <div class="stage-flex flex yellow">
              <div class="stage-text">
                <p>Жумагалиев АБ</p>
                <p class="italic">Должность</p>
              </div>
              <div class="stage-date">
                <span>24.05.2017</span>
              </div>
            </div>
          </div>
        </a>
        <a href="#" class="stage2-item red">
          <img src="~assets/img/user.jpg">
          <div class="absolut-box">
            <div class="stage-flex flex red">
              <div class="stage-text">
                <p>Жумагалиев АБ</p>
                <p class="italic">Должность</p>
              </div>
              <div class="stage-date">
                <span>24.05.2017</span>
              </div>
            </div>
          </div>
        </a>
      </div>
    </div>
    <div class="working_area">
      <div class="white-block no-padding">
        <div class="padding-block">
          <div class="flex margin-bottom align-center">
            <div class="search">
            </div>
            <div class="add flex-end">
              <button class="add-button auto-width" @click="toggleModal('create', {})"><img src="~assets/img/add.png">Создать заявку</button>
            </div>
          </div>
          <div class="mob-none">
            <v-client-table ref="table" v-bind="tableData" :data="filteredData" :columnsDropdown="true">
              <div class="flex align-center sm-w" slot="tools" slot-scope="props">
                <a @click="toggleModal('show', $_.clone(props.row))" class="green_anchor">Подробнее</a>
              </div>
              <div class="border-none" slot="admin" slot-scope="props" v-if="$auth().hasRole('admin')">
                <button class="button-table edit" @click="toggleModal('edit', $_.clone(props.row))"></button>
                <button class="button-table remove" @click="toggleModal('delete', props.row) "></button>
              </div>
            </v-client-table>
          </div>
          <div class="mob-block">
              <div class="filter">
                  <div class="search">
                      <a href="#" class="filter-a">
                          <span>Фильтр</span>
                          <img src="assets/img/left.png">
                      </a>
                      <form action="" method="">
                          <ul>
                              <li>
                                  <input type="text" placeholder="Тема" name="search">
                                  <button class="add-button" type="submit"><img src="assets/img/search.png"></button>
                              </li>
                              <li>
                                  <input type="text" placeholder="Исполнитель" name="search">
                                  <button class="add-button" type="submit"><img src="assets/img/search.png"></button>
                              </li>
                          </ul>
                      </form>
                  </div>


              </div>
              <table width="100%" class="mob-margin">
                  <tr class="green">
                      <td>
                          <div class="flex">
                              <div class="m-item">
                                  <span>ID №1</span>
                              </div>
                              <div class="m-item">
                              </div>
                          </div>
                      </td>
                  </tr>
                  <tr>
                      <td>
                          <span>Тема:</span>
                          <span class="bold">Тема</span>
                      </td>
                  </tr>
                  <tr>
                      <td>
                          <span>Дата:</span>
                          <span class="bold">Дата</span>
                      </td>
                  </tr>
                  <tr>
                      <td>
                          <span>Исполнитель:</span>
                          <span class="bold">Исполнитель</span>
                      </td>
                  </tr>
                  <tr>
                      <td>
                          <div class="flex align-center">
                              <div class="m-item">
                                  <div class="flex">
                                      <button class="button-table edit" data-toggle="modal" data-target="#edit-application"></button>
                                      <button class="button-table remove" data-toggle="modal" data-target="#remove-application"></button>
                                  </div>
                              </div>
                              <div class="m-item">
                                  <a href="#" class="green_anchor" data-toggle="modal" data-target="#info-order">Подробнее</a>
                              </div>
                          </div>
                      </td>
                  </tr>
              </table>
              <table width="100%" class="mob-margin">
                  <tr class="green">
                      <td>
                          <div class="flex">
                              <div class="m-item">
                                  <span>ID №1</span>
                              </div>
                              <div class="m-item">
                              </div>
                          </div>
                      </td>
                  </tr>
                  <tr>
                      <td>
                          <span>Тема:</span>
                          <span class="bold">Тема</span>
                      </td>
                  </tr>
                  <tr>
                      <td>
                          <span>Дата:</span>
                          <span class="bold">Дата</span>
                      </td>
                  </tr>
                  <tr>
                      <td>
                          <span>Исполнитель:</span>
                          <span class="bold">Исполнитель</span>
                      </td>
                  </tr>
                  <tr>
                      <td>
                          <div class="flex align-center">
                              <div class="m-item">
                                  <div class="flex">
                                      <button class="button-table edit" data-toggle="modal" data-target="#edit-application"></button>
                                      <button class="button-table remove" data-toggle="modal" data-target="#remove-application"></button>
                                  </div>
                              </div>
                              <div class="m-item">
                                  <a href="#" class="green_anchor" data-toggle="modal" data-target="#info-order">Подробнее</a>
                              </div>
                          </div>
                      </td>
                  </tr>
              </table>
          </div>
        </div>
      </div>
    </div>
    <ModalCreate v-if="modal.create" :model="modal.create" @onSubmit="createBid" @onClose="toggleModal('create')"></ModalCreate>
    <ModalEdit :model="modal.edit" :users="users" @onSubmit="editMemo" @onClose="toggleModal('edit')"></ModalEdit>
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

  export default {
    components: {
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
        bids: [],
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
          columns: ['name', 'status', 'nameFrom', 'currentUserName', 'tools'],
          options: {
            headings: {
              id: 'ID',
              admin: '',
              name: 'Тема',
              status: 'Статус',
              nameFrom: 'От кого',
              currentUserName: 'Текущий исполнитель',
              tools: 'Подробнее',
            },
            orderBy: {
              column: 'id',
              ascending: false
            },
            sortable: ['id', 'name', 'status', 'nameFrom', 'currentUserName'],
            filterable: ['id', 'name', 'status', 'nameFrom', 'currentUserName'],
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
            skin: 'table table-bordered',
          },
        },
      }
    },
    computed: {
      filteredData: {
        get: function () {
          let data = _.merge([], this.bids)
          _.map(data, bid => {
            let userFrom = _.find(this.users, u => u._id === bid.createdBy)
            bid.nameFrom = userFrom ? userFrom.fullname : ''

            let currentUserName = _.find(this.users, u => u.positionId === bid.order[bid.currentUser].position)
            bid.currentUserName = currentUserName ? currentUserName.fullname : ''
            return bid
          })
          return data
        }
      }
    },
    methods: {
      toggleModal (name, model, tab) {
        this.modal[name] = model === undefined ? !this.modal[name] : model
        this.modal.tab = tab ? tab : 0
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
      editMemo (memo) {
        let data = this.$createFormData(memo)
        this.$api('put', 'memos/'+memo._id, data).then(response => {
          this.loadBids()
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
          this.loadBids()
          this.modal.show  = false
          this.notify(response.data.message)
        }).catch(e => {
//          this.notify(e, 'danger')
        })
      },
      confirmMemo (data) {
        let formData = this.$createFormData(data)
        this.$api('post', 'memos/confirm/'+data._id, formData).then(response => {
          this.loadBids()
          this.modal.show = false
          this.notify(response.data.message)
        }).catch(e => {
//          this.notify(e, 'danger')
        })
      },
      deleteBid (data) {
        this.$api('delete', `bids/${data._id}`).then(response => {
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
      loadBids () {
        let filter = this.$route.params.param1 ? `/?filter=${this.$route.params.param1}` : ''
        return this.$api('get', 'bids' + filter).then(response => {
          return this.bids = response.data.bids
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
      showMemoFromQuery () {
        let type = this.$_.get(this.$route, 'query.type', '')
        let memoId = this.$_.get(this.$route, 'query.memo', '')
        if (type && memoId) {
          this.loadBids().then(memos => {
            this.toggleModal(type, (this.$_.find(memos, ['_id', memoId])))
          })
        }
      }
    },
    mounted () {
      if (this.$auth().hasRole('admin')) {
        this.tableData.columns.push('admin')
      }
      this.loadBids()
      this.loadUsers()
      this.showMemoFromQuery()

      this.$store.commit('app/setSidebar', 'documents')
    },
    destroyed () {
      this.$store.commit('app/setSidebar', {})
    },
    watch: {
      '$route' (to, from) {
        this.loadBids()
      }
    },
    sockets: {
      notification: function (val) {
        if (this.$_.indexOf(val.to, this.$auth().user._id) !== -1) {
          this.loadBids()
        }
      },
    },
  }
</script>

<style lang="scss">

  .table .tools { position: relative; padding: 0 10px 0 5px; white-space: nowrap; cursor: pointer; }
  .table .tools .label { position: absolute; top: -8px; left: 8px; font-size: .6em; }
</style>
