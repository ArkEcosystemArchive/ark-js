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
    this.timelockType = 0x00
    this.timelock = null
    this.recipientId = null
    this.version = 0x02
  }

  create (recipientId, timelock, timelockType) {
    this.recipientId = recipientId
    this.timelock = timelock
    this.timelockType = timelockType
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
      secondSignature: this.secondSignature,
      timestamp: this.timestamp,

      type: this.type,
      fee: this.fee,
      amount: this.amount,
      recipientId: this.recipientId,
      senderPublicKey: this.senderPublicKey,

      timelockType: this.timelockType,
      timelock: this.timelock,
    }
  }
}
