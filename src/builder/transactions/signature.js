import Config from '../../config'
import crypto from '../crypto'
import slots from '../../crypto/slots'

export default function (secret, secondSecret, feeOverride) {
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

  let signature = { publicKey: crypto.getKeys(secondSecret).publicKey }
  let transaction = {
    type: 1,
    amount: 0,
    fee: feeOverride || Config.get('constants')[0].fees.secondsignature,
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
