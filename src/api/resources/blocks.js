import Base from '@/api/base'

export default class Blocks extends Base {
  all () {
    return this.http.get('blocks')
  }

  get (id) {
    return this.http.get(`blocks/${id}`)
  }

  transactions (id) {
    return this.http.get(`blocks/${id}/transactions`)
  }

  search (payload) {
    return this.http.post('blocks/search', payload)
  }
}
