import Config from '../config'
import axios from 'axios'

export default class Http {
  constructor (host) {
    this.host = host
  }

  get (path, params = {}) {
    return this.sendRequest('get', path, params)
  }

  post (path, data = {}) {
    return this.sendRequest('post', path, data)
  }

  put (path, data = {}) {
    return this.sendRequest('put', path, data)
  }

  patch (path, data = {}) {
    return this.sendRequest('patch', path, data)
  }

  delete (path, params = {}) {
    return this.sendRequest('delete', path, params)
  }

  sendRequest (method, path, payload) {
    const client = axios.create({
      baseURL: this.host,
      headers: {
        nethash: Config.get('nethash'),
        version: Config.get('version'),
        port: '1'
      }
    })

    try {
      return client[method](path, payload)
    } catch (error) {
      throw error
    }
  }
}
