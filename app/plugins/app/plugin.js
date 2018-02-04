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
  mixin: {},
}