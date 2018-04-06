import HttpClient from './http'

export default class ApiClient {
  /**
   * [constructor description]
   * @param  {[type]} host [description]
   * @return {[type]}      [description]
   */
  constructor (host) {
    this.setConnection(host)

    this.version = 1
  }

  /**
   * [setConnection description]
   * @param {[type]} host [description]
   */
  setConnection (host) {
    this.http = new HttpClient(host, this.version)
  }

  /**
   * [getConnection description]
   * @return {[type]} [description]
   */
  getConnection () {
    return this.http
  }

  /**
   * [setVersion description]
   * @param {[type]} version [description]
   */
  setVersion (version) {
    this.version = version
    this.http.setVersion(version)

    return this
  }

  /**
   * [resource description]
   * @param  {[type]} name [description]
   * @return {[type]}      [description]
   */
  resource (name) {
    const Resource = require(`./resources/v${this.version}/${name}`).default

    return new Resource(this.http)
  }
}
