import ApiClient from './api'
import Builder from './builder'
import ConfigManager from './config'

export default class Ark {
  constructor (config) {
    this.setConfig(config)
  }

  setConfig (config) {
    ConfigManager.setConfig(config)
  }

  getBuilder () {
    return new Builder()
  }

  getClient (host) {
    return new ApiClient(host)
  }
}
