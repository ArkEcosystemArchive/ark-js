import feeManager from '@/managers/fee'
import cryptoBuilder from '@/builder/crypto'
import slots from '@/crypto/slots'
import Transaction from '@/builder/transaction'
import { TRANSACTION_TYPES } from '@/constants'

export default class Delegate extends Transaction {
  constructor () {
    super()

    this.id = null
    this.type = TRANSACTION_TYPES.DELEGATE
    this.fee = feeManager.get(TRANSACTION_TYPES.DELEGATE)
    this.amount = 0
    this.timestamp = slots.getTime()
    this.recipientId = null
    this.senderPublicKey = null
    this.asset = { delegate: {} }
    this.version = 0x02
  }

  create (username) {
    this.username = username
    return this
  }

  sign (passphrase) {
    const keys = cryptoBuilder.getKeys(passphrase)
    this.senderPublicKey = keys.publicKey
    this.signature = cryptoBuilder.sign(this, keys)
    this.asset.delegate.publicKey = keys.publicKey
    return this
  }

  secondSign (transaction, passphrase) {
    const keys = cryptoBuilder.getKeys(passphrase)
    this.secondSignature = cryptoBuilder.secondSign(transaction, keys)
    return this
  }

  verify () {
    return cryptoBuilder.verify(this)
  }

  serialise () {
    return {
      hex: cryptoBuilder.getBytes(this).toString('hex'),
      id: cryptoBuilder.getId(this),
      signature: this.signature,
      secondSignature: this.secondSignature,
      timestamp: this.timestamp,

      type: this.type,
      amount: this.amount,
      fee: this.fee,
      recipientId: this.recipientId,
      senderPublicKey: this.senderPublicKey,
      asset: this.asset
    }
  }
}
