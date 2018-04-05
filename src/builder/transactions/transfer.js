import feeManager from '@/managers/fee'
import configManager from '@/managers/config'
import cryptoBuilder from '@/builder/crypto'
import slots from '@/crypto/slots'
import Transaction from '@/builder/transaction'
import Model from '@/models/transaction'
import { TRANSACTION_TYPES } from '@/constants'

export default class Transfer extends Transaction {
  constructor () {
    super()

    this.model = Model

    this.id = null
    this.type = TRANSACTION_TYPES.TRANSFER
    this.fee = feeManager.get(TRANSACTION_TYPES.TRANSFER)
    this.amount = 0
    this.timestamp = slots.getTime()
    this.recipientId = null
    this.senderPublicKey = null
    // TODO: why is this in the normal transfer and not timelock?
    this.expiration = 15 // 15 blocks, 120s
    this.version = 0x02
    this.network = configManager.get('pubKeyHash')
  }

  create (recipientId, amount) {
    this.recipientId = recipientId
    this.amount = amount
    return this
  }

  setVendorField (data, type) {
    this.vendorFieldHex = Buffer.from(data, type).toString('hex')
    return this
  }

  sign (passphrase) {
    const keys = cryptoBuilder.getKeys(passphrase)
    this.senderPublicKey = keys.publicKey
    this.signature = cryptoBuilder.sign(this, keys)
    return this
  }

  verify () {
    return cryptoBuilder.verify(this)
  }

  secondSign (transaction, passphrase) {
    const keys = cryptoBuilder.getKeys(passphrase)
    this.secondSignature = cryptoBuilder.secondSign(transaction, keys)
    return this
  }

  getStruct () {
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
      vendorFieldHex: this.vendorFieldHex,
      asset: this.asset
    }
  }
}
