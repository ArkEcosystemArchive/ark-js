import Base from '../base'

export default class Delegates extends Base {
  all () {
    return this.http.get('delegates')
  }

  get (id) {
    return this.http.get(`delegates/${id}`)
  }

  blocks (id) {
    return this.http.get(`delegates/${id}/blocks`)
  }

  voters (id) {
    return this.http.get(`delegates/${id}/voters`)
  }
}
