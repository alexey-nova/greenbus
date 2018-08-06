<template>
  <div>
    <div class="container-box">
      <div class="top-shadow"></div>
      <div class="working_area">
        <div class="white-block no-padding">
          <div class="padding-block">
            <div v-if="!$route.params.folderId">
              <div class="flex margin-bottom align-center">
                <div class="search">
                </div>
                <div class="add flex-end">
                  <button class="add-button auto-width" @click="toggleModal('create', {})"><img src="~assets/img/add.png">Создать папку</button>
                </div>
              </div>
              <div class="mob-none">
                <v-client-table ref="table" v-bind="tableData" :data="mainFolders" :columnsDropdown="true" @row-click="enterFolder">
                  <div class="border-none" slot="admin" slot-scope="props">
                    <button class="button-table remove" @click.stop="toggleModal('delete', props.row) "></button>
                  </div>
                </v-client-table>
              </div>
              <div class="mob-block">
                <div>
                  <input type="text" placeholder="Поиск" name="search" v-model="mobTableData.filter">
                </div>
                <b-table
                  stacked
                  :current-page="mobTableData.currentPage"
                  :filter="mobTableData.filter"
                  @filtered="onFiltered"
                  :per-page="mobTableData.perPage"
                  :items="mainFolders"
                  :fields="mobTableData.fields">
                  <template slot="name" slot-scope="row">
                    <span>{{row.value}} (<a @click="enterFolder(row.item)" class="green_anchor">Подробнее</a>)</span>
                  </template>
                  <template slot="actions" slot-scope="row">
                    <button class="button-table remove" @click.stop="toggleModal('delete', row.item)"></button>
                  </template>
                </b-table>
                <b-pagination :total-rows="mobTableData.totalRows" :per-page="mobTableData.perPage" v-model="mobTableData.currentPage"/>
              </div>
            </div>
            <div v-if="$route.params.folderId">
              <div class="flex margin-bottom align-center m-column">
                <div class="search">
                  <form @submit.prevent="search">
                    <input type="text" placeholder="Поиск" name="search" v-model="query">
                    <button class="add-button" type="submit"><img src="~assets/img/search.png"></button>
                  </form>
                </div>
                <router-link v-if="!content.parentFolder" :to="{ name: 'contragents'}" tag="a">
                  <button class="add-button auto-width back"><img src="~assets/img/left.png"><span>Назад</span></button>
                </router-link>
                <router-link v-if="content.parentFolder" :to="{ name: 'folder', params: { folderId: content.parentFolder._id }}" tag="a">
                  <button class="add-button auto-width back"><img src="~assets/img/left.png"><span>Назад</span></button>
                </router-link>
                <div class="add auto">
                  <button class="add-button auto-width" @click="toggleModal('createFile')" ><img src="~assets/img/left.png" class="rotate">Загрузить файл</button>
                  <button class="add-button auto-width" @click="toggleModal('createFolder', {})"><img src="~assets/img/add.png">Создать папку</button>
                </div>
              </div>
              <div v-if="chosenIds.length > 0" class="flex margin-bottom align-center m-column" style="width:50%; float:right">
                <a></a>
                <div class="add auto">
                  <button type="button" class="add-button auto-width" @click="toggleModal('moveFilesAndFolders', {})">Переместить</button>
                  <button type="button" class="add-button auto-width" @click="toggleModal('deleteFilesAndFolders')">Удалить</button>
                </div>
              </div>
              <div class="folders">
                <div class="folders-box" style="margin-top: 3.2em">
                  <a v-if="$route.params.folderId" v-for="(item, index) in content.childFolders" :key="index" class="folders-item fol-box">
                    <router-link :to="{ name: 'folder', params: { folderId: item._id }}" tag="div" class="folder-border">
                      <div :class="['folder-img', {'selected': chosenIds.includes(item._id)}]">
                        <img src="~assets/img/folder-2.png" class="block">
                        <img src="~assets/img/folder-2-h.png" class="none">
                      </div>
                      <div class="folder-text">
                        <span>{{ item.name }}</span>
                      </div>
                    </router-link>
                    <div class="folder-buttons">
                      <button type="button" class="button-table" @click="chooseId(item._id)">...</button>
                      <button type="button" class="button-table edit" @click="toggleModal('renameFolder', $_.clone(item))"></button>
                    </div>
                  </a>
                  <a v-if="$route.params.folderId" v-for="item in content.files" :key="item._id" class="folders-item fol-box">
                    <a :href="$config('app.fileUrl') + item.path" target="_blank" class="folder-border">
                      <div :class="['folder-img sm-img', {'selected': chosenIds.includes(item._id)}]">
                        <img src="~assets/img/file.png" class="block">
                        <img src="~assets/img/file-h.png" class="none">
                      </div>
                      <div class="folder-text">
                        <span>{{ item.name }}</span>
                      </div>
                    </a>
                    <div class="folder-buttons">
                      <button type="button" class="button-table" @click="chooseId(item._id)">...</button>
                      <button type="button" class="button-table edit" @click="toggleModal('renameFile', $_.clone(item))"></button>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <ModalCreate :model="modal.create" @onSubmit="createCA" @onClose="toggleModal('create')"></ModalCreate>
    <ModalCreateFolder :model="modal.createFolder" @onSubmit="createFolder" @onClose="toggleModal('createFolder')"></ModalCreateFolder>
    <ModalCreateFile :model="modal.createFile" :uploadingFiles="uploadingFiles" @onSubmit="uploadFiles" @onClose="toggleModal('createFile')"></ModalCreateFile>
    <ModalMove v-if="modal.moveFilesAndFolders" :ids="chosenIds" :model="modal.moveFilesAndFolders" @onSubmit="moveFilesAndFolders" @onClose="toggleModal('moveFilesAndFolders')"></ModalMove>
    <ModalRenameFolder v-if="modal.renameFolder" :model="modal.renameFolder" @onSubmit="renameFolder" @onClose="toggleModal('renameFolder')"></ModalRenameFolder>
    <ModalRenameFile v-if="modal.renameFile" :model="modal.renameFile" @onSubmit="renameFile" @onClose="toggleModal('renameFile')"></ModalRenameFile>
    <modal-rename v-if="modal.rename" :model="modal.rename" @onSubmit="rename" @onClose="toggleModal('rename')"></modal-rename>
    <ModalDelete :model="modal.delete" @onSubmit="deleteCA" @onClose="toggleModal('delete')"></ModalDelete>
    <ModalDeleteFilesAndFolders :model="modal.deleteFilesAndFolders" @onSubmit="deleteFilesAndFolders" @onClose="toggleModal('deleteFilesAndFolders')"></ModalDeleteFilesAndFolders>
  </div>
</template>

<script>
import ModalCreate from './contragents/ModalCreate'
import ModalCreateFolder from './contragents/ModalCreateFolder'
import ModalCreateFile from './contragents/ModalCreateFile'
import ModalMove from './contragents/ModalMove'
import ModalRenameFolder from './contragents/ModalRenameFolder'
import ModalRenameFile from './contragents/ModalRenameFile'
import ModalDelete from './contragents/ModalDelete'
import ModalDeleteFilesAndFolders from './contragents/ModalDeleteFilesAndFolders'
import bTable from 'bootstrap-vue/es/components/table/table'
import bPagination from 'bootstrap-vue/es/components/pagination/pagination'

export default {
  components: {
    ModalCreate,
    ModalCreateFolder,
    ModalCreateFile,
    ModalMove,
    ModalRenameFolder,
    ModalRenameFile,
    ModalDelete,
    ModalDeleteFilesAndFolders,
    'b-table': bTable,
    'b-pagination': bPagination
  },
  data () {
    return {
      modal: {
        create: false,
        createFolder: false,
        createFile: false,
        moveFilesAndFolders: false,
        renameFolder: false,
        renameFile: false,
        delete: false,
        deleteFilesAndFolders: false
      },
      contragents: [],
      content: {}, // для отображения содержимого папки: файлы, подпапки
      uploadingFiles: [], // файлы для загрузки
      chosenIds: [], // выбранные папки и файлы, для перемещения или удаления
      query: '', // модель для поиска
      tableData: {
        columns: ['name', 'admin'],
        options: {
          headings: {
            name: 'Название',
            admin: 'Управление'
          },
          orderBy: {
            column: 'name',
            ascending: false
          },
          sortable: ['name'],
          filterable: ['name'],
          columnsClasses: {
            admin: 'admin'
          },
          highlightMatches: true
        }
      },
      mobTableData: {
        fields: [
          { key: 'name', label: 'Название' },
          { key: 'actions', label: 'Управление' }
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
    mainFolders: {
      get: function () {
        return this.contragents.map(contragent => {
          return {
            ...contragent.mainFolder,
            contragent: contragent._id,
            bin: contragent.bin
          }
        })
      }
    }
  },
  methods: {
    getCA () {
      this.$api('get', 'ca').then(response => {
        if (response.data) {
          this.contragents = response.data
        }
      })
    },
    createCA (model) {
      this.$api('post', `ca/`, model).then(response => {
        this.getCA()
        this.modal.create = false
        this.notify(response.data.message)
      }).catch(e => {
        console.log(e.response.data)
        this.notify('Временно нельзя создать контрагент', 'info')
        this.$log(e, 'danger')
      })
    },
    getFolderContent () {
      this.$api('get', `ca/${this.$route.params.folderId}`).then(response => {
        if (response.data) {
          this.content = response.data
        }
      })
    },
    createFolder (model) {
      this.chosenIds = []
      if (this.$route.params.folderId) {
        this.$api('post', `ca/${this.$route.params.folderId}`, model).then(response => {
          this.getFolderContent()
          this.modal.createFolder = false
          this.notify(response.data.message)
        }).catch(e => {
          console.log(e.response.data)
          this.notify('Временно нельзя создать папку', 'info')
          this.$log(e, 'danger')
        })
      }
    },
    addFiles (e) {
      this.chosenIds = []
      let files = e.target.files || e.dataTransfer.files
      if (!files.length) return
      this.uploadingFiles = files
    },
    uploadFiles (model) {
      this.uploadingFiles = this.$_.map(model, (f) => f.file)
      const files = this.$createFormData({ files: this.uploadingFiles })
      this.$api('post', `ca/${this.$route.params.folderId}/files`, files).then(response => {
        this.modal.createFile = false
        this.uploadingFiles = []
        this.notify(response.data.message)
        if (this.content.files) {
          response.data.files.forEach(file => {
            this.content.files.push(file)
          })
        } else {
          this.content.files = response.data.files
        }
      }).catch(e => {
        console.log(e.response.data)
        this.notify('Временно нельзя загрузить файлы', 'info')
        this.$log(e, 'danger')
      })
    },
    chooseId (id) {
      if (!this.chosenIds.includes(id)) {
        this.chosenIds.push(id)
      } else {
        this.chosenIds = _.reduce(this.chosenIds, (result, cid) => {
          if (cid !== id) {
            result.push(cid)
          }
          return result
        }, [])
      }
    },
    moveFilesAndFolders (model) {
      this.$api('post', `ca/${this.$route.params.folderId}/move`, {
        dest: model.dest,
        ids: this.chosenIds
      }).then(response => {
        this.modal.moveFilesAndFolders = false
        this.notify(response.data.message)
        this.getFolderContent()
      })
    },
    deleteFilesAndFolders () {
      this.$api('post', 'ca/delete', { ids: this.chosenIds }).then(response => {
        this.modal.deleteFilesAndFolders = false
        this.notify(response.data.message)
        this.chosenIds = []
        this.getFolderContent()
      }).catch(err => {
        this.modal.moveFilesAndFolders = false
        this.notify(err.response.data.message)
      })
    },
    toggleModal (name, model) {
      this.modal[name] = model === undefined ? !this.modal[name] : model
    },
    renameFolder (model) {
      this.chosenIds = []
      this.$api('put', `ca/${model._id}`, { name: model.name }).then(response => {
        this.modal.renameFolder = false
        this.notify(response.data.message)
        this.getFolderContent()
      }).catch(err => {
        this.notify(err.response.data.errors.folder.msg, 'danger')
      })
    },
    renameFile (model) {
      this.chosenIds = []
      this.$api('put', `ca/files/${model._id}`, { name: model.name }).then(response => {
        this.modal.renameFile = false
        this.notify(response.data.message)
        this.getFolderContent()
      }).catch(err => {
        this.notify(err.response.data.errors.file.msg, 'danger')
      })
    },
    search () {
      this.chosenIds = []
      if (this.query) {
        this.$api('get', `ca/search?search=${this.query}`).then(response => {
          this.content.childFolders = response.data.folders
          this.content.files = response.data.files
        })
      }
    },
    deleteCA (_id) {
      this.$api('delete', `ca/${_id}`).then(response => {
        this.modal.delete = false
        this.getCA()
        this.notify(response.data.message)
      }).catch(err => {
        this.modal.delete = false
        this.notify(err.response.data.message)
      })
    },
    enterFolder (event) {
      if (event.hasOwnProperty('row')) {
        return this.$router.push({ name: 'folder', params: { folderId: event.row._id } })
      }
      this.$router.push({ name: 'folder', params: { folderId: event._id } })
    },
    onFiltered (filteredItems) {
      this.mobTableData.totalRows = filteredItems.length
      this.mobTableData.currentPage = 1
    }
  },
  mounted () {
    this.$route.params.folderId ? this.getFolderContent() : this.getCA()

    this.$store.commit('app/setSidebar', 'documents')
  },
  destroyed () {
    this.$store.commit('app/setSidebar', {})
  },
  watch: {
    '$route' (to, from) {
      this.chosenIds = []
      this.$route.params.folderId ? this.getFolderContent() : this.getCA()
    },
    content: val => {
      this.content = val
    },
    query: function (val) {
      if (!val) {
        this.getFolderContent()
      }
    }
  }
}
</script>

<style lang="scss">
.ca-items { display: flex; flex-wrap: wrap; }
.ca-item { margin: 5px 20px; padding: 10px; display: inline-flex; flex-direction: column; align-items: center; }
.ca-item.selected { background: #ecf0f5; }
.ca-item>a { display: flex; width: 130px; align-items: center; flex-direction: column; padding: 5px 10px; }
.ca-item .main-icon { font-size: 120px; width: 120px; height: 100px; color: #dcb31c; display: flex; justify-content: center; align-items: center; }
.ca-item .main-icon.document { font-size: 90px; }
.ca-item .buttons { margin: 5px 0 10px; }
.ca-item .title { color: #333; word-wrap: break-word; text-align: center; width: 160px; }
.ca-item .btn { margin: 0 3px; }
</style>
