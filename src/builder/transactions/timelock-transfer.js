import ConfigManager from '../../managers/config'
import FeeManager from '../../managers/fee'
import crypto from '../crypto'
import slots from '../../crypto/slots'
import Transaction from '../transaction'
import { TRANSACTION_TYPES } from '../../constants'

export default class TimelockTransfer extends Transaction {
  constructor () {
    super()

    this.id = null
    this.type = TRANSACTION_TYPES.TIMELOCK_TRANSFER
    this.fee = FeeManager.get(TRANSACTION_TYPES.TIMELOCK_TRANSFER)
    this.amount = 0
    this.timestamp = slots.getTime()
    this.recipientId = null
    this.senderPublicKey = null
    this.timelockType = 0x00
    this.timelock = null
    this.version = 0x02
  }

  create (recipientId, amount, timelock, timelockType) {
    this.recipientId = recipientId
    this.amount = amount
    this.timelock = timelock
    this.timelockType = timelockType
    return this
  }

  setVendorField (data, type) {
    this.vendorFieldHex = Buffer.from(data, type).toString('hex')
    return this
  }

  sign (passphrase) {
    const keys = crypto.getKeys(passphrase)
    this.senderPublicKey = keys.publicKey
    this.signature = crypto.sign(this, keys)
    return this
  }

  verify () {
    return crypto.verify(this)
  }

  secondSign (transaction, passphrase) {
    const keys = crypto.getKeys(passphrase)
    this.secondSignature = crypto.secondSign(transaction, keys)
    return this
  }

  serialise () {
    return {
      hex: crypto.getBytes(this).toString('hex'),
      id: crypto.getId(this),
      signature: this.signature,
      secondSignature: this.secondSignature,
      timestamp: this.timestamp,

      type: this.type,
      amount: this.amount,
      fee: this.fee,
      recipientId: this.recipientId,
      senderPublicKey: this.senderPublicKey,
      vendorFieldHex: this.vendorFieldHex,
      asset: this.asset,
      timelock: this.timelock,
      timelockType: this.timelockType
    }
  }
}
