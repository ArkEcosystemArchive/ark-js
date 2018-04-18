import ApiClient from '@/api'
import NetworkManager from '@/managers/network'
import transactionBuilder from '@/builder'
import configManager from '@/managers/config'
import feeManager from '@/managers/fee'

export default class Ark {
  /**
   * [constructor description]
   * @param  {[type]} config [description]
   * @return {[type]}        [description]
   */
  constructor (config) {
    this.setConfig(config || NetworkManager.findByName('devnet'))
  }

  /**
   * [setConfig description]
   * @param {[type]} config [description]
   */
  setConfig (config) {
    configManager.setConfig(config)
  }

  /**
   * [getFeeManager description]
   * @return {[type]} [description]
   */
  getFeeManager () {
    return feeManager
  }

  /**
   * [getConfigManager description]
   * @return {[type]} [description]
   */
  getConfigManager () {
    return configManager
  }

  /**
   * [getBuilder description]
   * @return {[type]} [description]
   */
  getBuilder () {
    return transactionBuilder
  }

  /**
   * [getClient description]
   * @param  {[type]} host [description]
   * @return {[type]}      [description]
   */
  getClient (host) {
    return new ApiClient(host)
  }

  static getNetworkManager () {
    return NetworkManager
  }
}
