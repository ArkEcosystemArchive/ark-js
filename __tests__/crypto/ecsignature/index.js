import assert from 'assert'
import BigInteger from 'bigi'

import ECSignature from '@/crypto/ecsignature'
import fixtures from './fixtures.json'

test('ECSignature', function() {
  test('toCompact', function() {
    fixtures.valid.forEach(function(f) {
      it('exports ' + f.compact.hex + ' correctly', function() {
        var signature = new ECSignature(new BigInteger(f.signature.r), new BigInteger(f.signature.s))

        var buffer = signature.toCompact(f.compact.i, f.compact.compressed)
        assert.strictEqual(buffer.toString('hex'), f.compact.hex)
      })
    })
  })

  test('parseCompact', function() {
    fixtures.valid.forEach(function(f) {
      it('imports ' + f.compact.hex + ' correctly', function() {
        var buffer = new Buffer(f.compact.hex, 'hex')
        var parsed = ECSignature.parseCompact(buffer)

        assert.strictEqual(parsed.compressed, f.compact.compressed)
        assert.strictEqual(parsed.i, f.compact.i)
        assert.strictEqual(parsed.signature.r.toString(), f.signature.r)
        assert.strictEqual(parsed.signature.s.toString(), f.signature.s)
      })
    })

    fixtures.invalid.compact.forEach(function(f) {
      it('throws on ' + f.hex, function() {
        var buffer = new Buffer(f.hex, 'hex')

        assert.throws(function() {
          ECSignature.parseCompact(buffer)
        }, new RegExp(f.exception))
      })
    })
  })

  test('toDER', function() {
    fixtures.valid.forEach(function(f) {
      it('exports ' + f.DER + ' correctly', function() {
        var signature = new ECSignature(new BigInteger(f.signature.r), new BigInteger(f.signature.s))

        var DER = signature.toDER()
        assert.strictEqual(DER.toString('hex'), f.DER)
      })
    })
  })

  test('fromDER', function() {
    fixtures.valid.forEach(function(f) {
      it('imports ' + f.DER + ' correctly', function() {
        var buffer = new Buffer(f.DER, 'hex')
        var signature = ECSignature.fromDER(buffer)

        assert.strictEqual(signature.r.toString(), f.signature.r)
        assert.strictEqual(signature.s.toString(), f.signature.s)
      })
    })

    fixtures.invalid.DER.forEach(function(f) {
      it('throws "' + f.exception + '" for ' + f.hex, function() {
        var buffer = new Buffer(f.hex, 'hex')

        assert.throws(function() {
          ECSignature.fromDER(buffer)
        }, new RegExp(f.exception))
      })
    })
  })

  test('toScriptSignature', function() {
    fixtures.valid.forEach(function(f) {
      it('exports ' + f.scriptSignature.hex + ' correctly', function() {
        var signature = new ECSignature(new BigInteger(f.signature.r), new BigInteger(f.signature.s))

        var scriptSignature = signature.toScriptSignature(f.scriptSignature.hashType)
        assert.strictEqual(scriptSignature.toString('hex'), f.scriptSignature.hex)
      })
    })

    fixtures.invalid.scriptSignature.forEach(function(f) {
      it('throws ' + f.exception, function() {
        var signature = new ECSignature(new BigInteger(f.signature.r), new BigInteger(f.signature.s))

        assert.throws(function() {
          signature.toScriptSignature(f.hashType)
        }, new RegExp(f.exception))
      })
    })
  })

  test('parseScriptSignature', function() {
    fixtures.valid.forEach(function(f) {
      it('imports ' + f.scriptSignature.hex + ' correctly', function() {
        var buffer = new Buffer(f.scriptSignature.hex, 'hex')
        var parsed = ECSignature.parseScriptSignature(buffer)

        assert.strictEqual(parsed.signature.r.toString(), f.signature.r)
        assert.strictEqual(parsed.signature.s.toString(), f.signature.s)
        assert.strictEqual(parsed.hashType, f.scriptSignature.hashType)
      })
    })

    fixtures.invalid.scriptSignature.forEach(function(f) {
      it('throws on ' + f.hex, function() {
        var buffer = new Buffer(f.hex, 'hex')

        assert.throws(function() {
          ECSignature.parseScriptSignature(buffer)
        }, new RegExp(f.exception))
      })
    })
  })
})
