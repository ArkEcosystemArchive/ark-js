import configManager from '@/managers/config'
import axios from 'axios'

export default class HttpClient {
  /**
   * [constructor description]
   * @param  {[type]} host    [description]
   * @param  {[type]} version [description]
   * @return {[type]}         [description]
   */
  constructor (host, version) {
    this.host = host.endsWith('/') ? host.slice(0, -1) : host
    this.version = version
  }

  /**
   * [setVersion description]
   * @param {[type]} version [description]
   */
  setVersion (version) {
    this.version = version
  }

  /**
   * [get description]
   * @param  {[type]} path   [description]
   * @param  {Object} params [description]
   * @return {[type]}        [description]
   */
  get (path, params = {}) {
    return this.sendRequest('get', path, params)
  }

  /**
   * [post description]
   * @param  {[type]} path [description]
   * @param  {Object} data [description]
   * @return {[type]}      [description]
   */
  post (path, data = {}) {
    return this.sendRequest('post', path, data)
  }

  /**
   * [put description]
   * @param  {[type]} path [description]
   * @param  {Object} data [description]
   * @return {[type]}      [description]
   */
  put (path, data = {}) {
    return this.sendRequest('put', path, data)
  }

  /**
   * [patch description]
   * @param  {[type]} path [description]
   * @param  {Object} data [description]
   * @return {[type]}      [description]
   */
  patch (path, data = {}) {
    return this.sendRequest('patch', path, data)
  }

  /**
   * [delete description]
   * @param  {[type]} path   [description]
   * @param  {Object} params [description]
   * @return {[type]}        [description]
   */
  delete (path, params = {}) {
    return this.sendRequest('delete', path, params)
  }

  /**
   * [sendRequest description]
   * @param  {[type]} method  [description]
   * @param  {[type]} path    [description]
   * @param  {[type]} payload [description]
   * @return {[type]}         [description]
   */
  sendRequest (method, path, payload) {
    const client = axios.create({
      baseURL: this.host,
      headers: {
        nethash: configManager.get('nethash'),
        version: configManager.get('version'),
        port: '1',
        'API-Version': this.version
      }
    })

    try {
      return client[method](path, payload)
    } catch (error) {
      throw error
    }
  }
}
