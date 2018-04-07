import feeManager from '@/managers/fee'
import cryptoBuilder from '@/builder/crypto'
import Transaction from '@/builder/transaction'
import { TRANSACTION_TYPES } from '@/constants'

export default class IPFS extends Transaction {
  /**
   * @constructor
   */
  constructor () {
    super()

    this.type = TRANSACTION_TYPES.IPFS
    this.fee = feeManager.get(TRANSACTION_TYPES.IPFS)
    this.amount = 0
    this.vendorFieldHex = null
    this.senderPublicKey = null
    this.asset = {}
  }

  /**
   * [create description]
   * Overrides the inherited method to add the necessary parameters
   * @param  {String} ipfshash [description]
   * @return {[type]}          [description]
   */
  create (ipfshash) {
    this.ipfshash = ipfshash
    return this
  }

  /**
   * [setVendorField description]
   * @param {String} type [description]
   */
  setVendorField (type) {
    this.vendorFieldHex = Buffer.from(this.ipfshash, type).toString('hex')
    while (this.vendorFieldHex.length < 128) {
      this.vendorFieldHex = '00' + this.vendorFieldHex
    }
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
      senderPublicKey: this.senderPublicKey,
      asset: this.asset
    }
  }
}
