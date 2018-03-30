import feeManager from '@/managers/fee'
import cryptoBuilder from '@/builder/crypto'
import slots from '@/crypto/slots'
import Transaction from '@/builder/transaction'
import { TRANSACTION_TYPES } from '@/constants'

export default class IPFS extends Transaction {
  constructor () {
    super()

    this.id = null
    this.type = TRANSACTION_TYPES.IPFS
    this.fee = feeManager.get(TRANSACTION_TYPES.IPFS)
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
    const keys = cryptoBuilder.getKeys(passphrase)
    this.senderPublicKey = keys.publicKey
    this.signature = cryptoBuilder.sign(this, keys)
    return this
  }

  secondSign (transaction, passphrase) {
    const keys = cryptoBuilder.getKeys(passphrase)
    this.secondSignature = cryptoBuilder.secondSign(transaction, keys)
    return this
  }

  verify () {
    return cryptoBuilder.verify(this)
  }

  serialise () {
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
