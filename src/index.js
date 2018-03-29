import ApiClient from './api'
import Builder from './builder'
import Config from './config'

export default class Ark {
  constructor (config) {
    this.setConfig(config)
  }

  setConfig (config) {
    Config.setConfig(config)
  }

  getBuilder () {
    return new Builder()
  }

  getClient (host) {
    return new ApiClient(host)
  }
}
