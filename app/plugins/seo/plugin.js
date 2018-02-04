export default {
  mixin: {
    created () {
      if (this.seoTitle) {
        document.title = this.seoTitle
      }
      if (this.seoTitle) {
        document.head.querySelector('meta[name=description]').content = this.seoDesc
      }
      if (this.seoKeys) {
        document.head.querySelector('meta[name=keys]').content = this.seoKeys
      }
    },
    watch: {
      seoTitle (newValue) {
        document.title = newValue
      },
      seoDesc (newValue) {
        document.head.querySelector('meta[name=description]').content = newValue
      },
      seoKeys (newValue) {
        document.head.querySelector('meta[name=keys]').content = newValue
      }
    },
  },
}