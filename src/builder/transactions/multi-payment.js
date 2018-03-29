import ConfigManager from '../../managers/config'
import FeeManager from '../../managers/fee'
import crypto from '../crypto'
import slots from '../../crypto/slots'
import Transaction from '../transaction'
import { TRANSACTION_TYPES } from '../../constants'

export default class MultiPayment extends Transaction {
  constructor () {
    super()

    this.id = null
    this.type = TRANSACTION_TYPES.MULTI_PAYMENT
    this.fee = FeeManager.get(TRANSACTION_TYPES.MULTI_PAYMENT)
    this.timestamp = slots.getTime()
    this.recipients = []
    this.amounts = []
    this.version = 0x02
  }

  create () {
    return this
  }

  addPayment (address, amount) {
    this.recipients.push(address)
    this.amounts.push(address)
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
    // TODO: merge this.recipients and this.amounts with N indices
    return {
      hex: crypto.getBytes(this).toString('hex'),
      id: crypto.getId(this),
      signature: this.signature,
      secondSignature: this.secondSignature,
      timestamp: this.timestamp

      type: this.type,
      fee: this.fee,
      senderPublicKey: this.senderPublicKey
    }
  }
}
