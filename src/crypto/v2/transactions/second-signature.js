import Config from '../../config'
import crypto from '../crypto'
import slots from '../../crypto/slots'

export default class SecondSignature {
  constructor () {
    this.id = null
    this.type = 1
    this.fee = Config.getConstants(height).fees.secondsignature
    this.amount = 0
    this.timestamp = slots.getTime()
    this.recipientId = null
    this.senderPublicKey = null
    this.asset = { signature: {} }
    this.version = 0x02
    this.network = Config.all()
  }

  create () {
    return this
  }

  setPublicKeys (keys) {
    this.senderPublicKey = keys.publicKey
    return this
  }

  sign (passphrase) {
    const keys = crypto.getKeys(passphrase)
    this.senderPublicKey = keys.publicKey
    this.signature = crypto.sign(this, keys)
    this.asset.signature = this.signature
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
