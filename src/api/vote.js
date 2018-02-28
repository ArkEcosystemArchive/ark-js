export default class Vote {
  constructor (http, builder) {
    this.http = http
    this.builder = builder
  }

  vote (secret, delegate, secondSecret = null) {
    let transaction = this.builder.vote(secret, delegate, secondSecret)

    return this.http.post('peer/transactions', {
      'transactions': [transaction]
    })
  }

  unvote (secret, delegate, secondSecret = null) {
    let transaction = this.builder.unvote(secret, delegate, secondSecret)

    return this.http.post('peer/transactions', {
      'transactions': [transaction]
    })
  }
}
