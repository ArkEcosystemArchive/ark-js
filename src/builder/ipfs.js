import Config from '../config'
import crypto from './crypto'
import slots from '../crypto/time/slots'

export default function (ipfshash, secret, secondSecret, feeOverride) {
  if (!ipfshash || !secret) return false

  if (feeOverride && !Number.isInteger(feeOverride)) {
    throw new Error('Not a valid fee')
  }

  let transaction = {
    type: 5,
    amount: 0,
    fee: feeOverride || Config.get('constants')[0].fees.send,
    timestamp: slots.getTime(),
    asset: {}
  }

  transaction.vendorFieldHex = Buffer.from(ipfshash, 'utf8').toString('hex')
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
