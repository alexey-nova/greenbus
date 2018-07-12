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
                  <form @submit.prevent="search">
                    <input type="text" placeholder="Поиск" name="search" v-model="query">
                    <button class="add-button" type="submit"><img src="~assets/img/search.png"></button>
                  </form>
                </div>
                <div class="add flex-end">
                  <button class="add-button auto-width" @click="toggleModal('create', {})"><img src="~assets/img/add.png">Создать контрагента</button>
                </div>
              </div>

              <div v-if="!$route.params.folderId && (!mainFolders || mainFolders.length === 0)">
                Контрагентов нет
              </div>

              <table class="con-table mob-none" v-if="!$route.params.folderId">
                <tr class="green text-left">
                  <td width="60%">
                    <span>Название</span>
                  </td>
                  <td width="40%">
                    <span>Бин</span>
                  </td>
                  <td class="button-width">&nbsp;</td>
                </tr>
                <tr class="clicked-tr2" v-for="folder in mainFolders" :key="folder._id">
                  <router-link :to="{ name: 'folder', params: { folderId: folder._id }}" tag="td">{{ folder.name }}</router-link>
                  <router-link :to="{ name: 'folder', params: { folderId: folder._id }}" tag="td">{{ folder.bin }}</router-link>
                  <td class="border-none unset-click">
                    <div class="flex">
                      <button class="button-table remove" @click="toggleModal('delete', folder.contragent)"><i class="fa fa-trash-o"></i></button>
                    </div>
                  </td>
                </tr>
              </table>

              <div class="mob-block">
                <div class="search m-block">
                  <form @submit.prevent="search">
                    <input type="text" placeholder="Поиск" name="search" v-model="query">
                    <button class="add-button" type="submit"><img src="~assets/img/search.png"></button>
                  </form>
                </div>

                <table v-if="!$route.params.folderId" v-for="folder in mainFolders" :key="folder._id" class="mob-margin">
                  <tr>
                    <td>
                      <span>Название:</span>
                      <span class="bold">{{ folder.name }}</span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <span>Бин:</span>
                      <span class="bold">{{ folder.bin }}</span>
                    </td>
                  </tr>
                  <tr class="no-padding-m">
                    <td>
                      <div class="flex align-center">
                        <div class="m-item">
                          <router-link :to="{ name: 'folder', params: { folderId: folder._id }}" tag="a" class="m-open">Открыть</router-link>
                        </div>
                        <div class="m-item">
                          <button class="button-table remove" @click="toggleModal('delete', folder.contragent)"><i class="fa fa-trash-o"></i></button>
                        </div>
                      </div>
                    </td>
                  </tr>
                </table>
              </div>
            </div>

            <div v-if="$route.params.folderId">
              <div class="flex margin-bottom align-center m-column">
                <router-link v-if="!content.parentFolder" :to="{ name: 'contragents'}" tag="a">
                  <button class="add-button auto-width back"><img src="~assets/img/left.png"><span>Назад</span></button>
                </router-link>
                <router-link v-if="content.parentFolder" :to="{ name: 'folder', params: { folderId: content.parentFolder._id }}" tag="a">
                  <button class="add-button auto-width back"><img src="~assets/img/left.png"><span>Назад</span></button>
                </router-link>
                <div class="add auto">
                  <button class="add-button auto-width"@click="toggleModal('createFile', {})" ><img src="~assets/img/left.png" class="rotate">Загрузить файл</button>
                  <button class="add-button auto-width" @click="toggleModal('createFolder', {})"><img src="~assets/img/add.png">Создать папку</button>
                </div>
              </div>
              <div v-if="chosenIds.length > 0" class="flex margin-bottom align-center m-column">
                <a></a>
                <div class="add auto">
                  <button type="button" class="add-button auto-width" @click="toggleModal('moveFilesAndFolders', {})">Переместить</button>
                  <button type="button" class="add-button auto-width" @click="toggleModal('deleteFilesAndFolders')">Удалить</button>
                </div>
              </div>
              <div class="folders">
                <div class="folders-box">
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
    <!-- <PageTitle :title="'Контрагенты'"></PageTitle>

    <div class="row">
      <div class="col-lg-9">
        <Box>

          root folders
          <div class="ca-items">
            <div v-if="!$route.params.folderId && (!mainFolders || mainFolders.length === 0)">
              Контрагентов нет
            </div>
            <div v-if="!$route.params.folderId" v-for="folder in mainFolders" :key="folder._id">
              <div class="ca-item">
                <router-link :to="{ name: 'folder', params: { folderId: folder._id }}">
                  <div><i class="fa fa-folder main-icon"></i></div>
                </router-link>
                <button class="btn btn-danger" @click="toggleModal('delete', folder.contragent)"><i class="fa fa-trash-o"></i></button>
                <div class="title">{{ folder.name }}</div>
              </div>
            </div>

            <div v-if="$route.params.folderId" class="ca-item">
              <router-link v-if="content.parentFolder" :to="{ name: 'folder', params: { folderId: content.parentFolder._id }}">
                <div><i class="fa fa-arrow-left main-icon" style="font-size: 60px; color: #7d7d7d;"></i></div>
              </router-link>
              <router-link v-if="!content.parentFolder" :to="{ name: 'contragents'}">
                <div><i class="fa fa-arrow-left main-icon" style="font-size: 60px; color: #7d7d7d;"></i></div>
              </router-link>
              <div class="title">Назад</div>
            </div>

            subfolders
            <div v-if="$route.params.folderId" v-for="(item, index) in content.childFolders" :key="index"><div :class="['ca-item', {'selected': chosenIds.includes(item._id)}]">
              <router-link :to="{ name: 'folder', params: { folderId: item._id }}">
                <div><i class="fa fa-folder main-icon"></i></div>
              </router-link>
              <div class="buttons">
                <button type="button" class="btn btn-xs btn-default" @click="chooseId(item._id)"><i class="fa fa-ellipsis-h"></i></button>
                <button type="button" class="btn btn-xs btn-default" @click="toggleModal('renameFolder', $_.clone(item))"><i class="fa fa-pencil"></i></button>
              </div>
              <div class="title">{{ item.name }}</div>
            </div></div>

            files
            <div v-if="$route.params.folderId" v-for="item in content.files" :key="item._id"><div :class="['ca-item', {'selected': chosenIds.includes(item._id)}]">
              <a :href="$config('app.fileUrl') + item.path" target="_blank">
                <div><i class="fa fa-file-text-o main-icon document"></i></div>
              </a>
              <div class="buttons">
                <button type="button" class="btn btn-xs btn-default" @click="chooseId(item._id)"><i class="fa fa-ellipsis-h"></i></button>
                <button type="button" class="btn btn-xs btn-default" @click="toggleModal('renameFile', $_.clone(item))"><i class="fa fa-pencil"></i></button>
              </div>
              <div class="title">{{item.name}}</div>
            </div></div>
          </div>
        </Box>
      </div>
      <div class="col-lg-3">
        <Box>
          <div v-if="chosenIds.length > 0">
            <button type="button" class="btn btn-success" @click="toggleModal('moveFilesAndFolders', {})"><i class="fa fa-arrows"></i>&nbsp;&nbsp;Переместить</button>
            <button type="button" class="btn btn-danger" @click="toggleModal('deleteFilesAndFolders')"><i class="fa fa-trash-o"></i>&nbsp;&nbsp;Удалить</button>
            <hr>
          </div>

          <button v-if="!$route.params.folderId" class="btn btn-success" @click="toggleModal('create', {})"><i class="fa fa-file-text-o"></i>&nbsp;&nbsp;Создать контрагента</button>
          <button v-if="$route.params.folderId" class="btn btn-success" @click="toggleModal('createFolder', {})"><i class="fa fa-folder-o"></i>&nbsp;&nbsp;Создать папку</button>

          <hr>

          <form v-if="$route.params.folderId" @submit.prevent="uploadFiles">
            <h4>Загрузить файлы</h4>
            <input type="file" multiple id="field-files" lang="ru" @change="addFiles">
            <div style="text-align: right">
              <button type="submit" class="btn btn-light" :disabled="!this.uploadingFiles || this.uploadingFiles.length === 0">Загрузить</button>
            </div>
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
    </div> -->

    <ModalCreate :model="modal.create" @onSubmit="createCA" @onClose="toggleModal('create')"></ModalCreate>
    <ModalCreateFolder :model="modal.createFolder" @onSubmit="createFolder" @onClose="toggleModal('createFolder')"></ModalCreateFolder>
    <ModalCreateFile :model="modal.createFile" :uploadingFiles="uploadingFiles" @onSubmit="uploadFiles" @onClose="toggleModal('createFile')"></ModalCreateFile>
    <ModalMove v-if="modal.moveFilesAndFolders" :ids="chosenIds" :model="modal.moveFilesAndFolders" @onSubmit="moveFilesAndFolders" @onClose="toggleModal('moveFilesAndFolders')"></ModalMove>
    <ModalRenameFolder v-if="modal.renameFolder" :model="modal.renameFolder" @onSubmit="renameFolder" @onClose="toggleModal('renameFolder')"></ModalRenameFolder>
    <ModalRenameFile v-if="modal.renameFile" :model="modal.renameFile" @onSubmit="renameFile" @onClose="toggleModal('renameFile')"></ModalRenameFile>
    <ModalDelete :model="modal.delete" @onSubmit="deleteCA" @onClose="toggleModal('delete')"></ModalDelete>
    <ModalDeleteFilesAndFolders :model="modal.deleteFilesAndFolders" @onSubmit="deleteFilesAndFolders" @onClose="toggleModal('deleteFilesAndFolders')"></ModalDeleteFilesAndFolders>
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
  import ModalCreateFile from './contragents/ModalCreateFile'
  import ModalMove from './contragents/ModalMove'
  import ModalRenameFolder from './contragents/ModalRenameFolder'
  import ModalRenameFile from './contragents/ModalRenameFile'
  import ModalDelete from './contragents/ModalDelete'
  import ModalDeleteFilesAndFolders from './contragents/ModalDeleteFilesAndFolders'

  export default {
    components: {
      PageTitle,
      PageButtons,
      Box,
      ModalCreate,
      ModalCreateFolder,
      ModalCreateFile,
      ModalMove,
      ModalRenameFolder,
      ModalRenameFile,
      ModalDelete,
      ModalDeleteFilesAndFolders
    },
    data () {
      return {
        users: [],
        memos: [],
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
      mainFolders: {
        get: function () {
          return this.contragents.map(contragent =>  {
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
        //this.modal.createFile = false
        this.uploadingFiles = files
      },
      uploadFiles (model) {
        this.uploadingFiles = this.$_.map(model, (f) => f.file)
        console.log('files', this.uploadingFiles)
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
        this.chosenIds = []
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
    },
  }
</script>
