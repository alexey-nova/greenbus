import core from '../core'

export default {
  isRoute (name, paramName = '', param = []) {
    if (!core.$_.isArray(name)) name = [name]
    if (!core.$_.isArray(param)) param = [param]

    let isName = false
    core.$_.map(name, (value) => {
      if (isName === false) {
        isName = this.$route.name === value
      }
    })

    let isParam = param.length === 0
    core.$_.map(param, (value) => {
      if (isParam === false) {
        isParam = core.$_.get(this.$route.params, paramName) === value + ''
      }
    })

    return isName && isParam
  },
  createFormData (model) {
    let data = new FormData()
    this.$_.each(model, (value, key) => {
      if (key === 'files') {
        this.$_.each(value, (file, k) => {
          data.append('files[]', value[k])
        })
      }
      if (this.$_.isArray(value)) value = JSON.stringify(value)
      data.append(key, value)
    })
    return data
  },
  mixin: {},
}
