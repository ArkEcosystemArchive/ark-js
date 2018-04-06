import Base from '@/api/base'

export default class Peers extends Base {
  all (query) {
    return this.http.get('peers', query)
  }

  get (ip, port) {
    return this.http.get('peers/get', {ip, port})
  }

  version () {
    return this.http.get('peers/version')
  }
}
