import ApiClient from './api'
import Config from './config'

export default class Ark {
  constructor (config) {
    this.setConfig(config)
  }

  setConfig (config) {
    Config.setConfig(config)
  }

  getClient (host) {
    return new ApiClient(host)
  }
}
