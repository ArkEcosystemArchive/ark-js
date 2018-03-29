import ApiClient from '@/api'
import Builder from '@/builder'
import configManager from '@/managers/config'

export default class Ark {
  constructor (config) {
    this.setConfig(config)
  }

  setConfig (config) {
    configManager.setConfig(config)
  }

  getBuilder () {
    return new Builder()
  }

  getClient (host) {
    return new ApiClient(host)
  }
}
