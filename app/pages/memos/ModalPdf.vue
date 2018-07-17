<template>
  <Modal :isOpen="model">
    <div class="modal-dialog small" slot="content">
      <div class="modal-content">
        <div class="modal-header">
          <div class="list_header">
            <div class="flex">
              <div>Cкачать PDF</div>
              <div class="buttons">
                <button class="button-top close" @click="close" type="button"></button>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-body">
          <center>
            <select class="select-logo" name="logo" v-model="selectedLogo">
              <option value="logo1">GreenBus</option>
              <option value="logo2">АТГ</option>
              <option value="logo3">КИ 2</option>
            </select>
          </center>
          <center>
            <div class="logo"><img :src="logo"/></div>
          </center>
        </div>
        <div class="modal-footer">
          <div class="flex center">
            <button type="button" class="add-button auto-width send" @click="pdf">Скачать</button>
          </div>
        </div>
      </div>
    </div>
  </Modal>
</template>

<script>
import Modal from '@/Modal'
import 'pdfmake/build/pdfmake.js'
import pdfFonts from 'pdfmake/build/vfs_fonts.js'
pdfMake.vfs = pdfFonts.pdfMake.vfs
import pdf from './pdf'

import logo1 from '#/assets/design/logos/logo1.png'
import logo2 from '#/assets/design/logos/atg.jpg'
import logo3 from '#/assets/design/logos/ki.jpg'

export default {
  name: 'modal-pdf',
  components: {
    Modal
  },
  props: {
    model: Object,
    onClose: Function,
    users: Array,
    positions: Array
  },
  data () {
    return {
      selectedLogo: 'logo1',
    }
  },
  computed: {
    logo () {
      let logo = logo1
      if (this.selectedLogo === 'logo2') {
        logo = logo2
      }
      if (this.selectedLogo === 'logo3') {
        logo = logo3
      }
      return logo
    }
  },
  methods: {
    close () {
      this.$emit('onClose')
    },
    pdf () {
      let docDefinition = pdf.create(this.logo, this.model, this.users, this.$dateFormat, this.positions, this.statuses)
      try {
        pdfMake.createPdf(docDefinition).download()
      } catch (e) {
        this.notify('Невозможно сгенерировать PDF файл', 'danger')
      }
    },
    getUser (_id) {
      return this.users.find(item = item._id === _id)
    }
  }
}
</script>

<style>
.logo {
  margin-right: 0;
}
</style>
