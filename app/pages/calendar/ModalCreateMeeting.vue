<template>
  <Modal :isOpen="model" type="lg" @onSubmit="submit">

    <h3 slot="header" class="modal-title">Создать событие</h3>

    <div slot="content" class="row">
      <div class="col-lg-6">
        <InputBase title="Тема" name="name" required :validate="'required'" v-model="model.name"></InputBase>
      </div>
      <div class="col-lg-6">
        <InputBase title="Место" name="place" required :validate="'required'" v-model="model.place"></InputBase>
      </div>
      <div class="col-lg-6">
        <InputBase title="Дата" name="startDate" required :validate="'required'" v-model="model.startDate"></InputBase>
      </div>
      <div class="col-lg-12">
        <TextareaBase title="Описание" name="description" required :validate="'required'" v-model="model.description"></TextareaBase>
      </div>
      <div class="col-lg-12">
        <div :class="['form-group', {'has-error': errors.has('participants')}]">
          <label for="field-participants">Участники *</label><br />
          <Multiselect
                  id="field-participants"
                  v-model="selectedUsers"
                  :options="usersForSelect"
                  :close-on-select="false"
                  :hide-selected="true"
                  :clear-on-select="false"
                  :multiple="true"
                  track-by="name"
                  label="name"
          >
          </Multiselect>
          <span v-show="errors.has('participants')" class="help-block">{{ errors.first('participants') }}</span>
        </div>

      </div>
    </div>

    <div slot="footer">
      <button type="button" class="btn btn-default" data-dismiss="modal" @click="close"><i class="fa fa-times"></i>&nbsp;&nbsp;Отмена</button>
      <button type="submit" class="btn btn-success"><i class="fa fa-check"></i>&nbsp;&nbsp;Создать</button>
    </div>

  </Modal>
</template>

<script>
    import 'element-ui/lib/theme-chalk/index.css'
    import Modal from '@/Modal'
    import InputBase from '@/Input'
    import TextareaBase from '@/Textarea'
    import MaskedInput from 'vue-masked-input'
    import Datepicker from 'vuejs-datepicker'
    import { Switch } from 'element-ui'
    import Multiselect from 'vue-multiselect'

    export default {
        components: {
            Modal,
            MaskedInput,
            Datepicker,
            'el-switch': Switch,
            Multiselect,
            InputBase,
            TextareaBase,
        },
        props: ['model', 'users', 'onSubmit', 'onClose',],
        methods: {
            close () {
                this.$emit('onClose')
            },
            submit () {
                this.$validator.validateAll().then(() => {
                    if (!this.$_.size(this.errors.items)) {
                        let model = this.$_.clone(this.$props.model)
                        model.to = this.$_.map(model.to, u => u.user)
                        this.$emit('onSubmit', model)
                    }
                }).catch(() => {
                })
            },
            getUser (_id) {
                let user = this.$_.find(this.$props.users, u => u._id === _id)
                return user ? user : {}
            },
        },
        computed: {
            usersForSelect () {
                return this.$_.map(this.$props.users, u => {
                    return {name: u.fullname, _id: u._id}
                })
            },
            selectedUsers: {
                get: function () {
                    if (this.$_.size(this.$props.model.participants) > 10) {
                        this.errors.items.push({
                            field: 'participants',
                            scope: null,
                            msg: 'Допустимо не больше 10 участников',
                        })
                    }
                    return this.$_.map(this.$props.model.participants, m => {
                        return m ? {name: this.getUser(m.user).fullname, _id: m.user} : {}
                    })
                },
                set: function (newValue) {
                    this.errors.items = this.$_.reject(this.errors.items, e => e.field === 'participants')
                    this.$props.model.participants = this.$_.map(newValue, m => {
                        return m._id
                    })
                }
            }
        }
    }
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style lang="scss" scoped>

</style>