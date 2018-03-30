import ApiClient from '@/api'
import transactionBuilder from '@/builder'
import configManager from '@/managers/config'
import feeManager from '@/managers/fee'

export default class Ark {
  constructor (config) {
    this.setConfig(config)
  }

  setConfig (config) {
    configManager.setConfig(config)
  }

  getFeeManager () {
    return feeManager
  }

  getconfigManager () {
    return configManager
  }

  getBuilder () {
    return transactionBuilder
  }

  getClient (host) {
    return new ApiClient(host)
  }
}
