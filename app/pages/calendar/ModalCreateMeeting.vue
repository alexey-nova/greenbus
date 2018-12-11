<template>
  <div>
    <!--Создать событие-->
    <Modal :isOpen="model" type="lg" @onSubmit="setMeetingDate">
      <div slot="content" class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <div class="list_header">
              <div class="flex">
                <span v-if="type !== 'edit'" class="modal-title">Создать событие</span>
                <span v-if="type === 'edit' && model.createdBy === this.$auth().user._id" class="modal-title">Редактировать событие</span>
                <span v-if="type === 'edit' && model.createdBy !== this.$auth().user._id" class="modal-title">Просмотр события</span>
                <div class="buttons">
                  <button type="button" class="button-top close" @click="close"></button>
                </div>
              </div>
            </div>
          </div>
          <div class="profile full modal-body">
            <div v-if="type === 'create' || model.createdBy === this.$auth().user._id">
              <div class="flex column">
                <div class="form-item">
                  <div :class="['form-group', {'has-error': errors.has('name')}]">
                    <label for="field-name">Тема *</label>
                    <input id="field-name" v-validate="'required'" name="name" v-model="model.name" />
                    <span v-show="errors.has('name')" class="help-block">{{ errors.first('name') }}</span>
                  </div>
                  <div :class="['form-group', {'has-error': errors.has('startDate')}]">
                    <label>Дата всртечи</label>
                    <Datepicker
                      readonly
                      language="ru"
                      :monday-first="true"
                      :disabled="datepickerState.disabled"
                      :highlighted="datepickerState.highlighted"
                      name="startDate"
                      v-validate="'required'"
                      v-model="model.startDate"></Datepicker>
                    <span v-show="errors.has('startDate')" class="help-block">{{ errors.first('startDate') }}</span>
                  </div>
                </div>
                <div class="form-item">
                  <div :class="['form-group', {'has-error': errors.has('place')}]">
                    <label for="field-place">Место *</label>
                    <input id="field-place" v-validate="'required'" name="place" v-model="model.place" />
                    <span v-show="errors.has('place')" class="help-block">{{ errors.first('place') }}</span>
                  </div>
                  <div class="flex">
                    <div class="sm-input">
                      <div :class="['form-group', {'has-error': errors.has('startTime')}]">
                        <label for="field-startTime">Время начала встречи *</label>
                        <masked-input id="field-startTime" mask="11:11" name="startTime"
                                      v-validate="'required'" v-model="model.startTime"></masked-input>
                        <span v-show="errors.has('startTime')" class="help-block">{{ errors.first('startTime') }}</span>
                      </div>
                    </div>
                    <div class="sm-input">
                      <div :class="['form-group', {'has-error': errors.has('endTime')}]">
                        <label for="field-endTime">Время конца встречи *</label>
                        <masked-input id="field-endTime" mask="11:11" name="endTime" v-validate="'required'"
                        v-model="model.endTime"></masked-input>
                        <span v-show="errors.has('endTime')" class="help-block">{{ errors.first('endTime') }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="textarea-box">
                <div :class="['form-group', {'has-error': errors.has('description')}]">
                  <label for="field-description">Описание *</label>
                  <!-- <ckeditor
                    id="field-description"
                    v-model="model.description"
                    v-validate="'required'"
                    :config="ckEditorConfig">
                  </ckeditor> -->
                  <span v-show="errors.has('description')" class="help-block">{{ errors.first('description') }}</span>
                </div>
              </div>
              <div v-if="(type === 'create' || type === 'edit') || model.createdBy === this.$auth().user._id">
                <div :class="['form-group', {'has-error': errors.has('participants')}]">
                  <label for="field-participants">Участники *</label><br/>
                  <Multiselect
                    id="field-participants"
                    v-model="selectedUsers"
                    :options="usersForSelect"
                    :close-on-select="false"
                    :hide-selected="true"
                    :clear-on-select="true"
                    :multiple="true"
                    placeholder="Выберите"
                    track-by="name"
                    label="name"
                  >
                  </Multiselect>
                  <span v-show="errors.has('participants')" class="help-block">{{ errors.first('participants') }}</span>
                </div>
              </div>
            </div>
            <div class="flex column" v-if="model.createdBy !== this.$auth().user._id && type !== 'create'">
              <div class="form-item">
                <div class="form-group">
                  <label>Тема</label>
                  <div>{{model.name}}</div>
                </div>
                <div class="form-group">
                  <label>Дата встречи</label>
                  <div>{{ $dateFormat(model.startDate, 'dd mmm yyyy') }}</div>
                </div>
              </div>
              <div class="form-item">
                <div class="form-group">
                  <label>Место</label>
                  <div>{{model.place}}</div>
                </div>
                <div class="flex">
                  <div class="sm-input">
                    <div class="form-group">
                      <label>Время начала встречи</label>
                      <div>{{ $dateFormat(model.startDate, 'HH:MM') }}</div>
                    </div>
                  </div>
                  <div class="sm-input">
                    <div class="form-group">    
                      <label>Время конца встречи</label>
                      <div>{{ $dateFormat(model.endDate, 'HH:MM') }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="form-group" v-if="type !== 'create'">
              <div class="flex column" v-for="(m, index) in selectedUsers" :key="index">
                <div class="form-item">
                  <div class="to">
                    <strong>{{getUser(m._id).fullname}}</strong> <span v-if="getUser(m._id).position">({{getPositionName(getUser(m._id).position)}})</span>
                  </div>
                </div>
                <div class="form-item">
                  <div class="to-status">
                    <div v-if="m._id === $auth().user._id && !model.participants[index].answer" class="horizontal">
                      <button class="save pad2 btn-success" type="button" @click="toggleModal('confirmed', model)">Согласовать</button>
                      <button class="save pad2 btn-danger" type="button" @click="toggleModal('reject', model)">Отклонить</button>
                    </div>
                    <span class="title" v-if="!(m._id === $auth().user._id && !model.participants[index].answer)">
                      {{statuses[model.participants[index].answer]}}
                    </span>
                    <span class="date" v-if="model.participants[index].answer">{{$dateFormat(m.updatedAt, 'd mmm yyyy, HH:MM')}}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="flex flex-end m-center">
                <span v-if="isAnswered">
                  <button v-if="type !== 'create' && model.createdBy !== this.$auth().user._id" type="button" class="save pad2" data-dismiss="modal" @click="toggleModal('confirmed', {id:model._id})">Согласовать</button>
                  <button v-if="type !== 'create' && model.createdBy !== this.$auth().user._id" type="button" class="save pad2 btn-danger" data-dismiss="modal" @click="toggleModal('reject', {id:model._id})">Отказать</button>
                </span>
                <button v-if="type !== 'create' && model.createdBy === this.$auth().user._id" type="button" class="save pad2 btn-danger" @click="toggleModal('delete', {id:model._id})">Удалить</button>
                <button v-if="type === 'create'" type="submit" class="save pad2" :disabled="btnDisabled">Создать</button>
                <button v-if="type !== 'create' && model.createdBy === this.$auth().user._id" type="submit" class="save pad2">Изменить</button>
            </div>
          </div>
          <div class="modal-footer">
          </div>
        </div>
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
// import Ckeditor from 'vue-ckeditor2'

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
    ModalReject,
    // Ckeditor
  },
  data () {
    return {
      meetingId: 0,
      modal: {
        delete: false,
        confirmed: false,
        reject: false
      },
      statuses: {
        'undefined': 'На согласовании',
        'confirm': 'Согласовано',
        'reject': 'Отклонено'
      },
      ckEditorConfig: {
        toolbar: [
          [ 'Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript' ]
        ],
        height: 150
      },
      datepickerState: {
        disabled: {
          to: new Date((new Date()).setDate((new Date()).getDate() - 1))
        },
        highlighted: {
          dates: [ new Date() ]
        }
      }
    }
  },
  props: ['model', 'users', 'type', 'onSubmit', 'onClose', 'positions', 'btnDisabled'],
  computed: {
    isAnswered () {
      return !this.$_.find(this.model.participants, ['user', this.$auth().user._id])
    },
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
            msg: 'Допустимо не больше 10 участников'
          })
        }
        return this.$_.map(this.$props.model.participants, m => {
          return m ? {name: this.getUser(m.user).fullname, _id: m.user} : {}
        })
      },
      set: function (newValue) {
        this.$props.model.participants = this.$_.map(newValue, m => {
          return {_id: m._id, user: m._id}
        })
      }
    }
  },
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
          this.btnDisabled = true
          this.$emit('onSubmit', model)
        }
      }).catch(() => {
      })
    },
    getUser (_id) {
      let user = this.$_.find(this.$props.users, u => u._id === _id)
      return user || {}
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
      this.$api('post', 'meetings/confirm/' + meeting._id).then(response => {
        this.$emit('onUpdate')
        this.toggleModal('confirmed')
        this.notify(response.data.message, 'success')
      }).catch(e => {
        this.notify('Временно нельзя согласовать событие', 'info')
        this.$log(e, 'danger')
      })
    },
    rejectMeeting (meeting) {
      this.$api('post', 'meetings/reject/' + meeting._id).then(response => {
        this.$emit('onUpdate')
        this.toggleModal('reject')
        this.notify(response.data.message, 'error')
      }).catch(e => {
        this.notify('Временно нельзя отказать во встречи', 'info')
        this.$log(e, 'danger')
      })
    },
    setMeetingDate () {
      const date = new Date(this.model.startDate)
      const startTime = this.model.startTime.split(':')
      const endTime = this.model.endTime.split(':')

      if (startTime[0] > endTime[0] || ((startTime[1] < 0 || startTime[1] > 59) || (endTime[1] < 0 || endTime[1] > 59))) {
        this.model.startTime = ''
        this.model.endTime = ''
        return this.notify('Введите правильное время для встречи', 'danger')
      }

      let startDate = new Date(date.setHours(startTime[0]))
      startDate = startDate.setMinutes(startTime[1])

      let endDate = new Date(date.setHours(endTime[0]))
      endDate = endDate.setMinutes(endTime[1])

      this.model.startDate = new Date(startDate)
      this.model.endDate = new Date(endDate)

      this.submit()
    },
    getPositionName (id) {
      const position = this.positions.find(p => p._id === id)
      return position && position.name
    }
  }
}
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style lang="scss" scoped>
</style>
