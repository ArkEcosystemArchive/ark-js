import deepmerge from 'deepmerge'
import feeManager from '@/managers/fee'
import { ARKTOSHI, TRANSACTION_TYPES } from '@/constants'

class configManager {
  setConfig (config) {
    this.config = {}

    for (const [key, value] of Object.entries(config)) {
      this.config[key] = value
    }

    this._buildConstants()
    this._buildFees()
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
    // TODO: Loop over "TRANSACTION_TYPES" and grab base fees from "constants"
    feeManager.set(TRANSACTION_TYPES.TRANSFER, 0.1 * ARKTOSHI)
    feeManager.set(TRANSACTION_TYPES.SECOND_SIGNATURE, 100 * ARKTOSHI)
    feeManager.set(TRANSACTION_TYPES.DELEGATE, 10000 * ARKTOSHI)
    feeManager.set(TRANSACTION_TYPES.VOTE, 1 * ARKTOSHI)
    feeManager.set(TRANSACTION_TYPES.MULTI_SIGNATURE, 0)
    feeManager.set(TRANSACTION_TYPES.IPFS, 0)
    feeManager.set(TRANSACTION_TYPES.TIMELOCK_TRANSFER, 0)
    feeManager.set(TRANSACTION_TYPES.MULTI_PAYMENT, 0)
    feeManager.set(TRANSACTION_TYPES.DELEGATE_RESIGNATION, 0)
  }
}

export default new configManager()
