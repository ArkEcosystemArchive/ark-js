import ConfigManager from '../../managers/config'
import crypto from '../crypto'
import slots from '../../crypto/slots'
import Transaction from '../transaction'
import { TRANSACTION_TYPES } from '../../constants'

export default class Transfer extends Transaction {
  constructor () {
    super()

    this.id = null
    this.type = TRANSACTION_TYPES.TRANSFER
    this.fee = FeeManager.get(TRANSACTION_TYPES.TRANSFER)
    this.amount = 0
    this.timestamp = slots.getTime()
    this.recipientId = null
    this.senderPublicKey = null
    this.version = 0x02
    this.network = ConfigManager.all()
  }

  create (recipientId, amount) {
    this.amount = amount
    this.recipientId = recipientId
    return this
  }

  setVendorField (data, type) {
    this.vendorFieldHex = Buffer.from(data, type).toString('hex')
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
    this.setPublicKeys(keys)
    return this
  }

  verify () {
    return crypto.verify(this)
  }

  secondSign (transaction, passphrase) {
    const keys = crypto.getKeys(passphrase)
    this.secondSignature = crypto.secondSign(transaction, keys)
    this.setPublicKeys(keys)
    return this
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
