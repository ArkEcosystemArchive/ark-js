import feeManager from '@/managers/fee'
import configManager from '@/managers/config'
import cryptoBuilder from '@/builder/crypto'
import slots from '@/crypto/slots'
import Transaction from '@/builder/transaction'
import Model from '@/models/transaction'
import { TRANSACTION_TYPES } from '@/constants'

export default class Vote extends Transaction {
  constructor () {
    super()

    this.id = null
    this.type = TRANSACTION_TYPES.VOTE
    this.fee = feeManager.get(TRANSACTION_TYPES.VOTE)
    this.amount = 0
    this.timestamp = slots.getTime()
    this.recipientId = null
    this.senderPublicKey = null
    this.asset = { votes: {} }
    this.version = 0x02
    this.network = configManager.get('pubKeyHash')
  }

  create (delegates) {
    this.asset.votes = delegates
    return this
  }

  sign (passphrase) {
    const keys = crypto.getKeys(passphrase)
    this.recipientId = crypto.getAddress(keys.publicKey)
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

  getStruct () {
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
      asset: this.asset
    }
  }

  serialise () {
    return Model.serialise(this.getStruct())
  }
}
