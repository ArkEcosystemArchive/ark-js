import Config from '../../config'
import crypto from '../crypto'
import slots from '../../crypto/slots'
import Transaction from '../transaction'

export default class Delegate extends Transaction {
  constructor () {
    super()

    this.id = null
    this.type = 2
    this.fee = Config.getConstants(1).fees.delegate // TODO: replace 1 with the actual height
    this.amount = 0
    this.timestamp = slots.getTime()
    this.recipientId = null
    this.senderPublicKey = null
    this.asset = { delegate: {} }
    this.version = 0x02
    this.network = Config.all()
  }

  create (username) {
    this.username = username
    return this
  }

  setPublicKeys (keys) {
    this.senderPublicKey = keys.publicKey
    this.asset.delegate.publicKey = keys.publicKey
    return this
  }

  sign (passphrase) {
    const keys = crypto.getKeys(passphrase)
    this.senderPublicKey = keys.publicKey
    this.signature = crypto.sign(this, keys)
    this.setPublicKeys(keys)
    return this
  }

  secondSign (transaction, passphrase) {
    const keys = crypto.getKeys(passphrase)
    this.secondSignature = crypto.secondSign(transaction, keys)
    this.setPublicKeys(keys)
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
