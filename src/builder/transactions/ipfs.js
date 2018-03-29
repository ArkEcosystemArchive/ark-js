import ConfigManager from '../../managers/config'
import FeeManager from '../../managers/fee'
import crypto from '../crypto'
import slots from '../../crypto/slots'
import Transaction from '../transaction'
import { TRANSACTION_TYPES } from '../../constants'

export default class IPFS extends Transaction {
  constructor () {
    super()

    this.id = null
    this.type = TRANSACTION_TYPES.IPFS
    this.fee = FeeManager.get(TRANSACTION_TYPES.IPFS)
    this.amount = 0
    this.timestamp = slots.getTime()
    this.vendorFieldHex = null
    this.senderPublicKey = null
    this.asset = {}
    this.version = 0x02
  }

  create (ipfshash) {
    this.ipfshash = ipfshash
    return this
  }

  setVendorField (type) {
    this.vendorFieldHex = Buffer.from(this.ipfshash, type).toString('hex')
    while (this.vendorFieldHex.length < 128) {
      this.vendorFieldHex = '00' + this.vendorFieldHex
    }
    return this
  }

  sign (passphrase) {
    const keys = crypto.getKeys(passphrase)
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

  serialise () {
    return {
      hex: crypto.getBytes(this).toString('hex'),
      id: crypto.getId(this),
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
