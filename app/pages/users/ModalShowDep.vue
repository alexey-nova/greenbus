<template>
  <div>
    <Modal :isOpen="model" type="lg">

      <h3 slot="header" class="modal-title">Список отделов</h3>

      <div slot="content" v-if="deps">
        <div class="buttons">
          <button class="btn btn-success" @click="toggleModal('create', {})"><i class="fa fa-id-badge"></i>&nbsp;&nbsp;Создать отдел</button>
        </div>
        <v-client-table ref="table" v-bind="tableData" :data="deps" :columnsDropdown="true">
          <div slot="createdAt" slot-scope="props">
            {{$dateFormat(props.row.createdAt, 'd mmm yyyy')}}
          </div>
          <div v-if="$auth().hasRole('admin')" slot="tools" slot-scope="props">
            <button class="btn btn-sm btn-default" @click="toggleModal('edit', $_.clone(props.row))"><i class="fa fa-edit"></i></button>
            <button class="btn btn-sm btn-default" @click="toggleModal('deleting', props.row)"><i class="fa fa-trash"></i></button>
          </div>
        </v-client-table>
      </div>

      <div slot="footer">
        <button type="button" class="btn btn-default" data-dismiss="modal" @click="close"><i class="fa fa-times"></i>&nbsp;&nbsp;Закрыть окно</button>
      </div>

    </Modal>

    <ModalCreateDep :model="modal.create" @onSubmit="createDep" @onClose="toggleModal('create')"></ModalCreateDep>
    <ModalEditDep :model="modal.edit" @onSubmit="editDep" @onClose="toggleModal('edit')"></ModalEditDep>
    <ModalDeleteDep :model="modal.deleting" @onSubmit="deleteDep" @onClose="toggleModal('deleting')"></ModalDeleteDep>
  </div>
</template>

<script>
import Modal from '@/Modal'
import MaskedInput from 'vue-masked-input'
import ModalCreateDep from './ModalCreateDep'
import ModalEditDep from './ModalEditDep'
import ModalDeleteDep from './ModalDeleteDep'

export default {
  components: {
    Modal,
    MaskedInput,
    ModalCreateDep,
    ModalEditDep,
    ModalDeleteDep
  },
  data () {
    return {
      deps: [],
      modal: {
        edit: false,
        deleting: false,
        create: false
      },
      tableData: {
        columns: ['name', 'createdAt', 'tools'],
        options: {
          headings: {
            name: 'Название',
            createdAt: 'Создан',
            tools: ''
          },
          orderBy: {
            column: 'createdAt',
            ascending: false
          },
          sortable: ['name', 'createdAt'],
          filterable: ['name', 'createdAt']
        }
      }
    }
  },
  props: ['model'],
  methods: {
    close () {
      this.$emit('onClose')
    },
    toggleModal (name, model) {
      this.modal[name] = model === undefined ? !this.modal[name] : model
    },
    createDep (dep) {
      this.$api('post', 'departments', dep).then(response => {
        this.loadDeps()
        this.modal.create = false
        this.notify(response.data.message)
      }).catch(e => {
        this.notify('Временно нельзя создать отдел', 'info')
        this.modal.create = false
        this.$log(e, 'danger')
      })
    },
    editDep (dep) {
      this.$api('put', `departments/${dep._id}`, { name: dep.name }).then(response => {
        this.loadDeps()
        this.modal.edit = false
        this.notify(response.data.message)
      }).catch(e => {
        this.notify('Временно нельзя редактировать отдел', 'info')
        this.modal.edit = false
        this.$log(e, 'danger')
      })
    },
    deleteDep (dep) {
      this.$api('delete', 'departments/' + dep._id).then(response => {
        this.loadDeps()
        this.modal.deleting = false
        this.notify(response.data.message)
      }).catch(e => {
        this.notify('Временно нельзя удалить отдел', 'info')
        this.modal.deleting = false
        this.$log(e, 'danger')
      })
    },
    loadDeps () {
      this.$api('get', 'departments').then(response => {
        this.deps = response.data
      }).catch(e => {
        this.notify(e, 'danger')
      })
    }
  },
  mounted () {
    this.loadDeps()
  }
}
</script>

<style lang="scss" scoped>
  .buttons { text-align: right; margin-bottom: 15px; }
</style>
