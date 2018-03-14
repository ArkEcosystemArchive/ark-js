import Builder from '@/builder'
import HttpClient from '@/http'

export default class ApiClient {
  api (resource) {
    return new (require(`./resources/${resource}`)(this.http, new Builder()))()
  }

  setConnection (ip, port, nethash, version) {
    this.http = new HttpClient(ip, port, nethash, version)
  }
}
