import ApiClient from '@/api'
import Builder from '@/builder'
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

  getConfigManager () {
    return configManager
  }

  getBuilder () {
    return new Builder()
  }

  getClient (host) {
    return new ApiClient(host)
  }
}
