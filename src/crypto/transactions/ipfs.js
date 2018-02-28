/** @module ipfs */

const crypto = require('./crypto.js')
const constants = require('../constants.js')
const slots = require('../time/slots.js')

/**
 * @static
 * @param {string} ipfshash
 * @param {ECPair|string} secret
 * @param {ECPair|string} [secondSecret]
 * @param {number} [feeOverride]
 */
exports.createHashRegistration = (ipfshash, secret, secondSecret, feeOverride) => {
  if (!ipfshash || !secret) return false

  if (feeOverride && !Number.isInteger(feeOverride)) {
    throw new Error('Not a valid fee')
  }

  let transaction = {
    type: 5,
    amount: 0,
    fee: feeOverride || constants.fees.send,
    timestamp: slots.getTime(),
    asset: {}
  }

  transaction.vendorFieldHex = new Buffer(ipfshash, 'utf8').toString('hex')
  // filling with 0x00
  while (transaction.vendorFieldHex.length < 128) {
    transaction.vendorFieldHex = '00' + transaction.vendorFieldHex
  }

  let keys = secret

  if (!crypto.isECPair(secret)) {
    keys = crypto.getKeys(secret)
  }

  if (!keys.publicKey) {
    throw new Error('Invalid public key')
  }

  transaction.senderPublicKey = keys.publicKey

  crypto.sign(transaction, keys)

  if (secondSecret) {
    let secondKeys = secondSecret
    if (!crypto.isECPair(secondSecret)) {
      secondKeys = crypto.getKeys(secondSecret)
    }
    crypto.secondSign(transaction, secondKeys)
  }

  transaction.id = crypto.getId(transaction)
  return transaction
}
