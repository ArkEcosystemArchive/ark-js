import feeManager from '@/managers/fee'
import configManager from '@/managers/config'
import cryptoBuilder from '@/builder/crypto'
import slots from '@/crypto/slots'
import Transaction from '@/builder/transaction'
import Model from '@/models/transaction'
import { TRANSACTION_TYPES } from '@/constants'

export default class Delegate extends Transaction {
  /**
   * @constructor
   */
  constructor () {
    super()

    this.model = Model

    this.id = null
    this.type = TRANSACTION_TYPES.DELEGATE
    this.fee = feeManager.get(TRANSACTION_TYPES.DELEGATE)
    this.amount = 0
    this.timestamp = slots.getTime()
    this.recipientId = null
    this.senderPublicKey = null
    this.asset = { delegate: {} }
    this.version = 0x02
    this.network = configManager.get('pubKeyHash')
  }

  /**
   * [create description]
   * Overrides the inherited method to add the necessary parameters
   * @param  {String} username [description]
   * @return {[type]}          [description]
   */
  create (username) {
    this.username = username
    return this
  }

  /**
   * [sign description]
   * Overrides the inherited `sign` method to include the public key of the new
   * delegate
   * @param  {String} passphrase [description]
   * @return {[type]}            [description]
   */
  sign (passphrase) {
    const keys = cryptoBuilder.getKeys(passphrase)
    this.senderPublicKey = keys.publicKey
    this.signature = cryptoBuilder.sign(this, keys)
    this.asset.delegate.publicKey = keys.publicKey
    return this
  }

  /**
   * Overrides the inherited method to return the additional required by this
   * type of transaction
   * [getStruct description]
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
