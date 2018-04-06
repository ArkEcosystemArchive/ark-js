import Base from '@/api/base'

export default class Wallets extends Base {
  all () {
    return this.http.get('wallets')
  }

  top () {
    return this.http.get('wallets/top')
  }

  get (id) {
    return this.http.get(`wallets/${id}`)
  }

  transactions (id) {
    return this.http.get(`wallets/${id}/transactions`)
  }

  transactionsSent (id) {
    return this.http.get(`wallets/${id}/transactions/sent`)
  }

  transactionsReceived (id) {
    return this.http.get(`wallets/${id}/transactions/received`)
  }

  votes (id) {
    return this.http.get(`wallets/${id}/votes`)
  }

  search (payload) {
    return this.http.post('wallets/search', payload)
  }
}
