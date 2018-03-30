import assert from 'assert'
import ecurve from 'ecurve'
import proxyquire from 'proxyquire'
import sinon from 'sinon'
import sinonTestFactory from 'sinon-test'
import BigInteger from 'bigi'

import ECPair from '@/crypto/ecpair'
import ecdsa from '@/crypto/ecdsa'
import configManager from '@/managers/config'

import fixtures from './fixtures/ecpair.json'
import { NETWORKS, NETWORKS_LIST } from '../utils/network-list'

const curve = ecdsa.__curve
const sinonTest = sinonTestFactory(sinon)

beforeEach(() => configManager.setConfig(NETWORKS.mainnet))

describe('ECPair', () => {
  describe('constructor', () => {
    it('defaults to compressed', () => {
      var keyPair = new ECPair(BigInteger.ONE)

      assert.strictEqual(keyPair.compressed, true)
    })

    it('supports the uncompressed option', () => {
      var keyPair = new ECPair(BigInteger.ONE, null, {
        compressed: false
      })

      assert.strictEqual(keyPair.compressed, false)
    })

    it('supports the network option', () => {
      var keyPair = new ECPair(BigInteger.ONE, null, {
        compressed: false,
        network: NETWORKS.devnet
      })

      assert.strictEqual(keyPair.network, NETWORKS.devnet)
    })

    fixtures.valid.forEach((f) => {
      it('calculates the public point for ' + f.WIF, () => {
        var d = new BigInteger(f.d)
        var keyPair = new ECPair(d, null, {
          compressed: f.compressed
        })

        assert.strictEqual(keyPair.getPublicKeyBuffer().toString('hex'), f.Q)
      })
    })

    fixtures.invalid.constructor.forEach((f) => {
      it('throws ' + f.exception, () => {
        var d = f.d && new BigInteger(f.d)
        var Q = f.Q && ecurve.Point.decodeFrom(curve, new Buffer(f.Q, 'hex'))

        assert.throws(() => {
          new ECPair(d, Q, f.options)
        }, new RegExp(f.exception))
      })
    })
  })

  describe('getPublicKeyBuffer', () => {
    var keyPair

    beforeEach(() => {
      keyPair = new ECPair(BigInteger.ONE)
    })

    it('wraps Q.getEncoded', sinonTest(() => {
      this.mock(keyPair.publicKey).expects('getEncoded')
        .once().withArgs(keyPair.compressed)

      keyPair.getPublicKeyBuffer()
    }))
  })

  describe('fromWIF', () => {
    fixtures.valid.forEach((f) => {
      it('imports ' + f.WIF + ' (' + f.network + ')', () => {
        var network = NETWORKS[f.network]
        var keyPair = ECPair.fromWIF(f.WIF, network)

        assert.strictEqual(keyPair.privateKey.toString(), f.d)
        assert.strictEqual(keyPair.getPublicKeyBuffer().toString('hex'), f.Q)
        assert.strictEqual(keyPair.compressed, f.compressed)
        assert.strictEqual(keyPair.network, network)
      })
    })

    fixtures.valid.forEach((f) => {
      it('imports ' + f.WIF + ' (via list of networks)', () => {
        var keyPair = ECPair.fromWIF(f.WIF, NETWORKS_LIST)

        assert.strictEqual(keyPair.privateKey.toString(), f.d)
        assert.strictEqual(keyPair.getPublicKeyBuffer().toString('hex'), f.Q)
        assert.strictEqual(keyPair.compressed, f.compressed)
        assert.strictEqual(keyPair.network, NETWORKS[f.network])
      })
    })

    fixtures.invalid.fromWIF.forEach((f) => {
      it('throws on ' + f.WIF, () => {
        assert.throws(() => {
          var networks = f.network ? NETWORKS[f.network] : NETWORKS_LIST

          ECPair.fromWIF(f.WIF, networks)
        }, new RegExp(f.exception))
      })
    })
  })

  describe('toWIF', () => {
    fixtures.valid.forEach((f) => {
      it('exports ' + f.WIF, () => {
        var keyPair = ECPair.fromWIF(f.WIF, NETWORKS_LIST)
        var result = keyPair.toWIF()

        assert.strictEqual(result, f.WIF)
      })
    })
  })

  describe('makeRandom', () => {
    var d = new Buffer('0404040404040404040404040404040404040404040404040404040404040404', 'hex')
    var exWIF = 'S9hzwiZ5ziKjUiFpuZX4Lri3rUocDxZSTy7YzKKHvx8TSjUrYQ27'

    it('uses randombytes RNG to generate a ECPair', () => {
      var stub = {
        randombytes: () => {
          return d
        }
      }
      var ProxiedECPair = proxyquire('../../src/crypto/ecpair', stub).default

      var keyPair = ProxiedECPair.makeRandom()
      assert.strictEqual(keyPair.toWIF(), exWIF)
    })

    it('allows a custom RNG to be used', () => {
      var keyPair = ECPair.makeRandom({
        rng: function (size) {
          return d.slice(0, size)
        }
      })

      assert.strictEqual(keyPair.toWIF(), exWIF)
    })

    it('retains the same defaults as ECPair constructor', () => {
      var keyPair = ECPair.makeRandom()

      assert.strictEqual(keyPair.compressed, true)
      expect(keyPair.network).toEqual(NETWORKS.mainnet)
    })

    it('supports the options parameter', () => {
      var keyPair = ECPair.makeRandom({
        compressed: false,
        network: NETWORKS.devnet
      })

      assert.strictEqual(keyPair.compressed, false)
      expect(keyPair.network).toEqual(NETWORKS.devnet)
    })

    it('loops until d is within interval [1, n - 1] : 1', sinonTest(() => {
      var rng = this.mock()
      rng.exactly(2)
      rng.onCall(0).returns(BigInteger.ZERO.toBuffer(32)) // invalid length
      rng.onCall(1).returns(BigInteger.ONE.toBuffer(32)) // === 1

      ECPair.makeRandom({
        rng: rng
      })
    }))

    it('loops until d is within interval [1, n - 1] : n - 1', sinonTest(() => {
      var rng = this.mock()
      rng.exactly(3)
      rng.onCall(0).returns(BigInteger.ZERO.toBuffer(32)) // < 1
      rng.onCall(1).returns(curve.n.toBuffer(32)) // > n-1
      rng.onCall(2).returns(curve.n.subtract(BigInteger.ONE).toBuffer(32)) // === n-1

      ECPair.makeRandom({
        rng: rng
      })
    }))
  })

  describe('getAddress', () => {
    fixtures.valid.forEach((f) => {
      it('returns ' + f.address + ' for ' + f.WIF, () => {
        var keyPair = ECPair.fromWIF(f.WIF, NETWORKS_LIST)

        assert.strictEqual(keyPair.getAddress(), f.address)
      })
    })
  })

  describe('getNetwork', () => {
    fixtures.valid.forEach((f) => {
      it('returns ' + f.network + ' for ' + f.WIF, () => {
        var network = NETWORKS[f.network]
        var keyPair = ECPair.fromWIF(f.WIF, NETWORKS_LIST)

        assert.strictEqual(keyPair.getNetwork(), network)
      })
    })
  })

  describe('ecdsa wrappers', () => {
    var keyPair, hash

    beforeEach(() => {
      keyPair = ECPair.makeRandom()
      hash = new Buffer(32)
    })

    describe('signing', () => {
      //  it('wraps ecdsa.sign', sinonTest(function () {
      //    this.mock(ecdsa).expects('sign')
      //      .once().withArgs(hash, keyPair.publicKey)
      //
      //    keyPair.sign(hash)
      //  }))

      it('throws if no private key is found', () => {
        keyPair.publicKey = null

        assert.throws(() => {
          keyPair.sign(hash)
        }, /Missing private key/)
      })
    })

    describe('verify', () => {
      var signature

      beforeEach(() => {
        signature = keyPair.sign(hash)
      })

      // it('wraps ecdsa.verify', sinonTest(function () {
      //   this.mock(ecdsa).expects('verify')
      //     .once().withArgs(hash, signature, keyPair.Q)
      //
      //   keyPair.verify(hash, signature)
      // }))
    })
  })
})
