<template>
  <div>
    <PageTitle :title="'Контрагенты'"></PageTitle>

    <div class="row">
      <div class="col-lg-9">
        <Box>

          <!-- root folders -->
          <div class="ca-items">
            <div v-if="!$route.params.folderId" v-for="folder in mainFolders">
              <div class="ca-item">
                <router-link :to="{ name: 'folder', params: { folderId: folder._id }}">
                  <div><i class="fa fa-folder main-icon"></i></div>
                </router-link>
                <div class="title">{{ folder.name }}</div>
              </div>
            </div>

            <div v-if="$route.params.folderId" class="ca-item">
              <router-link v-if="content.parentFolder" :to="{ name: 'folder', params: { folderId: content.parentFolder._id }}">
                <div><i class="fa fa-folder main-icon"></i></div>
              </router-link>
              <router-link v-if="!content.parentFolder" :to="{ name: 'contragents'}">
                <div><i class="fa fa-folder main-icon"></i></div>
              </router-link>
              <div class="title">Назад</div>
            </div>

            <!-- subfolders -->
            <div v-if="$route.params.folderId" v-for="item in content.childFolders"><div :class="['ca-item', {'selected': chosenIds.includes(item._id)}]">
              <router-link :to="{ name: 'folder', params: { folderId: item._id }}">
                <div><i class="fa fa-folder main-icon"></i></div>
              </router-link>
              <div class="buttons">
                <button type="button" class="btn btn-xs btn-default" @click="chooseId(item._id)"><i class="fa fa-ellipsis-h"></i></button>
                <button type="button" class="btn btn-xs btn-default" @click="removeId(item._id)"><i class="fa fa-trash"></i></button>
                <button type="button" class="btn btn-xs btn-default" @click="toggleModal('renameFolder', item)"><i class="fa fa-pencil"></i></button>
              </div>
              <div class="title">{{ item.name }}</div>
            </div></div>

            <!-- files -->
            <div v-if="$route.params.folderId" v-for="item in content.files"><div :class="['ca-item', {'selected': chosenIds.includes(item._id)}]">
              <a :href="`http://195.93.152.79:3333/${item.path}`" target="_blank">
                <div><i class="fa fa-file-text-o main-icon document"></i></div>
              </a>
              <div class="buttons">
                <button type="button" class="btn btn-xs btn-default" @click="chooseId(item._id)"><i class="fa fa-ellipsis-h"></i></button>
                <button type="button" class="btn btn-xs btn-default" @click="removeId(item._id)"><i class="fa fa-trash"></i></button>
                <button type="button" class="btn btn-xs btn-default" @click="toggleModal('renameFile', item)"><i class="fa fa-pencil"></i></button>
              </div>
              <div class="title">{{item.name}}</div>
            </div></div>
          </div>
        </Box>
      </div>
      <div class="col-lg-3">
        <Box>

          <div v-if="chosenIds.length > 0">
            <button type="button" class="btn btn-success" @click="toggleModal('moveFilesAndFolders', {})">Переместить</button>
            <hr>
          </div>


          <button v-if="!$route.params.folderId" class="btn btn-success" @click="toggleModal('create', {})"><i class="fa fa-file-text-o"></i>&nbsp;&nbsp;Создать контрагента</button>
          <button v-if="$route.params.folderId" class="btn btn-success" @click="toggleModal('uploadFile', {})"><i class="fa fa-file-text-o"></i>&nbsp;&nbsp;Загрузить файлы</button>
          <button v-if="$route.params.folderId" class="btn btn-success" @click="toggleModal('createFolder', {})"><i class="fa fa-folder-o"></i>&nbsp;&nbsp;Создать папку</button>

          <form v-if="$route.params.folderId" @submit.prevent="uploadFiles">
            <input type="file" multiple id="field-files" lang="ru" @change="addFiles">
            <button type="submit">Загрузить</button>
          </form>

          <hr>
          <form @submit.prevent="search">
            <input class="form-control" type="text" placeholder="Поиск" v-model="query">
            <div style="text-align: right">
              <button class="btn btn-light" style="margin: 10px 0 0;">Найти</button>
            </div>
          </form>

        </Box>
      </div>
    </div>

    <ModalCreate :model="modal.create" @onSubmit="createCA" @onClose="toggleModal('create')"></ModalCreate>
    <ModalCreateFolder :model="modal.createFolder" @onSubmit="createFolder" @onClose="toggleModal('createFolder')"></ModalCreateFolder>
    <ModalMove v-if="modal.moveFilesAndFolders" :ids="chosenIds" :model="modal.moveFilesAndFolders" @onSubmit="moveFilesAndFolders" @onClose="toggleModal('moveFilesAndFolders')"></ModalMove>
    <ModalRenameFolder v-if="modal.renameFolder" :model="modal.renameFolder" @onSubmit="renameFolder" @onClose="toggleModal('renameFolder')"></ModalRenameFolder>
    <ModalRenameFile v-if="modal.renameFile" :model="modal.renameFile" @onSubmit="renameFile" @onClose="toggleModal('renameFile')"></ModalRenameFile>
  </div>
</template>

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

<script>
  import PageTitle from '@/PageTitle'
  import PageButtons from '@/PageButtons'
  import Box from '@/Box'
  import ModalCreate from './contragents/ModalCreate'
  import ModalCreateFolder from './contragents/ModalCreateFolder'
  import ModalMove from './contragents/ModalMove'
  import ModalRenameFolder from './contragents/ModalRenameFolder'
  import ModalRenameFile from './contragents/ModalRenameFile'

  export default {
    components: {
      PageTitle,
      PageButtons,
      Box,
      ModalCreate,
      ModalCreateFolder,
      ModalMove,
      ModalRenameFolder,
      ModalRenameFile
    },
    data () {
      return {
        users: [],
        memos: [],
        modal: {
          create: false,
          createFolder: false,
          moveFilesAndFolders: false,
          renameFolder: false,
          renameFile: false
        },
        contragents: [],
        content: {}, // для отображения содержимого папки: файлы, подпапки
        uploadingFiles: [], // файлы для загрузки
        chosenIds: [], // выбранные папки и файлы, для перемещения
        query: '' // модель для поиска
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
      },
      mainFolders () {
        return this.contragents.map(contragent =>  contragent.mainFolder)
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
        if (this.$route.params.folderId) {
          this.$api('post', `ca/${this.$route.params.folderId}`, model).then(response => {
            this.getFolderContent()
            this.modal.createFolder = false
            this.notify(response.data.message)
          }).catch(e => {
            this.notify('Временно нельзя создать контрагент', 'info')
            this.$log(e, 'danger')
          })
        }
      },
      addFiles (e) {
        let files = e.target.files || e.dataTransfer.files
        if (!files.length) return

        this.uploadingFiles = files
      },
      uploadFiles () {
        const files = this.$createFormData({ files: this.uploadingFiles })
        this.$api('post', `ca/${this.$route.params.folderId}/files`, files).then(response => {

          if (this.content.files) {
            response.data.files.forEach(file => {
              this.content.files.push(file)
            })
          } else {
            this.content.files = response.data.files
          }
        }).catch(e => {
          this.notify('Временно нельзя создать контрагент', 'info')
          this.$log(e, 'danger')
        })
      },
      chooseId (id) {
        if (!this.chosenIds.includes(id)) this.chosenIds.push(id)
      },
      removeId (id) {
        if (this.chosenIds.includes(id)) _.remove(this.chosenIds, chosenId => chosenId === id)
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
      toggleModal (name, model) {
        this.modal[name] = model === undefined ? !this.modal[name] : model
      },
      renameFolder (model) {
        this.$api('put', `ca/${model._id}`, { name: model.name }).then(response => {
          this.modal.renameFolder = false
          this.notify(response.data.message)
        })
      },
      renameFile (model) {
        this.$api('put', `ca/files/${model._id}`, { name: model.name }).then(response => {
          this.modal.renameFile = false
          this.notify(response.data.message)
        })
      },
      search () {
        if (this.query) {
          this.$api('get', `ca/search?search=${this.query}`).then(response => {
            console.log(this.content, 'content')
            console.log(response.data)
            this.content.childFolders = response.data.folders
            this.content.files = response.data.files
          })
        }
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
    },
  }
</script>
