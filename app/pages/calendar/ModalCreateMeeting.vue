<template>
  <div>
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
        <div :class="['form-group', {'has-error': errors.has('startDate')}]">
          <label>Начало встречи *</label>
          <Datepicker input-class="form-control" language="ru" name="startDate" v-validate="'required'" v-model="model.startDate"></Datepicker>
          <span v-show="errors.has('startDate')" class="help-block">{{ errors.first('startDate') }}</span>
        </div>
      </div>
      <div class="col-lg-6">
        <div :class="['form-group', {'has-error': errors.has('startTime')}]">
          <label for="field-startTime">Время начала встречи *</label>
          <masked-input id="field-startTime" class="form-control" mask="11:11" name="startTime" v-validate="'required'" v-model="model.startTime"></masked-input>
          <span v-show="errors.has('phone')" class="help-block">{{ errors.first('phone') }}</span>
        </div>
      </div>
      <div class="col-lg-6">
        <div :class="['form-group', {'has-error': errors.has('endDate')}]">
          <label>Конец встречи *</label>
          <Datepicker input-class="form-control" language="ru" name="endDate" v-validate="'required'" v-model="model.endDate"></Datepicker>
          <span v-show="errors.has('endDate')" class="help-block">{{ errors.first('endDate') }}</span>
        </div>
      </div>
      <div class="col-lg-6">
        <div :class="['form-group', {'has-error': errors.has('endTune')}]">
          <label for="field-endTime">Время конца встречи *</label>
          <masked-input id="field-endTime" class="form-control" mask="11:11" name="endTime" v-validate="'required'" v-model="model.endTime"></masked-input>
          <span v-show="errors.has('endTime')" class="help-block">{{ errors.first('endTime') }}</span>
        </div>
      </div>
      <div class="col-lg-12">
        <TextareaBase title="Описание" name="description" required :validate="'required'" v-model="model.description"></TextareaBase>
      </div>
      <div v-if="type === 'create' || type === 'edit'" class="col-lg-12">
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
      <div class="col-lg-12">
        <div v-for="m in selectedUsers" class="row user">
          <div class="col-md-9">
            <div class="to">
              <strong>{{getUser(m._id).fullname}}</strong> ({{getUser(m._id).position}})
            </div>
          </div>
          <div class="col-md-3">
            <div class="to-name"></div>
          </div>
          <div class="col-md-3">
            <div class="to-status">
              <div v-if="!(m.user !== $auth().user._id || m.answer !== 'undefined')">
                <button class="btn btn-sm btn-success" @click="toggleModal('confirm', model)">Согласовать</button>
                <button class="btn btn-sm btn-danger" @click="toggleModal('reject', model)">Отклонить</button>
              </div>
              <span class="title" v-if="m.user !== $auth().user._id || m.answer !== 'undefined'">
              {{statuses[m.answer]}}
            </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div slot="footer">
      <button type="button" class="btn btn-default" data-dismiss="modal" @click="close"><i class="fa fa-times"></i>&nbsp;&nbsp;Отмена</button>

      <button v-if="type !== 'create' && model.createdBy !== this.$auth().user._id" type="button" class="btn btn-primary" data-dismiss="modal" @click="toggleModal('confirmed', {id:model._id})"><i class="fa fa-times"></i>&nbsp;&nbsp;Согласовать</button>
      <button v-if="type !== 'create' && model.createdBy !== this.$auth().user._id" type="button" class="btn btn-danger" data-dismiss="modal" @click="toggleModal('reject', {id:model._id})"><i class="fa fa-times"></i>&nbsp;Отказать</button>

      <button v-if="type !== 'create' && model.createdBy === this.$auth().user._id" type="button" class="btn btn-danger" @click="toggleModal('delete', {id:model._id})"><i class="fa fa-check"></i>&nbsp;Удалить</button>
      <button v-if="type === 'create'" type="submit" class="btn btn-success"><i class="fa fa-check"></i> Создать</button>
      <button v-if="type !== 'create' && model.createdBy === this.$auth().user._id" type="submit" class="btn btn-success"><i class="fa fa-check"></i> Изменить</button>
    </div>
  </Modal>
  <ModalDelete :model="modal.delete" @onSubmit="deleteMeeting" @onClose="toggleModal('delete')"></ModalDelete>
  <ModalConfirmed :model="modal.confirmed" @onSubmit="confirmedMeeting" @onClose="toggleModal('confirmed')"></ModalConfirmed>
  <ModalReject :model="modal.reject" @onSubmit="rejectMeeting" @onClose="toggleModal('reject')"></ModalReject>
  </div>
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
    import ModalDelete from './ModalDeleteMeeting'
    import ModalConfirmed from './ModalConfirmedMeeting'
    import ModalReject from './ModalRejectMeeting'


    export default {
        components: {
            Modal,
            MaskedInput,
            Datepicker,
            'el-switch': Switch,
            Multiselect,
            InputBase,
            TextareaBase,
            ModalDelete,
            ModalConfirmed,
            ModalReject
        },
        data () {
            return {
                meetingId: 0,
                modal: {
                    delete: false,
                    confirmed: false,
                    reject: false,
                },
                statuses: {
                    'undefined': 'На согласовании',
                    'confirmed': 'Согласовано',
                    'rejected': 'Отклонено',
                }
            }
        },
        props: ['model', 'users', 'type','onSubmit', 'onClose',],
        methods: {
            toggleModal (name, model) {
                this.modal[name] = model === undefined ? !this.modal[name] : model
            },
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
            deleteMeeting (meeting) {
                this.$api('delete', 'meetings/' + meeting.id).then(response => {
                    this.$emit('onUpdate')
                    this.toggleModal('delete')
                    this.notify(response.data.message)
                }).catch(e => {
                    this.notify('Временно нельзя удалить встречу', 'info')
                    this.modal.deleteUser = false
                    this.$log(e, 'danger')
                })
            },

            confirmedMeeting (meeting) {
                this.$api('post', 'meetings/confirm/' + meeting.id).then(response => {
                    this.$emit('onUpdate')
                    this.toggleModal('confirmed')
                    this.notify(response.data.message)
                }).catch(e => {
                    this.notify('Временно нельзя согласовать событие', 'info')
                    this.$log(e, 'danger')
                })
            },
            rejectMeeting (meeting) {
                this.$api('post', 'meetings/reject/' + meeting.id).then(response => {
                    this.$emit('onUpdate')
                    this.toggleModal('reject')
                    this.notify(response.data.message)
                }).catch(e => {
                    this.notify('Временно нельзя отказать во встречи', 'info')
                    this.$log(e, 'danger')
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