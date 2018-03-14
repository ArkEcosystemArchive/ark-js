const crypto = require('./crypto.js')
const constants = require('../constants.js')
const slots = require('../time/slots.js')

/**
 * @param {string} secondSecret
 * @returns {{publicKey: ECPair}}
 */
exports.newSignature = (secondSecret) => {
  let keys = crypto.getKeys(secondSecret)

  return { publicKey: keys.publicKey }
}

/**
 * @static
 * @param {ECPair|string} secret
 * @param {string} secondSecret
 * @param {number} [feeOverride]
 * @returns {Transaction}
 */
exports.createSignature = (secret, secondSecret, feeOverride) => {
  if (!secret || !secondSecret) return false

  let keys = secret

  if (!crypto.isECPair(secret)) {
    keys = crypto.getKeys(secret)
  }

  if (!keys.publicKey) {
    throw new Error('Invalid public key')
  }

  if (feeOverride && !Number.isInteger(feeOverride)) {
    throw new Error('Not a valid fee')
  }

  let signature = newSignature(secondSecret)
  let transaction = {
    type: 1,
    amount: 0,
    fee: feeOverride || constants.fees.secondsignature,
    recipientId: null,
    senderPublicKey: keys.publicKey,
    timestamp: slots.getTime(),
    asset: {
      signature: signature
    }
  }

  crypto.sign(transaction, keys)
  transaction.id = crypto.getId(transaction)

  return transaction
}
