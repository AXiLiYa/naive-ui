import { h } from 'vue'
import withapp from '../../_mixins/withapp'
import themeable from '../../_mixins/themeable'
import hollowoutable from '../../_mixins/hollowoutable'
import asformitem from '../../_mixins/asformitem'
import getDefaultSlot from '../../_utils/vue/getDefaultSlot'
import usecssr from '../../_mixins/usecssr'
import styles from './styles/radio-group/index.js'
import { warn } from '../../_utils/naive/warn'

function mapSlot (h, defaultSlot, groupInstance) {
  const mappedSlot = []
  defaultSlot = defaultSlot || []
  for (let i = 0; i < defaultSlot.length; ++i) {
    const wrappedInstance = defaultSlot[i]
    const instanceOptions = wrappedInstance.type
    if (
      __DEV__ && (
        !instanceOptions ||
        !['Radio', 'RadioButton'].includes(instanceOptions.name)
      )
    ) {
      warn('radio-group', '`n-radio-group` only taks `n-radio` and `n-radio-button` as children.')
      continue
    }
    const instanceProps = wrappedInstance.props
    if (i === 0 || instanceOptions.name === 'Radio') {
      mappedSlot.push(wrappedInstance)
    } else {
      const lastInstanceProps = mappedSlot[mappedSlot.length - 1].props
      const lastInstanceChecked = groupInstance.$props.value === lastInstanceProps.value
      const lastInstanceDisabled = lastInstanceProps.disabled
      const currentInstanceChecked = groupInstance.$props.value === instanceProps.value
      const currentInstanceDisabled = instanceProps.disabled
      let lastInstancePriority
      let currentInstancePriority
      if (groupInstance.syntheticTheme === 'dark') {
        /**
         * Priority of button splitor:
         * !disabled  checked >
         * !disabled !checked >
         *  disabled  checked >
         *  disabled !checked
         */
        lastInstancePriority = (!lastInstanceDisabled ? 2 : 0) + (lastInstanceChecked ? 1 : 0)
        currentInstancePriority = (!currentInstanceDisabled ? 2 : 0) + (currentInstanceChecked ? 1 : 0)
      } else {
        /**
         * Priority of button splitor:
         * !disabled  checked >
         *  disabled  checked >
         * !disabled !checked >
         *  disabled !checked
         */
        lastInstancePriority = (lastInstanceChecked ? 2 : 0) + (!lastInstanceDisabled ? 1 : 0)
        currentInstancePriority = (currentInstanceChecked ? 2 : 0) + (!currentInstanceDisabled ? 1 : 0)
      }
      const lastInstanceClass = {
        'n-radio-group__splitor--disabled': lastInstanceDisabled,
        'n-radio-group__splitor--checked': lastInstanceChecked
      }
      const currentInstanceClass = {
        'n-radio-group__splitor--disabled': currentInstanceDisabled,
        'n-radio-group__splitor--checked': currentInstanceChecked
      }
      let splitorClass
      if (lastInstancePriority < currentInstancePriority) splitorClass = currentInstanceClass
      else splitorClass = lastInstanceClass
      mappedSlot.push(h('div', {
        staticClass: 'n-radio-group__splitor',
        class: splitorClass
      }), wrappedInstance)
    }
  }
  return mappedSlot
}

export default {
  name: 'RadioGroup',
  cssrName: 'Radio',
  cssrId: 'RadioGroup',
  mixins: [
    withapp,
    themeable,
    hollowoutable,
    usecssr(styles),
    asformitem({
      change: 'change'
    }, 'small')
  ],
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    name: {
      type: String,
      default: null
    },
    value: {
      type: [Boolean, String, Number],
      default: null
    },
    size: {
      default: undefined,
      validator (value) {
        return ['small', 'medium', 'large'].includes(value)
      }
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      radioButtonCount: 0,
      transitionDisabled: true
    }
  },
  mounted () {
    if (this.radioButtonCount > 0) {
      this.$nextTick().then(() => {
        this.transitionDisabled = false
      })
    }
  },
  provide () {
    return {
      NRadioGroup: this,
      NFormItem: null
    }
  },
  render () {
    const isButtonGroup = this.radioButtonCount > 0
    return h('div', {
      class: [
        'n-radio-group',
        {
          [`n-${this.syntheticTheme}-theme`]: this.syntheticTheme,
          [`n-radio-group--${this.syntheticSize}-size`]: this.syntheticSize,
          [`n-radio-group--button-group`]: isButtonGroup,
          [`n-radio-group--transition-disabled`]: isButtonGroup && this.transitionDisabled
        }
      ]
    }, mapSlot(h, getDefaultSlot(this), this))
  }
}