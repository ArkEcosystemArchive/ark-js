import Config from '@/config'
import axios from 'axios'

export default class Http {
  get (path, payload = {}) {
    return this.sendRequest('get', path, payload)
  }

  post (path, payload = {}) {
    return this.sendRequest('post', path, payload)
  }

  put (path, payload = {}) {
    return this.sendRequest('put', path, payload)
  }

  patch (path, payload = {}) {
    return this.sendRequest('patch', path, payload)
  }

  delete (path, payload = {}) {
    return this.sendRequest('delete', path, payload)
  }

  async sendRequest (method, path, payload) {
    const client = axios.create({
      baseURL: `http://${this.ip}:${this.port}`,
      headers: {
        'nethash': Config.get('nethash'),
        'version': Config.get('version'),
        'port': '1'
      }
    })

    if (['get', 'delete'].includes(method)) {
      payload = {
        params: payload
      }
    }

    try {
      return await client[method](path, payload)
    } catch (error) {
      throw error
    }
  }
}
