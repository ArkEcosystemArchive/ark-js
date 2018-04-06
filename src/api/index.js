import HttpClient from './http'

export default class ApiClient {
  constructor (host) {
    this.setConnection(host)

    this.version = 1
  }

  setConnection (host) {
    this.http = new HttpClient(host)
  }

  getConnection () {
    return this.http
  }

  setVersion () {
    this.version = 1
  }

  resource (name) {
    const Resource = require(`./resources/v${version}/${name}`).default

    return new Resource(this.http)
  }
}
