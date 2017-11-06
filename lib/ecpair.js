const base58check = require('bs58check')
const bcrypto = require('./crypto')
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

class ECPair {
  /**
   * @param {boolean} d Private key parameter
   * @param {any} Q Public key parameter
   * @param {{compressed: boolean, network: Object}=} options
   */
  constructor (d, Q, options) {
    if (options) {
      typeforce({
        compressed: types.maybe(types.Boolean),
        network: types.maybe(types.Network)
      }, options)
    }

    options = options || {}

    if (d) {
      if (d.signum() <= 0) throw new Error('Private key must be greater than 0')
      if (d.compareTo(secp256k1.n) >= 0) throw new Error('Private key must be less than the curve order')
      if (Q) throw new TypeError('Unexpected publicKey parameter')

      this.d = d
    } else {
      typeforce(types.ECPoint, Q)

      this.__Q = Q
    }

    this.compressed = options.compressed === undefined ? true : options.compressed
    this.network = options.network || NETWORKS.ark
  }

  get Q () {
    if (!this.__Q && this.d) {
      this.__Q = secp256k1.G.multiply(this.d)
    }

    return this.__Q
  }

  /**
   * @param {Buffer} buffer
   * @param {Object} network
   * @returns {ECPair}
   */
  static fromPublicKeyBuffer (buffer, network) {
    const Q = ecurve.Point.decodeFrom(secp256k1, buffer)

    return new ECPair(null, Q, {
      compressed: Q.compressed,
      network
    })
  }

  /**
   * @param {string} string
   * @param {any} network
   * @returns {ECPair}
   */
  static fromWIF (string, network) {
    const decoded = wif.decode(string)
    const version = decoded.version

    // [network, ...]
    if (types.Array(network)) {
      network = network.filter(function (network) {
        return version === network.wif
      }).pop()

      if (!network) throw new Error('Unknown network version')

    // network
    } else {
      network = network || NETWORKS.ark

      if (version !== network.wif) throw new Error('Invalid network version')
    }

    const d = BigInteger.fromBuffer(decoded.privateKey)

    return new ECPair(d, null, {
      compressed: decoded.compressed,
      network
    })
  }

  /**
   * @param {Object=} options
   * @returns {ECPair}
   */
  static makeRandom (options) {
    options = options || {}
    const rng = options.rng || randomBytes

    let d
    do {
      const buffer = rng(32)
      typeforce(types.Buffer256bit, buffer)

      d = BigInteger.fromBuffer(buffer)
    } while (d.signum() <= 0 || d.compareTo(secp256k1.n) >= 0)

    return new ECPair(d, null, options)
  }

  /**
   * @param {string} seed
   * @param {Object=} options
   * @returns {ECPair}
   * @throws {Error}
   */
  static fromSeed (seed, options) {
    const hash = bcrypto.sha256(new Buffer(seed,"utf-8"))
    const d = BigInteger.fromBuffer(hash)
    if(d.signum() <= 0 || d.compareTo(secp256k1.n) >= 0){
      throw new Error("seed cannot resolve to a compatible private key")
    }
    else{
      return new ECPair(d, null, options)
    }
  }

  /**
   * @returns {string}
   */
  getAddress () {
    const payload = new Buffer(21)
    const hash = bcrypto.ripemd160(this.getPublicKeyBuffer())
    const version = this.getNetwork().pubKeyHash
    payload.writeUInt8(version, 0)
    hash.copy(payload, 1)

    return base58check.encode(payload)
  }

  getNetwork () {
    return this.network
  }

  /**
   * @returns {Buffer}
   */
  getPublicKeyBuffer () {
    return this.Q.getEncoded(this.compressed)
  }

  /**
   * @param {Buffer} hash
   * @returns {ECSignature}
   */
  sign (hash) {
    if (!this.d) throw new Error('Missing private key')
    const native=secp256k1native.sign(hash, this.d.toBuffer(32))
    return ECSignature.parseNativeSecp256k1(native).signature
  }

  /**
   * @returns {string}
   */
  toWIF () {
    if (!this.d) throw new Error('Missing private key')

    return wif.encode(this.network.wif, this.d.toBuffer(32), this.compressed)
  }

  /**
   * @param {Buffer} hash
   * @param {ECSignature} signature
   */
  verify (hash, signature) {
    return secp256k1native.verify(hash, signature.toNativeSecp256k1(), this.Q.getEncoded(this.compressed))
  }
}

module.exports = ECPair
