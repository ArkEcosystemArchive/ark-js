import HttpClient from './http'

export default class ApiClient {
  constructor (host) {
    this.setConnection(host)
  }

  setConnection (host) {
    this.http = new HttpClient(host)
  }

  getConnection () {
    return this.http
  }

  resource (name) {
    const Resource = require(`./resources/${name}`).default

    return new Resource(this.http)
  }
}
