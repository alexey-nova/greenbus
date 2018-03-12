<script>
  export default {
    data () {
      return {
        modal: {}
      }
    },
    methods: {
      toggle (name, model) {
        this.modal[name] = model === undefined ? !this.modal[name] : model
      },
    }
  }
</script>