// TODO: turn this into an es6 class (currently prototype)

const base58check = require('bs58check')
const bcrypto = require('./crypto')
const ecdsa = require('./ecdsa')
const ECSignature = require('./ecsignature')
const randomBytes = require('randombytes')
const typeforce = require('typeforce')
const types = require('./types')
const wif = require('wif')

const NETWORKS = require('./networks')
const BigInteger = require('bigi')

const ecurve = require('ecurve')
const secp256k1 = ecurve.getCurveByName('secp256k1')

const secp256k1native = require('secp256k1')

// Object.defineProperty(ECPair.prototype, 'Q', {
//   get: function () {
//     if (!this.__Q && this.d) {
//       this.__Q = secp256k1.G.multiply(this.d)
//     }

//     return this.__Q
//   }
// })

/**
 * Provide either `d` or `Q` but not both.
 *
 * @constructor
 * @param {BigInteger} [d] Private key.
 * @param {Point} [Q] Public key.
 * @param {object} [options]
 * @param {boolean} [options.compressed=true]
 * @param {Network} [options.network=networks.ark]
 */
module.exports = class ECPair {
  constructor(privateKey, publicKey, options) {
    if (options) {
      typeforce({
        compressed: types.maybe(types.Boolean),
        network: types.maybe(types.Network)
      }, options)
    }

    options = options || {}

    if (privateKey) {
      if (privateKey.signum() <= 0) throw new Error('Private key must be greater than 0')
      if (privateKey.compareTo(secp256k1.n) >= 0) throw new Error('Private key must be less than the curve order')
      if (publicKey) throw new TypeError('Unexpected publicKey parameter')

      this.d = privateKey
    } else {
      typeforce(types.ECPoint, publicKey)

      this.__Q = publicKey
    }

    /** @type {boolean} */
    this.compressed = options.compressed === undefined ? true : options.compressed
    /** @type {Network} */
    this.network = options.network || NETWORKS.ark
  }

  /**
   * @param {Buffer} buffer
   * @param {Network} [network=networks.ark]
   * @returns {ECPair}
   */
  fromPublicKeyBuffer(buffer, network) {
    var Q = ecurve.Point.decodeFrom(secp256k1, buffer)

    return new ECPair(null, Q, {
      compressed: Q.compressed,
      network: network
    })
  }

  /**
   * @param {string} string
   * @param {Network[]|Network} network
   * @returns {ECPair}
   */
  fromWIF(string, network) {
    var decoded = wif.decode(string)
    var version = decoded.version

    // [network, ...]
    if (types.Array(network)) {
      network = network.filter(function(network) {
        return version === network.wif
      }).pop()

      if (!network) throw new Error('Unknown network version')

      // network
    } else {
      network = network || NETWORKS.ark

      if (version !== network.wif) throw new Error('Invalid network version')
    }

    var d = BigInteger.fromBuffer(decoded.privateKey)

    return new ECPair(d, null, {
      compressed: decoded.compressed,
      network: network
    })
  }

  /**
   * @param {object} [options]
   * @param {function} [options.rng]
   * @param {boolean} [options.compressed=true]
   * @param {Network} [options.network=networks.ark]
   */
  makeRandom(options) {
    options = options || {}

    var rng = options.rng || randomBytes

    var d
    do {
      var buffer = rng(32)
      typeforce(types.Buffer256bit, buffer)

      d = BigInteger.fromBuffer(buffer)
    } while (d.signum() <= 0 || d.compareTo(secp256k1.n) >= 0)

    return new ECPair(d, null, options)
  }

  /**
   * @param {string} seed
   * @param {object} [options]
   * @param {boolean} [options.compressed=true]
   * @param {Network} [options.network=networks.ark]
   * @returns {ECPair}
   */
  fromSeed(seed, options) {
    var hash = bcrypto.sha256(new Buffer(seed, 'utf-8'))
    var d = BigInteger.fromBuffer(hash)
    if (d.signum() <= 0 || d.compareTo(secp256k1.n) >= 0) {
      throw new Error('seed cannot resolve to a compatible private key')
    } else {
      return new ECPair(d, null, options)
    }
  }

  /**
   * @returns {string}
   */
  getAddress() {
    var payload = new Buffer(21)
    var hash = bcrypto.ripemd160(this.getPublicKeyBuffer())
    var version = this.getNetwork().pubKeyHash
    payload.writeUInt8(version, 0)
    hash.copy(payload, 1)

    return base58check.encode(payload)
  }

  /**
   * @returns {Network}
   */
  getNetwork() {
    return this.network
  }

  getPublicKeyBuffer() {
    return this.Q.getEncoded(this.compressed)
  }

  /**
   * Requires a private key (`d`) to be set.
   *
   * @param {Buffer} hash
   * @returns {ECSignature}
   */
  sign(hash) {
    if (!this.d) throw new Error('Missing private key')
    var native = secp256k1native.sign(hash, this.d.toBuffer(32))
    return ECSignature.parseNativeSecp256k1(native).signature
  }

  /**
   * Requires a private key (`d`) to be set.
   *
   * @returns {string}
   */
  toWIF() {
    if (!this.d) throw new Error('Missing private key')

    return wif.encode(this.network.wif, this.d.toBuffer(32), this.compressed)
  }

  /**
   * @param {Buffer} hash
   * @returns {boolean}
   */
  verify(hash, signature) {
    return secp256k1native.verify(hash, signature.toNativeSecp256k1(), this.Q.getEncoded(this.compressed))
  }
}
