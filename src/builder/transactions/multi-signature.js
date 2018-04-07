import feeManager from '@/managers/fee'
import configManager from '@/managers/config'
import cryptoBuilder from '@/builder/crypto'
import slots from '@/crypto/slots'
import Transaction from '@/builder/transaction'
import Model from '@/models/transaction'
import { TRANSACTION_TYPES } from '@/constants'

export default class MultiSignature extends Transaction {
  /**
   * @constructor
   * @return {[type]} [description]
   */
  constructor () {
    super()

    this.model = Model

    this.id = null
    this.type = TRANSACTION_TYPES.MULTI_SIGNATURE
    this.fee = 0
    this.amount = 0
    this.timestamp = slots.getTime()
    this.recipientId = null
    this.senderPublicKey = null
    this.asset = { multisignature: {} }
    this.version = 0x02
    this.network = configManager.get('pubKeyHash')
  }

  /**
   * [create description]
   * Overrides the inherited method to add the necessary parameters
   * @param  {[type]} keysgroup [description]
   * @param  {[type]} lifetime  [description]
   * @param  {[type]} min       [description]
   * @return {[type]}           [description]
   */
  create (keysgroup, lifetime, min) {
    this.asset.multisignature.keysgroup = keysgroup
    this.asset.multisignature.lifetime = lifetime
    this.asset.multisignature.min = min
    this.fee = (keysgroup.length + 1) * feeManager.get(TRANSACTION_TYPES.MULTI_SIGNATURE)
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
