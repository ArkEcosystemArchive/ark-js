import Base from './base'

export default class Peers extends Base {
  all() {
    return this.http.get('peers')
  }

  get(ip) {
    return this.http.get(`peers/${ip}`)
  }
}
