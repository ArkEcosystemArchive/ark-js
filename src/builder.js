export default class Builder {
  // TODO: move this to the config object
  // constructor (nethash) {
  //   ark.crypto.setNetworkVersion({
  //     '6e84d08bd299ed97c212c886c98a57e36545c8f5d645ca7eeae63a8bd62d8988': 0x17,
  //     '578e820911f24e039733b45e4882b73e301f813a0d2c31330dafda84534ffa23': 0x1E,
  //     '313ea34c8eb705f79e7bc298b788417ff3f7116c9596f5c9875e769ee2f4ede1': 0x2D
  //   }[nethash])
  // }

  delegate () {
    return secondSecret
      ? ark.delegate.createDelegate(secret, username, secondSecret)
      : ark.delegate.createDelegate(secret, username)
  }

  multisignature () {
    return ark.transaction.createMultisignature(secret, secondSecret, keysgroup, lifetime, min)
  }

  signature (secret, secondSecret) {
    return ark.signature.createSignature(secret, secondSecret)
  }

  transaction (recipientId, amount, vendorField, secret, secondSecret = null) {
    return secondSecret
      ? ark.transaction.createTransaction(recipientId, amount, vendorField, secret, secondSecret)
      : ark.transaction.createTransaction(recipientId, amount, vendorField, secret)
  }

  vote (secret, delegate, secondSecret = null) {
    return secondSecret
      ? ark.vote.createVote(secret, ['+' + delegate], secondSecret)
      : ark.vote.createVote(secret, ['+' + delegate])
  }

  unvote (secret, delegate, secondSecret = null) {
    return secondSecret
      ? ark.vote.createVote(secret, ['-' + delegate], secondSecret)
      : ark.vote.createVote(secret, ['-' + delegate])
  }
}
