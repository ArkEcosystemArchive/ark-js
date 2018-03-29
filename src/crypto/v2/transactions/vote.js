import Config from '../../config'
import crypto from '../crypto'
import slots from '../../crypto/slots'

export default class Vote {
  constructor () {
    this.id = null
    this.type = 3
    this.fee = Config.getConstants(height).fees.vote
    this.amount = 0
    this.timestamp = slots.getTime()
    this.recipientId = null
    this.senderPublicKey = null
    this.asset = { votes: {} }
    this.version = 0x02
    this.network = Config.all()
  }

  create (delegates) {
    this.asset.votes = delegates
    return this
  }

  sign (passphrase) {
    const keys = crypto.getKeys(passphrase)
    this.senderPublicKey = keys.publicKey
    this.signature = crypto.sign(this, keys)
    this.setRecipientAndSender(keys)
    return this
  }

  secondSign (transaction, passphrase) {
    const keys = crypto.getKeys(passphrase)
    this.secondSignature = crypto.secondSign(transaction, keys)
    this.setRecipientAndSender(keys)
    return this
  }

  setRecipientAndSender (keys) {
    this.recipientId = crypto.getAddress(keys.publicKey)
    this.senderPublicKey = keys.publicKey
    return this
  }

  verify () {
    return crypto.verify(this)
  }

  serialise () {
    return {
      hex: crypto.getBytes(this).toString('hex'),
      id: crypto.getId(this),
      signature: this.signature,
      secondSignature: this.secondSignature,

      type: this.type,
      amount: this.amount,
      fee: this.fee,
      recipientId: this.recipientId,
      senderPublicKey: this.senderPublicKey,
      timestamp: this.timestamp,
      asset: this.asset
    }
  }
}
