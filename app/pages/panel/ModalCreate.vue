<template>
  <Modal :isOpen="model" @onSubmit="submit">
    <div slot="content" class="modal-dialog small2">
      <div class="modal-content">
        <div class="modal-header">
        <div class="list_header">
          <div class="flex">
            <div>
              <span>Добавить {{setTypeName}}</span>
            </div>
            <div class="buttons">
              <button class="button-top close close-add-class" @click="close"></button>
            </div>
          </div>
        </div>
      </div>
      <div class="profile full modal-body">
        <div :class="[{'has-error': errors.has('name')}]">
          <label>Название</label>
          <input type="text" v-validate="'required'" name="name" v-model="model.name">
          <span v-show="errors.has('name')" class="help-block">{{ errors.first('name') }}</span>
        </div>
        
        <div v-if="model.type === 'otdel' || model.type === 'position'" :class="['form-group', {'has-error': errors.has('to')}]">
          <label for="field-dept">Департамент</label>
          <Multiselect
            id="field-dept"
            name="dept"
            v-validate="'required'"
            v-model="model.department"
            :options="departments"
            track-by="name"
            label="name">
          </Multiselect>
          <!-- <span v-show="errors.has('dept')" class="help-block">{{ errors.first('dept') }}</span> -->
        </div>
        <div v-if="model.type === 'otdel' || model.type === 'position'" :class="['form-group', {'has-error': errors.has('dept')}]">
          <label for="field-dept">Отдел</label>
          <Multiselect
            id="field-dept"
            name="dept"
            v-validate="'required'"
            v-model="model.otdel"
            :options="filteredOtdels"
            track-by="name"
            label="name">
          </Multiselect>
          <!-- <span v-show="errors.has('dept')" class="help-block">{{ errors.first('dept') }}</span> -->
        </div>
        <div class="flex center">
            <button type="" class="add-button auto-width form-submit">Добавить</button>
        </div>
      </div>
      <div class="modal-footer"></div>
      </div>
    </div>
    <!-- <h3 slot="header" class="modal-title">Добавление</h3> -->

    <!-- <div slot="content" class="row">
      <div :class="['form-group', {'has-error': errors.has('name')}]">
        <label for="field-name">Название</label>
        <input id="field-name" class="form-control" v-validate="'required'" name="name" v-model="model.name" />
        <span v-show="errors.has('name')" class="help-block">{{ errors.first('name') }}</span>
      </div>
      <div v-if="model.type === 'otdel'" :class="['form-group', {'has-error': errors.has('to')}]">
        <label for="field-to">Департамент *</label>
        <Multiselect
          id="field-to"
          name="to"
          v-validate="'required'"
          v-model="selectedDepartment"
          :options="departments"
          track-by="name"
          label="name">
        </Multiselect>
        <span v-show="errors.has('to')" class="help-block">{{ errors.first('to') }}</span>
      </div>
    </div>

    <div slot="footer">
      <button type="button" class="btn btn-default" data-dismiss="modal" @click="close"><i class="fa fa-times"></i>&nbsp;&nbsp;Отмена</button>
      <button type="submit" class="btn btn-success"><i class="fa fa-check"></i>&nbsp;&nbsp;Создать</button>
    </div> -->

  </Modal>
</template>

<script>
  import Modal from '@/Modal'
  import Multiselect from 'vue-multiselect'

  export default {
    components: {
      Modal,
      Multiselect,
    },
    data () {
      return {
        selectedUser: '',
        usersForSelect: [],
        filteredOtdels: ['asd']
      }
    },
    props: ['model', 'users', 'onSubmit', 'onClose', 'departments', 'otdels'],
    computed: {
      setTypeName () {
        const names = {
          department: 'департамент',
          otdel: 'отдел',
          position: 'должность'
        }
        return names[this.model.type]
      },
      // filteredOtdels: {
      //   get () {
      //     if (!this.model.department) return []
      //     return this.otdels.filter(item => item.parent === this.model.department)
      //   },
      //   set (newVal) {
      //     console.log(newVal)
      //   }
        
      // }
    },
    methods: {
      close () {
        this.$emit('onClose')
      },
      
      submit () {
        if (this.model.department) this.model.department = this.model.department._id
        if (this.model.otdel) this.model.otdel = this.model.otdel._id
        // if (!this.model.dept) {
        //   this.errors.items.push({
        //     id: '100',
        //     field: 'to',
        //     scope: null,
        //     msg: 'Поле Кому обязательно для заполнения',
        //   })
        // }
        this.$emit('onSubmit', this.model)
        // this.$validator.validateAll().then(() => {
        //   if (!this.$_.size(this.errors.items)) {
            
        //   }
        // }).catch(() => {})
      },
    },
    mounted () {
    },
    watch: {
      'model.department': function (val) {
        if (val) {
          this.filteredOtdels = this.otdels.filter(item => item.parent === val._id)
        } else {
          this.filteredOtdels = []
        }
        
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>