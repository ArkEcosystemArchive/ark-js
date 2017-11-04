const assert = require('assert')
const ecdsa = require('../../lib/ecdsa')
const ecurve = require('ecurve')
const proxyquire = require('proxyquire')
const sinon = require('sinon')

const BigInteger = require('bigi')
const ECPair = require('../../lib/ecpair')

const fixtures = require('./fixtures.json')
const curve = ecdsa.__curve

const NETWORKS = require('../../lib/networks')
const NETWORKS_LIST = [] // Object.values(NETWORKS)
for (const networkName in NETWORKS) {
  NETWORKS_LIST.push(NETWORKS[networkName])
}

describe('ECPair', function () {
  describe('constructor', function () {
    it('defaults to compressed', function () {
      const keyPair = new ECPair(BigInteger.ONE)

      assert.strictEqual(keyPair.compressed, true)
    })

    it('supports the uncompressed option', function () {
      const keyPair = new ECPair(BigInteger.ONE, null, {
        compressed: false
      })

      assert.strictEqual(keyPair.compressed, false)
    })

    it('supports the network option', function () {
      const keyPair = new ECPair(BigInteger.ONE, null, {
        compressed: false,
        network: NETWORKS.testnet
      })

      assert.strictEqual(keyPair.network, NETWORKS.testnet)
    })

    fixtures.valid.forEach(function (f) {
      it('calculates the public point for ' + f.WIF, function () {
        const d = new BigInteger(f.d)
        const keyPair = new ECPair(d, null, {
          compressed: f.compressed
        })

        assert.strictEqual(keyPair.getPublicKeyBuffer().toString('hex'), f.Q)
      })
    })

    fixtures.invalid.constructor.forEach(function (f) {
      it('throws ' + f.exception, function () {
        const d = f.d && new BigInteger(f.d)
        const Q = f.Q && ecurve.Point.decodeFrom(curve, new Buffer(f.Q, 'hex'))

        assert.throws(function () {
          new ECPair(d, Q, f.options)
        }, new RegExp(f.exception))
      })
    })
  })

  describe('getPublicKeyBuffer', function () {
    let keyPair

    beforeEach(function () {
      keyPair = new ECPair(BigInteger.ONE)
    })

    it('wraps Q.getEncoded', sinon.test(function () {
      this.mock(keyPair.Q).expects('getEncoded')
        .once().withArgs(keyPair.compressed)

      keyPair.getPublicKeyBuffer()
    }))
  })

  describe('fromWIF', function () {
    fixtures.valid.forEach(function (f) {
      it('imports ' + f.WIF + ' (' + f.network + ')', function () {
        const network = NETWORKS[f.network]
        const keyPair = ECPair.fromWIF(f.WIF, network)

        assert.strictEqual(keyPair.d.toString(), f.d)
        assert.strictEqual(keyPair.getPublicKeyBuffer().toString("hex"), f.Q)
        assert.strictEqual(keyPair.compressed, f.compressed)
        assert.strictEqual(keyPair.network, network)
      })
    })

    fixtures.valid.forEach(function (f) {
      it('imports ' + f.WIF + ' (via list of networks)', function () {
        const keyPair = ECPair.fromWIF(f.WIF, NETWORKS_LIST)

        assert.strictEqual(keyPair.d.toString(), f.d)
        assert.strictEqual(keyPair.getPublicKeyBuffer().toString("hex"), f.Q)
        assert.strictEqual(keyPair.compressed, f.compressed)
        assert.strictEqual(keyPair.network, NETWORKS[f.network])
      })
    })

    fixtures.invalid.fromWIF.forEach(function (f) {
      it('throws on ' + f.WIF, function () {
        assert.throws(function () {
          const networks = f.network ? NETWORKS[f.network] : NETWORKS_LIST

          ECPair.fromWIF(f.WIF, networks)
        }, new RegExp(f.exception))
      })
    })
  })

  describe('toWIF', function () {
    fixtures.valid.forEach(function (f) {
      it('exports ' + f.WIF, function () {
        const keyPair = ECPair.fromWIF(f.WIF, NETWORKS_LIST)
        const result = keyPair.toWIF()

        assert.strictEqual(result, f.WIF)
      })
    })
  })

  describe('makeRandom', function () {
    const d = new Buffer('0404040404040404040404040404040404040404040404040404040404040404', 'hex')
    const exWIF = 'S9hzwiZ5ziKjUiFpuZX4Lri3rUocDxZSTy7YzKKHvx8TSjUrYQ27'

    describe('uses randombytes RNG', function () {
      it('generates a ECPair', function () {
        const stub = { randombytes: function () { return d } }
        const ProxiedECPair = proxyquire('../../lib/ecpair', stub)

        const keyPair = ProxiedECPair.makeRandom()
        assert.strictEqual(keyPair.toWIF(), exWIF)
      })
    })

    it('allows a custom RNG to be used', function () {
      const keyPair = ECPair.makeRandom({
        rng: function (size) { return d.slice(0, size) }
      })

      assert.strictEqual(keyPair.toWIF(), exWIF)
    })

    it('retains the same defaults as ECPair constructor', function () {
      const keyPair = ECPair.makeRandom()

      assert.strictEqual(keyPair.compressed, true)
      assert.strictEqual(keyPair.network, NETWORKS.ark)
    })

    it('supports the options parameter', function () {
      const keyPair = ECPair.makeRandom({
        compressed: false,
        network: NETWORKS.testnet
      })

      assert.strictEqual(keyPair.compressed, false)
      assert.strictEqual(keyPair.network, NETWORKS.testnet)
    })

    it('loops until d is within interval [1, n - 1] : 1', sinon.test(function () {
      const rng = this.mock()
      rng.exactly(2)
      rng.onCall(0).returns(BigInteger.ZERO.toBuffer(32)) // invalid length
      rng.onCall(1).returns(BigInteger.ONE.toBuffer(32)) // === 1

      ECPair.makeRandom({ rng: rng })
    }))

    it('loops until d is within interval [1, n - 1] : n - 1', sinon.test(function () {
      const rng = this.mock()
      rng.exactly(3)
      rng.onCall(0).returns(BigInteger.ZERO.toBuffer(32)) // < 1
      rng.onCall(1).returns(curve.n.toBuffer(32)) // > n-1
      rng.onCall(2).returns(curve.n.subtract(BigInteger.ONE).toBuffer(32)) // === n-1

      ECPair.makeRandom({ rng: rng })
    }))
  })

  describe('getAddress', function () {
    fixtures.valid.forEach(function (f) {
      it('returns ' + f.address + ' for ' + f.WIF, function () {
        const keyPair = ECPair.fromWIF(f.WIF, NETWORKS_LIST)

        assert.strictEqual(keyPair.getAddress(), f.address)
      })
    })
  })

  describe('getNetwork', function () {
    fixtures.valid.forEach(function (f) {
      it('returns ' + f.network + ' for ' + f.WIF, function () {
        const network = NETWORKS[f.network]
        const keyPair = ECPair.fromWIF(f.WIF, NETWORKS_LIST)

        assert.strictEqual(keyPair.getNetwork(), network)
      })
    })
  })

  describe('ecdsa wrappers', function () {
    let keyPair, hash

    beforeEach(function () {
      keyPair = ECPair.makeRandom()
      hash = new Buffer(32)
    })

    describe('signing', function () {
      //  it('wraps ecdsa.sign', sinon.test(function () {
      //    this.mock(ecdsa).expects('sign')
      //      .once().withArgs(hash, keyPair.d)
       //
      //    keyPair.sign(hash)
      //  }))

      it('throws if no private key is found', function () {
        keyPair.d = null

        assert.throws(function () {
          keyPair.sign(hash)
        }, /Missing private key/)
      })
    })

    // describe('verify', function () {
    //   var signature
    //
    //   beforeEach(function () {
    //     signature = keyPair.sign(hash)
    //   })
    //
    //   it('wraps ecdsa.verify', sinon.test(function () {
    //     this.mock(ecdsa).expects('verify')
    //       .once().withArgs(hash, signature, keyPair.Q)
    //
    //     keyPair.verify(hash, signature)
    //   }))
    // })
  })
})
