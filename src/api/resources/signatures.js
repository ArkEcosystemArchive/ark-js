import Base from './base'

export default class Signatures extends Base {
  all() {
    return this.http.get('signatures')
  }
}
