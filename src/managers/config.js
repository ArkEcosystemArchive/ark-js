import _ from 'lodash'
import deepmerge from 'deepmerge'
import feeManager from '@/managers/fee'
import { TRANSACTION_TYPES } from '@/constants'

class ConfigManager {
  setConfig (config) {
    this.config = {}

    for (const [key, value] of Object.entries(config)) {
      this.config[key] = value
    }

    if (!config.constants) console.log(config)

    this._buildConstants()
    this._buildFees()
  }

  setFromFile (file) {
    this.setConfig(require(file))
  }

  all () {
    return this.config
  }

  set (key, value) {
    this.config[key] = value
  }

  get (key) {
    return this.config[key]
  }

  setHeight (value) {
    this.height = value
  }

  getHeight () {
    return this.height
  }

  getConstant (key) {
    return this.getConstants()[key]
  }

  getConstants (height) {
    if (this.height) {
      height = this.height
    }

    if (!height) {
      height = 1
    }

    while ((this.current.index < this.constants.length - 1) && height >= this.constants[this.current.index + 1].height) {
      this.current.index++
      this.current.data = this.constants[this.current.index]
    }
    while (height < this.constants[this.current.index].height) {
      this.current.index--
      this.current.data = this.constants[this.current.index]
    }

    return this.current.data
  }

  _buildConstants () {
    this.constants = this.config.constants.sort((a, b) => a.height - b.height)
    this.current = {
      index: 0,
      data: this.constants[0]
    }

    let lastmerged = 0

    while (lastmerged < this.constants.length - 1) {
      this.constants[lastmerged + 1] = deepmerge(this.constants[lastmerged], this.constants[lastmerged + 1])
      lastmerged++
    }
  }

  _buildFees () {
    Object
      .keys(TRANSACTION_TYPES)
      .forEach(type => feeManager.set(TRANSACTION_TYPES[type], this.getConstant('fees')[_.camelCase(type)]))
  }
}

export default new ConfigManager()
