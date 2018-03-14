import Config from '@/config'
import crypto from './crypto'
import slots from '@/crypto/time/slots'

export function (secret, username, secondSecret, feeOverride) {
  if (!secret || !username) return false

  const keys = secret

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
    type: 2,
    amount: 0,
    fee: feeOverride || Config.get('fees').delegate,
    recipientId: null,
    senderPublicKey: keys.publicKey,
    timestamp: slots.getTime(),
    asset: {
      delegate: {
        username: username,
        publicKey: keys.publicKey
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
