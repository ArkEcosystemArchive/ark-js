import Config from '../../config'
import crypto from '../crypto'
import slots from '../../crypto/slots'

export default function (recipientId, amount, vendorField, secret, secondSecret, version, feeOverride) {
  if (!recipientId || !amount || !secret) return false

  if (!crypto.validateAddress(recipientId, version)) {
    throw new Error('Wrong recipientId')
  }

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

  let transaction = {
    type: 0,
    amount: amount,
    fee: feeOverride || Config.get('constants')[0].fees.send,
    recipientId: recipientId,
    timestamp: slots.getTime(),
    asset: {}
  }

  if (vendorField) {
    transaction.vendorField = vendorField
    if (transaction.vendorField.length > 64) {
      return null
    }
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
