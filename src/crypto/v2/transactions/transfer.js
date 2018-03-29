import Config from '../../config'
import crypto from '../crypto'
import slots from '../../crypto/slots'

export default class Transfer {
  constructor (config, feeOverride) {
    if (feeOverride && !Number.isInteger(feeOverride)) {
      throw new Error('Not a valid fee')
    }

    this.id = null
    this.amount = 0
    this.fee = feeOverride || Config.get('constants')[0].fees.send
    this.timestamp = slots.getTime()
    this.type = 0
    this.expiration = 15 // 15 blocks, 120s
    this.version = 0x02
    this.network = config.network
  }

  create (recipientId, amount) {
    this.amount = amount
    this.recipientId = recipientId
    return this
  }

  setVendorField (data, type) {
    this.vendorFieldHex = Buffer.from(data, type).toString('hex')
    return this
  }

  sign (passphrase) {
    const keys = crypto.getKeys(passphrase)
    this.senderPublicKey = keys.publicKey
    this.signature = crypto.sign(this, keys)
    return this
  }

  verify () {
    return crypto.verify(this)
  }

  secondSign (transaction, passphrase) {
    const keys = crypto.getKeys(passphrase)
    this.secondSignature = crypto.secondSign(transaction, keys)
    return this
  }

  serialise () {
    return {
      hex: crypto.getBytes(this).toString('hex'),
      id: crypto.getId(this),
      signature: this.signature,
      secondSignature: this.secondSignature
    }
  }
}
