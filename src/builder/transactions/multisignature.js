import Config from '../../config'
import crypto from '../crypto'
import slots from '../../crypto/slots'

export default function (secret, secondSecret, keysgroup, lifetime, min, feeOverride) {
  if (!secret || !keysgroup || !lifetime || !min) return false

  let keys = secret

  if (!crypto.isECPair(secret)) {
    keys = crypto.getKeys(secret)
  }

  if (feeOverride && !Number.isInteger(feeOverride)) {
    throw new Error('Not a valid fee')
  }

  let transaction = {
    type: 4,
    amount: 0,
    fee: (keysgroup.length + 1) * (feeOverride || Config.get('constants')[0].fees.multisignature),
    recipientId: null,
    senderPublicKey: keys.publicKey,
    timestamp: slots.getTime(),
    asset: {
      multisignature: {
        min: min,
        lifetime: lifetime,
        keysgroup: keysgroup
      }
    }
  }

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
