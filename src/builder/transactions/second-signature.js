import feeManager from '@/managers/fee'
import cryptoBuilder from '@/builder/crypto'
import Transaction from '@/builder/transaction'
import { TRANSACTION_TYPES } from '@/constants'

export default class SecondSignature extends Transaction {
  /**
   * @constructor
   * @return {[type]} [description]
   */
  constructor () {
    super()

    this.type = TRANSACTION_TYPES.SECOND_SIGNATURE
    this.fee = feeManager.get(TRANSACTION_TYPES.SECOND_SIGNATURE)
    this.amount = 0
    this.recipientId = null
    this.senderPublicKey = null
    this.asset = { signature: {} }
  }

  /**
   * [sign description]
   * Overrides the inherited `sign` method to include the generated second
   * signature
   * @param  {String} passphrase [description]
   * @return {[type]}            [description]
   */
  sign (passphrase) {
    super.sign(passphrase)
    this.asset.signature = this.signature
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
