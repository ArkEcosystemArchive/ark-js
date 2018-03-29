import Config from '../../config'
import crypto from '../crypto'
import slots from '../../crypto/slots'
import Transaction from '../transaction'

export default class Vote extends Transaction {
  constructor () {
    super()

    this.id = null
    this.type = 3
    this.fee = Config.getConstants(1).fees.vote // TODO: replace 1 with the actual height
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

  setRecipientAndSender (keys) {
    this.recipientId = crypto.getAddress(keys.publicKey)
    this.senderPublicKey = keys.publicKey
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
