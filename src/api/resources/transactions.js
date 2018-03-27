import Base from '../base'

export default class Transactions extends Base {
  all () {
    return this.http.get('transactions')
  }

  create (payload) {
    return this.http.post('transactions', payload)
  }

  get (id) {
    return this.http.get(`transactions/${id}`)
  }

  allUnconfirmed () {
    return this.http.get('transactions/unconfirmed')
  }

  getUnconfirmed (id) {
    return this.http.get(`transactions/unconfirmed/${id}`)
  }

  search (payload) {
    return this.http.post('transactions/search', payload)
  }

  types () {
    return this.http.get('transactions/types')
  }
}
