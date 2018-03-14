import ApiClient from './api'
import Crypto from './crypto'

export default class Ark {
  constructor (config) {
    this.setConfig(config)
  }

  setConfig (config) {
    this.config = config
  }

  getCrypto () {
    return new Crypto(this.config)
  }

  getClient () {
    return new ApiClient(this.config)
  }
}
