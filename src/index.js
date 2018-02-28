import ApiClient from './api'
import Crypto from './crypto'

export default class Ark {
  constructor (config) {
    this.setConfig(config)
  }

  setConfig (config) {
    this.config = config
  }

  getCrypto (ip, port) {
    return new Crypto(this.config)
  }

  getClient (ip, port) {
    return new ApiClient(this.config)
  }
}
