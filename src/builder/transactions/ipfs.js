import feeManager from '@/managers/fee'
import configManager from '@/managers/config'
import cryptoBuilder from '@/builder/crypto'
import slots from '@/crypto/slots'
import Transaction from '@/builder/transaction'
import Model from '@/models/transaction'
import { TRANSACTION_TYPES } from '@/constants'

export default class IPFS extends Transaction {
  /**
   * @constructor
   */
  constructor () {
    super()

    this.model = Model

    this.id = null
    this.type = TRANSACTION_TYPES.IPFS
    this.fee = feeManager.get(TRANSACTION_TYPES.IPFS)
    this.amount = 0
    this.timestamp = slots.getTime()
    this.vendorFieldHex = null
    this.senderPublicKey = null
    this.asset = {}
    this.version = 0x02
    this.network = configManager.get('pubKeyHash')
  }

  /**
   * [create description]
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
   * @return {[type]} [description]
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
