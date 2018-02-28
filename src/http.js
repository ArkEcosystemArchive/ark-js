import axios from 'axios'

export default class Http {
  constructor (config) {
    this.config = config
  }

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

  sendRequest (method, path, payload) {
    const client = axios.create({
      baseURL: `http://${this.ip}:${this.port}`,
      headers: {
        'nethash': this.config.nethash,
        'version': this.config.version,
        'port': '1'
      }
    })

    if (['get', 'delete'].includes(method)) {
      payload = {
        params: payload
      }
    }

    return client[method](path, payload).then(response => {
      if (!response.data.success) {
        throw response.data.error
      }

      return response
    }).catch(error => {
      throw error
    })
  }
}
