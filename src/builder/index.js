import createDelegate from './delegate'
import createMultisignature from './multisignature'
import createSignature from './signature'
import createTransaction from './transaction'
import createVote from './vote'

export default class Builder {
  delegate (secret, username, secondSecret) {
    return secondSecret
      ? createDelegate(secret, username, secondSecret)
      : createDelegate(secret, username)
  }

  multisignature (secret, secondSecret, keysgroup, lifetime, min) {
    return createMultisignature(secret, secondSecret, keysgroup, lifetime, min)
  }

  signature (secret, secondSecret) {
    return createSignature(secret, secondSecret)
  }

  transaction (recipientId, amount, vendorField, secret, secondSecret = null) {
    return secondSecret
      ? createTransaction(recipientId, amount, vendorField, secret, secondSecret)
      : createTransaction(recipientId, amount, vendorField, secret)
  }

  vote (secret, delegate, secondSecret = null) {
    return secondSecret
      ? createVote(secret, ['+' + delegate], secondSecret)
      : createVote(secret, ['+' + delegate])
  }

  unvote (secret, delegate, secondSecret = null) {
    return secondSecret
      ? createVote(secret, ['-' + delegate], secondSecret)
      : createVote(secret, ['-' + delegate])
  }
}
