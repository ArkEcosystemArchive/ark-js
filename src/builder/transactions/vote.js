import Config from '../../config'
import crypto from '../crypto'
import slots from '../../crypto/slots'

export default function (secret, delegates, secondSecret, feeOverride) {
  if (!secret || !Array.isArray(delegates)) return

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
    type: 3,
    amount: 0,
    fee: feeOverride || Config.get('constants')[0].fees.vote,
    recipientId: crypto.getAddress(keys.publicKey),
    senderPublicKey: keys.publicKey,
    timestamp: slots.getTime(),
    asset: {
      votes: delegates
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
