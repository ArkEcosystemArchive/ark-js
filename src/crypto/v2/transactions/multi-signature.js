import Config from '../../config'
import crypto from '../crypto'
import slots from '../../crypto/slots'

export default class MultiSignature {
  create (keysgroup, lifetime, min) {
    this.keysgroup = keysgroup
    this.lifetime = lifetime
    this.min = min
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
      secondSignature: this.secondSignature
    }
  }
}
