<template>
  <Box>
    <div class="col-md-6">
      <div :class="['form-group', {'has-error': errors.has('users')}]">
        <label for="field-users">Сотрудники с доступом для ексел</label><br />
        <Multiselect
          id="field-users"
          v-model="selectedUsers"
          :options="users"
          :close-on-select="false"
          :hide-selected="true"
          :clear-on-select="false"
          :multiple="true"
          track-by="fullname"
          label="fullname">
        </Multiselect>
        <span v-show="errors.has('users')" class="help-block">{{ errors.first('users') }}</span>
      </div>
      <div class="form-group">
        <button class="btn btn-primary" @click="addExcelUsers()">Применить</button>
      </div>
    </div>
  </Box>
</template>

<script>
import Multiselect from 'vue-multiselect'
import Box from '@/Box'

export default {
  name: 'Panel',
  components: {
    Multiselect,
    Box
  },
  data () {
    return {
      users: [],
      selectedUsers: []
    }
  },
  methods: {
    loadUsers () {
      return this.$api('get', 'users').then(response => {
        this.users = response.data
      }).catch(e => {
        this.notify(e, 'danger')
      })
    },
    loadUtil () {
      return this.$api('get', 'users/utils').then(response => {
        const users = response.data.util.excelUsers
        if ((this.users && this.users.length > 0) && (users && users.length > 0)) {
          this.$store.commit('app/setExcelUsers', users)
          this.selectedUsers = this.users.filter(user => users.includes(user._id))
        }
      }).catch(err => {
        console.log(err.response)
      })
    },
    addExcelUsers () {
      if (this.selectedUsers.length === 0) return this.notify('Добавьте пользователей', 'danger')
      const users = this.selectedUsers.map(user => user._id)
      this.$api('post', 'users/excel', { users }).then(response => {
        this.notify(response.data.message)
        this.loadUtil()
      }).catch(err => {
        console.log(err.response)
      })
    }
  },
  beforeMount () {
    this.loadUsers().then(() => {
      this.loadUtil()
    })
  }
}
</script>

<style lang="scss" scoped>

</style>


