import Config from '@/config'
import crypto from 'crypto'
import cryptoUtils from '@/crypto/crypto'
import ECPair from '@/crypto/ecpair'
import ECSignature from '@/crypto/ecsignature'
import bs58check from 'bs58check'
import ByteBuffer from 'bytebuffer'
import {
  ARKTOSHI,
  TRANSACTION_TYPES
} from '@/constants'

if (typeof Buffer === 'undefined') Buffer = require('buffer/').Buffer // eslint-disable-line no-global-assign

export default class Crypto {
  isECPair (obj) {
    return obj instanceof ECPair
  }

  getSignatureBytes (signature) {
    const bb = new ByteBuffer(33, true)
    const publicKeyBuffer = Buffer.from(signature.publicKey, 'hex')

    for (let i = 0; i < publicKeyBuffer.length; i++) {
      bb.writeByte(publicKeyBuffer[i])
    }

    bb.flip()
    return new Uint8Array(bb.toArrayBuffer())
  }

  getBytes (transaction, skipSignature, skipSecondSignature) {
    let assetSize = 0
    let assetBytes = null

    const actions = {
      [TRANSACTION_TYPES.SECOND_SIGNATURE]: () => {
        assetBytes = this.getSignatureBytes(transaction.asset.signature)
        assetSize = assetBytes.length
      },
      [TRANSACTION_TYPES.DELEGATE]: () => {
        assetBytes = Buffer.from(transaction.asset.delegate.username, 'utf8')
        assetSize = assetBytes.length
      },
      [TRANSACTION_TYPES.VOTE]: () => {
        if (transaction.asset.votes !== null) {
          assetBytes = Buffer.from(transaction.asset.votes.join(''), 'utf8')
          assetSize = assetBytes.length
        }
      },
      [TRANSACTION_TYPES.MULTI_SIGNATURE]: () => {
        const keysgroupBuffer = Buffer.from(transaction.asset.multisignature.keysgroup.join(''), 'utf8')
        const bb = new ByteBuffer(1 + 1 + keysgroupBuffer.length, true)

        bb.writeByte(transaction.asset.multisignature.min)
        bb.writeByte(transaction.asset.multisignature.lifetime)

        for (let i = 0; i < keysgroupBuffer.length; i++) {
          bb.writeByte(keysgroupBuffer[i])
        }

        bb.flip()

        assetBytes = bb.toBuffer()
        assetSize = assetBytes.length
      }
    }

    actions[transaction.type]()

    const bb = new ByteBuffer(1 + 4 + 32 + 8 + 8 + 21 + 64 + 64 + 64 + assetSize, true)
    bb.writeByte(transaction.type)
    bb.writeInt(transaction.timestamp)

    const senderPublicKeyBuffer = Buffer.from(transaction.senderPublicKey, 'hex')
    for (let i = 0; i < senderPublicKeyBuffer.length; i++) {
      bb.writeByte(senderPublicKeyBuffer[i])
    }

    if (transaction.recipientId) {
      const recipient = bs58check.decode(transaction.recipientId)
      for (let i = 0; i < recipient.length; i++) {
        bb.writeByte(recipient[i])
      }
    } else {
      for (let i = 0; i < 21; i++) {
        bb.writeByte(0)
      }
    }

    if (transaction.vendorFieldHex) {
      const vf = Buffer.from(transaction.vendorFieldHex, 'hex')
      const fillstart = vf.length
      for (let i = 0; i < fillstart; i++) {
        bb.writeByte(vf[i])
      }
      for (let i = fillstart; i < 64; i++) {
        bb.writeByte(0)
      }
    } else if (transaction.vendorField) {
      const vf = Buffer.from(transaction.vendorField)
      const fillstart = vf.length
      for (let i = 0; i < fillstart; i++) {
        bb.writeByte(vf[i])
      }
      for (let i = fillstart; i < 64; i++) {
        bb.writeByte(0)
      }
    } else {
      for (let i = 0; i < 64; i++) {
        bb.writeByte(0)
      }
    }

    bb.writeLong(transaction.amount)

    bb.writeLong(transaction.fee)

    if (assetSize > 0) {
      for (let i = 0; i < assetSize; i++) {
        bb.writeByte(assetBytes[i])
      }
    }

    if (!skipSignature && transaction.signature) {
      var signatureBuffer = Buffer.from(transaction.signature, 'hex')
      for (let i = 0; i < signatureBuffer.length; i++) {
        bb.writeByte(signatureBuffer[i])
      }
    }

    if (!skipSecondSignature && transaction.signSignature) {
      var signSignatureBuffer = Buffer.from(transaction.signSignature, 'hex')
      for (let i = 0; i < signSignatureBuffer.length; i++) {
        bb.writeByte(signSignatureBuffer[i])
      }
    }

    bb.flip()
    var arrayBuffer = new Uint8Array(bb.toArrayBuffer())
    var buffer = []

    for (let i = 0; i < arrayBuffer.length; i++) {
      buffer[i] = arrayBuffer[i]
    }

    return Buffer.from(buffer)
  }

  fromBytes (hexString) {
    let tx = {}
    const buf = Buffer.from(hexString, 'hex')
    tx.type = buf.readInt8(0) & 0xff
    tx.timestamp = buf.readUInt32LE(1)
    tx.senderPublicKey = hexString.substring(10, 10 + 33 * 2)
    tx.amount = buf.readUInt32LE(38 + 21 + 64)
    tx.fee = buf.readUInt32LE(38 + 21 + 64 + 8)
    tx.vendorFieldHex = hexString.substring(76 + 42, 76 + 42 + 128)
    tx.recipientId = bs58check.encode(buf.slice(38, 38 + 21))
    if (tx.type === 0) { // transfer
      this.parseSignatures(hexString, tx, 76 + 42 + 128 + 32)
    } else if (tx.type === 1) { // second signature registration
      delete tx.recipientId
      tx.asset = {
        signature: {
          publicKey: hexString.substring(76 + 42 + 128 + 32, 76 + 42 + 128 + 32 + 66)
        }
      }
      this.parseSignatures(hexString, tx, 76 + 42 + 128 + 32 + 66)
    } else if (tx.type === 2) { // delegate registration
      delete tx.recipientId
      // Impossible to assess size of delegate asset, trying to grab signature and derive delegate asset
      const offset = this.findAndParseSignatures(hexString, tx)

      tx.asset = {
        delegate: {
          username: Buffer.from(hexString.substring(76 + 42 + 128 + 32, hexString.length - offset), 'hex').toString('utf8')
        }
      }
    } else if (tx.type === 3) { // vote
      // Impossible to assess size of vote asset, trying to grab signature and derive vote asset
      const offset = this.findAndParseSignatures(hexString, tx)
      tx.asset = {
        votes: Buffer.from(hexString.substring(76 + 42 + 128 + 32, hexString.length - offset), 'hex').toString('utf8').split(',')
      }
    } else if (tx.type === 4) { // multisignature creation
      delete tx.recipientId
      const offset = this.findAndParseSignatures(hexString, tx)
      const buffer = Buffer.from(hexString.substring(76 + 42 + 128 + 32, hexString.length - offset), 'hex')
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
    } else if (tx.type === 5) { // ipfs
      delete tx.recipientId
      this.parseSignatures(hexString, tx, 76 + 42 + 128 + 32)
    }

    return tx
  }

  findAndParseSignatures (hexString, tx) {
    let signature1 = Buffer.from(hexString.substring(hexString.length - 146), 'hex')
    let signature2 = null // eslint-disable-line no-unused-vars
    let found = false
    let offset = 0

    while (!found && signature1.length > 8) {
      if (signature1[0] !== 0x30) {
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
    } else {
      found = false
      offset = signature1.length * 2

      let signature2 = Buffer.from(hexString.substring(hexString.length - offset - 146, hexString.length - offset), 'hex')
      while (!found && signature2.length > 8) {
        if (signature2[0] !== 0x30) {
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

  parseSignatures (hexString, tx, startOffset) {
    tx.signature = hexString.substring(startOffset)
    if (tx.signature.length === 0) delete tx.signature
    else {
      const length = parseInt('0x' + tx.signature.substring(2, 4), 16) + 2
      tx.signature = hexString.substring(startOffset, startOffset + length * 2)
      tx.signSignature = hexString.substring(startOffset + length * 2)

      if (tx.signSignature.length === 0) {
        delete tx.signSignature
      }
    }
  }

  getId (transaction) {
    return crypto.createHash('sha256').update(this.getBytes(transaction)).digest().toString('hex')
  }

  getHash (transaction, skipSignature, skipSecondSignature) {
    return crypto.createHash('sha256').update(this.getBytes(transaction, skipSignature, skipSecondSignature)).digest()
  }

  getFee (transaction) {
    return {
      [TRANSACTION_TYPES.TRANSFER]: () => 0.1 * ARKTOSHI,
      [TRANSACTION_TYPES.SECOND_SIGNATURE]: () => 100 * ARKTOSHI,
      [TRANSACTION_TYPES.DELEGATE]: () => 10000 * ARKTOSHI,
      [TRANSACTION_TYPES.VOTE]: () => 1 * ARKTOSHI,
      [TRANSACTION_TYPES.MULTI_SIGNATURE]: () => 0,
      [TRANSACTION_TYPES.IPFS]: () => 0,
      [TRANSACTION_TYPES.TIMELOCK_TRANSFER]: () => 0,
      [TRANSACTION_TYPES.MULTI_PAYMENT]: () => 0,
      [TRANSACTION_TYPES.DELEGATE_RESIGNATION]: () => 0
    }[transaction.type]
  }

  sign (transaction, keys) {
    const hash = this.getHash(transaction, true, true)
    const signature = keys.sign(hash).toDER().toString('hex')

    if (!transaction.signature) {
      transaction.signature = signature
    }

    return signature
  }

  secondSign (transaction, keys) {
    const hash = this.getHash(transaction, false, true)
    const signature = keys.sign(hash).toDER().toString('hex')

    if (!transaction.signSignature) {
      transaction.signSignature = signature
    }

    return signature
  }

  verify (transaction, network) {
    const hash = this.getHash(transaction, true, true)

    const signatureBuffer = Buffer.from(transaction.signature, 'hex')
    const senderPublicKeyBuffer = Buffer.from(transaction.senderPublicKey, 'hex')
    const ecpair = ECPair.fromPublicKeyBuffer(senderPublicKeyBuffer, network || Config.get('network'))
    const ecsignature = ECSignature.fromDER(signatureBuffer)

    return ecpair.verify(hash, ecsignature)
  }

  verifySecondSignature (transaction, publicKey, network) {
    const hash = this.getHash(transaction, false, true)

    const signSignatureBuffer = Buffer.from(transaction.signSignature, 'hex')
    const publicKeyBuffer = Buffer.from(publicKey, 'hex')
    const ecpair = ECPair.fromPublicKeyBuffer(publicKeyBuffer, network || Config.get('network'))
    const ecsignature = ECSignature.fromDER(signSignatureBuffer)

    return ecpair.verify(hash, ecsignature)
  }

  getKeys (secret, network) {
    let ecpair = ECPair.fromSeed(secret, network || Config.get('network'))

    ecpair.publicKey = ecpair.getPublicKeyBuffer().toString('hex')
    ecpair.privateKey = ''

    return ecpair
  }

  getAddress (publicKey, version) {
    if (!version) version = Config.get('pubKeyHash')

    const buffer = cryptoUtils.ripemd160(Buffer.alloc(publicKey, 'hex'))

    const payload = Buffer.alloc(21)
    payload.writeUInt8(version, 0)
    buffer.copy(payload, 1)

    return bs58check.encode(payload)
  }

  validateAddress (address, version) {
    if (!version) version = Config.get('pubKeyHash')

    try {
      const decode = bs58check.decode(address)

      return decode[0] === version
    } catch (e) {
      return false
    }
  }
}
