export default class MultiSignature {
  constructor (http, builder) {
    this.http = http
    this.builder = builder
  }

  pending (publicKey) {
    return this.http.get('api/multisignatures/pending', {
      'publicKey': publicKey
    })
  }

  sign (transactionId, secret, parameters = {}) {
    return this.http.post('api/multisignatures/sign', Object.assign({
      'transactionId': transactionId,
      'secret': secret
    }, parameters))
  }

  create (secret, secondSecret, keysgroup, lifetime, min) {
    let transaction = this.builder.multisignature(secret, secondSecret, keysgroup, lifetime, min)

    return this.http.post('peer/transactions', {
      'transactions': [transaction]
    })
  }

  accounts (publicKey) {
    return this.http.get('api/multisignatures/accounts', {
      'publicKey': publicKey
    })
  }
}
