import Config from '../../config'
import crypto from '../crypto'
import slots from '../../crypto/slots'
import Transaction from '../transaction'

export default class DelegateResignation extends Transaction {
  constructor () {
    this.id = null
    this.type = 0
    this.fee = 0
    this.amount = 0
    this.timestamp = slots.getTime()
    this.version = 0x02
    this.network = Config.all()
  }

  create () {
    return this
  }

  sign (passphrase) {
    const keys = crypto.getKeys(passphrase)
    this.senderPublicKey = keys.publicKey
    this.signature = crypto.sign(this, keys)
    return this
  }

  secondSign (transaction, passphrase) {
    const keys = crypto.getKeys(passphrase)
    this.secondSignature = crypto.secondSign(transaction, keys)
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
      secondSignature: this.secondSignature
    }
  }
}
