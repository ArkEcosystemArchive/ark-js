import ApiClient from '@/api'
import transactionBuilder from '@/builder'
import configManager from '@/managers/config'
import feeManager from '@/managers/fee'
import defaultConfig from '@/networks/ark/devnet'

export default class Ark {
  constructor (config) {
    this.setConfig(config || defaultConfig)
  }

  setConfig (config) {
    configManager.setConfig(config)
  }

  getFeeManager () {
    return feeManager
  }

  getConfigManager () {
    return configManager
  }

  getBuilder () {
    return transactionBuilder
  }

  getClient (host) {
    return new ApiClient(host)
  }
}
