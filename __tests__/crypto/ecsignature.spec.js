import assert from 'assert'
import BigInteger from 'bigi'

import ECSignature from '@/crypto/ecsignature'
import configManager from '@/managers/config'
import network from '@/networks/ark/mainnet'

import fixtures from './fixtures/ecsignature.json'

beforeEach(() => configManager.setConfig(network))

describe('ECSignature', () => {
  describe('toCompact', () => {
    fixtures.valid.forEach((f) => {
      it('exports ' + f.compact.hex + ' correctly', () => {
        var signature = new ECSignature(new BigInteger(f.signature.r), new BigInteger(f.signature.s))

        var buffer = signature.toCompact(f.compact.i, f.compact.compressed)
        assert.strictEqual(buffer.toString('hex'), f.compact.hex)
      })
    })
  })

  describe('parseCompact', () => {
    fixtures.valid.forEach((f) => {
      it('imports ' + f.compact.hex + ' correctly', () => {
        var buffer = Buffer.from(f.compact.hex, 'hex')
        var parsed = ECSignature.parseCompact(buffer)

        assert.strictEqual(parsed.compressed, f.compact.compressed)
        assert.strictEqual(parsed.i, f.compact.i)
        assert.strictEqual(parsed.signature.r.toString(), f.signature.r)
        assert.strictEqual(parsed.signature.s.toString(), f.signature.s)
      })
    })

    fixtures.invalid.compact.forEach((f) => {
      it('throws on ' + f.hex, () => {
        var buffer = Buffer.from(f.hex, 'hex')

        assert.throws(() => {
          ECSignature.parseCompact(buffer)
        }, new RegExp(f.exception))
      })
    })
  })

  describe('toDER', () => {
    fixtures.valid.forEach((f) => {
      it('exports ' + f.DER + ' correctly', () => {
        var signature = new ECSignature(new BigInteger(f.signature.r), new BigInteger(f.signature.s))

        var DER = signature.toDER()
        assert.strictEqual(DER.toString('hex'), f.DER)
      })
    })
  })

  describe('fromDER', () => {
    fixtures.valid.forEach((f) => {
      it('imports ' + f.DER + ' correctly', () => {
        var buffer = Buffer.from(f.DER, 'hex')
        var signature = ECSignature.fromDER(buffer)

        assert.strictEqual(signature.r.toString(), f.signature.r)
        assert.strictEqual(signature.s.toString(), f.signature.s)
      })
    })

    fixtures.invalid.DER.forEach((f) => {
      it('throws "' + f.exception + '" for ' + f.hex, () => {
        var buffer = Buffer.from(f.hex, 'hex')

        assert.throws(() => {
          ECSignature.fromDER(buffer)
        }, new RegExp(f.exception))
      })
    })
  })

  describe('toScriptSignature', () => {
    fixtures.valid.forEach((f) => {
      it('exports ' + f.scriptSignature.hex + ' correctly', () => {
        var signature = new ECSignature(new BigInteger(f.signature.r), new BigInteger(f.signature.s))

        var scriptSignature = signature.toScriptSignature(f.scriptSignature.hashType)
        assert.strictEqual(scriptSignature.toString('hex'), f.scriptSignature.hex)
      })
    })

    fixtures.invalid.scriptSignature.forEach((f) => {
      it('throws ' + f.exception, () => {
        var signature = new ECSignature(new BigInteger(f.signature.r), new BigInteger(f.signature.s))

        assert.throws(() => {
          signature.toScriptSignature(f.hashType)
        }, new RegExp(f.exception))
      })
    })
  })

  describe('parseScriptSignature', () => {
    fixtures.valid.forEach((f) => {
      it('imports ' + f.scriptSignature.hex + ' correctly', () => {
        var buffer = Buffer.from(f.scriptSignature.hex, 'hex')
        var parsed = ECSignature.parseScriptSignature(buffer)

        assert.strictEqual(parsed.signature.r.toString(), f.signature.r)
        assert.strictEqual(parsed.signature.s.toString(), f.signature.s)
        assert.strictEqual(parsed.hashType, f.scriptSignature.hashType)
      })
    })

    fixtures.invalid.scriptSignature.forEach((f) => {
      it('throws on ' + f.hex, () => {
        var buffer = Buffer.from(f.hex, 'hex')

        assert.throws(() => {
          ECSignature.parseScriptSignature(buffer)
        }, new RegExp(f.exception))
      })
    })
  })
})
