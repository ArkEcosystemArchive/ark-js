import feeManager from '@/managers/fee'
import configManager from '@/managers/config'
import cryptoBuilder from '@/builder/crypto'
import slots from '@/crypto/slots'
import Transaction from '@/builder/transaction'
import Model from '@/models/transaction'
import { TRANSACTION_TYPES } from '@/constants'

export default class DelegateResignation extends Transaction {
  /**
   * [constructor description]
   * @return {[type]} [description]
   */
  constructor () {
    super()

    this.model = Model

    this.id = null
    this.type = TRANSACTION_TYPES.DELEGATE_RESIGNATION
    this.fee = feeManager.get(TRANSACTION_TYPES.DELEGATE_RESIGNATION)
    this.timestamp = slots.getTime()
    this.version = 0x02
    this.network = configManager.get('pubKeyHash')
  }

  /**
   * [create description]
   * @return {[type]} [description]
   */
  create () {
    return this
  }

  /**
   * [sign description]
   * @param  {[type]} passphrase [description]
   * @return {[type]}            [description]
   */
  sign (passphrase) {
    const keys = cryptoBuilder.getKeys(passphrase)
    this.senderPublicKey = keys.publicKey
    this.signature = cryptoBuilder.sign(this, keys)
    return this
  }

  /**
   * [secondSign description]
   * @param  {[type]} transaction [description]
   * @param  {[type]} passphrase  [description]
   * @return {[type]}             [description]
   */
  secondSign (transaction, passphrase) {
    const keys = cryptoBuilder.getKeys(passphrase)
    this.secondSignature = cryptoBuilder.secondSign(transaction, keys)
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
      fee: this.fee,
      senderPublicKey: this.senderPublicKey
    }
  }
}
