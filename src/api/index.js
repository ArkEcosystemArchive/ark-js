import HttpClient from './http'

export default class ApiClient {
  constructor (host) {
    this.setConnection(host)

    this.version = 1
  }

  setConnection (host) {
    this.http = new HttpClient(host, this.version)
  }

  getConnection () {
    return this.http
  }

  setVersion (version) {
    this.version = version
    this.http.setVersion(version)

    return this
  }

  resource (name) {
    const Resource = require(`./resources/v${this.version}/${name}`).default

    return new Resource(this.http)
  }
}
