import ApiClient from './api'
import Crypto from './crypto'
import Config from '../../config'

export default class Ark {
  constructor (config) {
    this.setConfig(config)
  }

  setConfig (config) {
    Config.setConfig(config)
  }

  getCrypto () {
    return new Crypto()
  }

  getClient (config) {
    const client = new ApiClient()
    client.setConnection(config.ip, config.port, config.nethash, config.version)

    return client
  }
}
