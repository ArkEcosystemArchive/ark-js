import Base from '@/api/base'

export default class Transactions extends Base {
  all (query) {
    return this.http.get('transactions', query)
  }

  get (id) {
    return this.http.get('transactions/get', {id})
  }

  allUnconfirmed (query) {
    return this.http.get('transactions/unconfirmed', query)
  }

  getUnconfirmed (id) {
    return this.http.get('transactions/unconfirmed/get', {id})
  }
}
