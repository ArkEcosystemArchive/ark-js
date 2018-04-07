import feeManager from '@/managers/fee'
import configManager from '@/managers/config'
import cryptoBuilder from '@/builder/crypto'
import slots from '@/crypto/slots'
import Transaction from '@/builder/transaction'
import { TRANSACTION_TYPES } from '@/constants'

export default class Vote extends Transaction {
  /**
   * @constructor
   * @return {[type]} [description]
   */
  constructor () {
    super()

    this.type = TRANSACTION_TYPES.VOTE
    this.fee = feeManager.get(TRANSACTION_TYPES.VOTE)
    this.amount = 0
    this.recipientId = null
    this.senderPublicKey = null
    this.asset = { votes: {} }
  }

  /**
   * [create description]
   * @param  {[type]} delegates [description]
   * @return {[type]}           [description]
   */
  create (delegates) {
    this.asset.votes = delegates
    return this
  }

  /**
   * [sign description]
   * Overrides the inherited `sign` method to set the sender as the recipient too
   * @param  {[type]} passphrase [description]
   * @return {[type]}            [description]
   */
  sign (passphrase) {
    const keys = cryptoBuilder.getKeys(passphrase)
    this.recipientId = cryptoBuilder.getAddress(keys.publicKey)
    this.senderPublicKey = keys.publicKey
    this.signature = cryptoBuilder.sign(this, keys)
    return this
  }

  /**
   * [getStruct description]
   * Overrides the inherited method to return the additional required by this
   * @return {Object} [description]
   */
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
      asset: this.asset
    }
  }
}
