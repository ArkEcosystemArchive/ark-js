import Config from '@/config'
import crypto from 'crypto'
import crypto_utils from '@/crypto/crypto'
import ECPair from '@/crypto/ecpair'
import ECSignature from '@/crypto/ecsignature'
import bs58check from 'bs58check'
import ByteBuffer 'bytebuffer'
import bignum 'browserify-bignum'

if (typeof Buffer === 'undefined') {
  Buffer = require('buffer/').Buffer
}

const fixedPoint = Math.pow(10, 8)

export default class Crypto {
  /**
   * @static
   * @param {*} obj
   * @returns {boolean}
   */
  isECPair (obj) {
    return obj instanceof ECPair
  }

  /**
   * @static
   * @param {ECSignature} signature
   * @returns {Uint8Array}
   */
  getSignatureBytes (signature) {
    const bb = new ByteBuffer(33, true)
    const publicKeyBuffer = new Buffer(signature.publicKey, 'hex')

    for (const i = 0; i < publicKeyBuffer.length; i++) {
      bb.writeByte(publicKeyBuffer[i])
    }

    bb.flip()
    return new Uint8Array(bb.toArrayBuffer())
  }

  /**
   * @static
   * @param {Transaction} transaction
   * @param {boolean} [skipSignature=false]
   * @param {boolean} [skipSecondSignature=false]
   * @returns {Buffer}
   */
  getBytes (transaction, skipSignature, skipSecondSignature) {
    let assetSize = 0,
      assetBytes = null

    switch (transaction.type) {
      case 1: // Signature
        assetBytes = getSignatureBytes(transaction.asset.signature)
        assetSize = assetBytes.length
        break

      case 2: // Delegate
        assetBytes = new Buffer(transaction.asset.delegate.username, 'utf8')
        assetSize = assetBytes.length
        break

      case 3: // Vote
        if (transaction.asset.votes !== null) {
          assetBytes = new Buffer(transaction.asset.votes.join(''), 'utf8')
          assetSize = assetBytes.length
        }
        break

      case 4: // Multi-Signature
        const keysgroupBuffer = new Buffer(transaction.asset.multisignature.keysgroup.join(''), 'utf8')
        const bb = new ByteBuffer(1 + 1 + keysgroupBuffer.length, true)

        bb.writeByte(transaction.asset.multisignature.min)
        bb.writeByte(transaction.asset.multisignature.lifetime)

        for (const i = 0; i < keysgroupBuffer.length; i++) {
          bb.writeByte(keysgroupBuffer[i])
        }

        bb.flip()

        assetBytes = bb.toBuffer()
        assetSize = assetBytes.length
        break
    }

    const bb = new ByteBuffer(1 + 4 + 32 + 8 + 8 + 21 + 64 + 64 + 64 + assetSize, true)
    bb.writeByte(transaction.type)
    bb.writeInt(transaction.timestamp)

    const senderPublicKeyBuffer = new Buffer(transaction.senderPublicKey, 'hex')
    for (const i = 0; i < senderPublicKeyBuffer.length; i++) {
      bb.writeByte(senderPublicKeyBuffer[i])
    }

    if (transaction.recipientId) {
      const recipient = bs58check.decode(transaction.recipientId)
      for (const i = 0; i < recipient.length; i++) {
        bb.writeByte(recipient[i])
      }
    } else {
      for (const i = 0; i < 21; i++) {
        bb.writeByte(0)
      }
    }

    if (transaction.vendorFieldHex) {
      const vf = new Buffer(transaction.vendorFieldHex, 'hex')
      const fillstart = vf.length
      for (i = 0; i < fillstart; i++) {
        bb.writeByte(vf[i])
      }
      for (i = fillstart; i < 64; i++) {
        bb.writeByte(0)
      }
    } else if (transaction.vendorField) {
      const vf = new Buffer(transaction.vendorField)
      const fillstart = vf.length
      for (i = 0; i < fillstart; i++) {
        bb.writeByte(vf[i])
      }
      for (i = fillstart; i < 64; i++) {
        bb.writeByte(0)
      }
    } else {
      for (i = 0; i < 64; i++) {
        bb.writeByte(0)
      }
    }

    bb.writeLong(transaction.amount)

    bb.writeLong(transaction.fee)

    if (assetSize > 0) {
      for (var i = 0; i < assetSize; i++) {
        bb.writeByte(assetBytes[i])
      }
    }

    if (!skipSignature && transaction.signature) {
      var signatureBuffer = new Buffer(transaction.signature, 'hex')
      for (var i = 0; i < signatureBuffer.length; i++) {
        bb.writeByte(signatureBuffer[i])
      }
    }

    if (!skipSecondSignature && transaction.signSignature) {
      var signSignatureBuffer = new Buffer(transaction.signSignature, 'hex')
      for (var i = 0; i < signSignatureBuffer.length; i++) {
        bb.writeByte(signSignatureBuffer[i])
      }
    }

    bb.flip()
    var arrayBuffer = new Uint8Array(bb.toArrayBuffer())
    var buffer = []

    for (var i = 0; i < arrayBuffer.length; i++) {
      buffer[i] = arrayBuffer[i]
    }

    return new Buffer(buffer)
  }

  /**
   * @static
   * @param {string} hexString
   * @returns {Transaction}
   */
  fromBytes (hexString) {
    let tx = {}
    const buf = new Buffer(hexString, 'hex')
    tx.type = buf.readInt8(0) & 0xff
    tx.timestamp = buf.readUInt32LE(1)
    tx.senderPublicKey = hexString.substring(10, 10 + 33 * 2)
    tx.amount = buf.readUInt32LE(38 + 21 + 64)
    tx.fee = buf.readUInt32LE(38 + 21 + 64 + 8)
    tx.vendorFieldHex = hexString.substring(76 + 42, 76 + 42 + 128)
    tx.recipientId = bs58check.encode(buf.slice(38, 38 + 21))
    if (tx.type == 0) { // transfer
      parseSignatures(hexString, tx, 76 + 42 + 128 + 32)
    } else if (tx.type == 1) { // second signature registration
      delete tx.recipientId
      tx.asset = {
        signature: {
          publicKey: hexString.substring(76 + 42 + 128 + 32, 76 + 42 + 128 + 32 + 66)
        }
      }
      parseSignatures(hexString, tx, 76 + 42 + 128 + 32 + 66)
    } else if (tx.type == 2) { // delegate registration
      delete tx.recipientId
      // Impossible to assess size of delegate asset, trying to grab signature and derive delegate asset
      const offset = findAndParseSignatures(hexString, tx)

      tx.asset = {
        delegate: {
          username: new Buffer(hexString.substring(76 + 42 + 128 + 32, hexString.length - offset), 'hex').toString('utf8')
        }
      }
    } else if (tx.type == 3) { // vote
      // Impossible to assess size of vote asset, trying to grab signature and derive vote asset
      const offset = findAndParseSignatures(hexString, tx)
      tx.asset = {
        votes: new Buffer(hexString.substring(76 + 42 + 128 + 32, hexString.length - offset), 'hex').toString('utf8').split(',')
      }
    } else if (tx.type == 4) { // multisignature creation
      delete tx.recipientId
      const offset = findAndParseSignatures(hexString, tx)
      const buffer = new Buffer(hexString.substring(76 + 42 + 128 + 32, hexString.length - offset), 'hex')
      tx.asset = {
        multisignature: {}
      }
      tx.asset.multisignature.min = buffer.readInt8(0) & 0xff
      tx.asset.multisignature.lifetime = buffer.readInt8(1) & 0xff
      tx.asset.multisignature.keysgroup = []
      let index = 0
      while (index + 2 < buffer.length) {
        const key = buffer.slice(index + 2, index + 67 + 2).toString('utf8')
        tx.asset.multisignature.keysgroup.push(key)
        index = index + 67
      }
    } else if (tx.type == 5) { // ipfs
      delete tx.recipientId
      parseSignatures(hexString, tx, 76 + 42 + 128 + 32)
    }

    return tx
  }

  /**
   * @static
   * @param {string} hexString
   * @param {Transaction} tx
   * @returns {number}
   */
  findAndParseSignatures (hexString, tx) {
    let signature1 = new Buffer(hexString.substring(hexString.length - 146), 'hex')
    let signature2 = null
    let found = false
    let offset = 0

    while (!found && signature1.length > 8) {
      if (signature1[0] != 0x30) {
        signature1 = signature1.slice(1)
      } else {
        try {
          ECSignature.fromDER(signature1, 'hex')
          found = true
        } catch (error) {
          signature1 = signature1.slice(1)
        }
      }
    }
    if (!found) {
      offset = 0
      signature1 = null
    } else  {
      found = false
      offset = signature1.length * 2

      let signature2 = new Buffer(hexString.substring(hexString.length - offset - 146, hexString.length - offset), 'hex')
      while (!found && signature2.length > 8) {
        if (signature2[0] != 0x30) {
          signature2 = signature2.slice(1)
        } else {
          try {
            ECSignature.fromDER(signature2, 'hex')
            found = true
          } catch (error) {
            signature2 = signature2.slice(1)
          }
        }
      }

      if (!found) {
        signature2 = null
        tx.signature = signature1.toString('hex')
        offset = tx.signature.length
      } else if (signature2) {
        tx.signSignature = signature1.toString('hex')
        tx.signature = signature2.toString('hex')
        offset = tx.signature.length + tx.signSignature.length
      }
    }

    return offset
  }

  /**
   * @static
   * @param {string} hexString
   * @param {Transaction} tx
   * @param {number} startOffset
   */
  parseSignatures (hexString, tx, startOffset) {
    tx.signature = hexString.substring(startOffset)
    if (tx.signature.length == 0) delete tx.signature
    else {
      const length = parseInt('0x' + tx.signature.substring(2, 4), 16) + 2
      tx.signature = hexString.substring(startOffset, startOffset + length * 2)
      tx.signSignature = hexString.substring(startOffset + length * 2)

      if (tx.signSignature.length == 0) {
        delete tx.signSignature
      }
    }
  }

  /**
   * @static
   * @param {Transaction} transaction
   * @returns {string}
   */
  getId (transaction) {
    return crypto.createHash('sha256').update(getBytes(transaction)).digest().toString('hex')
  }

  /**
   * @static
   * @param {Transaction} transaction
   * @param {boolean} [skipSignature=false]
   * @param {boolean} [skipSecondSignature=false]
   * @returns {Buffer}
   */
  getHash (transaction, skipSignature, skipSecondSignature) {
    return crypto.createHash('sha256').update(getBytes(transaction, skipSignature, skipSecondSignature)).digest()
  }

  /**
   * @static
   * @param {Transaction} transaction
   * @returns {number}
   */
  // TODO: replace this with object literals
  getFee (transaction) {
    switch (transaction.type) {
      case 0: // Normal
        return 0.1 * fixedPoint
        break

      case 1: // Signature
        return 100 * fixedPoint
        break

      case 2: // Delegate
        return 10000 * fixedPoint
        break

      case 3: // Vote
        return 1 * fixedPoint
        break
    }
  }

  /**
   * @static
   * @param {Transaction} transaction
   * @param {ECPair} keys
   * @returns {ECSignature}
   */
  sign (transaction, keys) {
    const hash = getHash(transaction, true, true)
    const signature = keys.sign(hash).toDER().toString('hex')

    if (!transaction.signature) {
      transaction.signature = signature
    }

    return signature
  }

  /**
   * @static
   * @param {Transaction} transaction
   * @param {ECPair} keys
   */
  secondSign (transaction, keys) {
    const hash = getHash(transaction, false, true)
    const signature = keys.sign(hash).toDER().toString('hex')

    if (!transaction.signSignature) {
      transaction.signSignature = signature
    }

    return signature
  }

  /**
   * @static
   * @param {Transaction} transaction
   * @param {Network} [network=networks.ark]
   */
  verify (transaction, network) {
    const hash = getHash(transaction, true, true)

    const signatureBuffer = new Buffer(transaction.signature, 'hex')
    const senderPublicKeyBuffer = new Buffer(transaction.senderPublicKey, 'hex')
    const ecpair = ECPair.fromPublicKeyBuffer(senderPublicKeyBuffer, network || this.config.network)
    const ecsignature = ECSignature.fromDER(signatureBuffer)

    return ecpair.verify(hash, ecsignature)
  }

  /**
   * @static
   * @param {Transaction} transaction
   * @param {string} publicKey
   * @param {Network} [network]
   */
  verifySecondSignature (transaction, publicKey, network) {
    const hash = getHash(transaction, false, true)

    const signSignatureBuffer = new Buffer(transaction.signSignature, 'hex')
    const publicKeyBuffer = new Buffer(publicKey, 'hex')
    const ecpair = ECPair.fromPublicKeyBuffer(publicKeyBuffer, network || this.config.network)
    const ecsignature = ECSignature.fromDER(signSignatureBuffer)

    return ecpair.verify(hash, ecsignature)
  }

  /**
   * @static
   * @param {string} secret
   * @param {Network} [network]
   * @returns {ECPair}
   */
  getKeys (secret, network) {
    let ecpair = ECPair.fromSeed(secret, network || this.config.network)

    ecpair.publicKey = ecpair.getPublicKeyBuffer().toString('hex')
    ecpair.privateKey = ''

    return ecpair
  }

  /**
   * @static
   * @param {string} publicKey
   * @param {number} [version]
   * @returns {string}
   */
  getAddress (publicKey, version) {
    if (!version) {
      version = networkVersion
    }

    const buffer = crypto_utils.ripemd160(new Buffer(publicKey, 'hex'))

    const payload = new Buffer(21)
    payload.writeUInt8(version, 0)
    buffer.copy(payload, 1)

    return bs58check.encode(payload)
  }

  /**
   * @static
   * @param {string} address
   * @param {number} [version]
   * @returns {boolean}
   */
  validateAddress (address, version) {
    if (!version) {
      version = networkVersion
    }
    try {
      const decode = bs58check.decode(address)

      return decode[0] == version
    } catch (e) {
      return false
    }
  }
}
