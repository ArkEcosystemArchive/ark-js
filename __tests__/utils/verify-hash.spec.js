import verifyHash from '@/utils/verify-hash'
import fixtures from './fixtures/verify-hash.json'

import bcrypto from '@/crypto'
import BigInteger from 'bigi'
import ecurve from 'ecurve'
import ECSignature from '@/crypto/ecsignature'

const secp256k1 = ecurve.getCurveByName('secp256k1')

describe('Utils - verifyHash', () => {
  fixtures.valid.forEach(f => {
    it('verifies a valid signature for "' + f.message + '"', () => {
      const hash = bcrypto.sha256(f.message)

      const d = BigInteger.fromHex(f.d)
      const Q = secp256k1.G.multiply(d)
      const publicKeyHex = Q.getEncoded().toString('hex')

      expect(verifyHash(hash, f.signature, publicKeyHex)).toBeTruthy()
    })
  })

  fixtures.invalid.forEach(f => {
    it(`fails to verify with ${f.description}`, () => {
      const hash = bcrypto.sha256(f.message)

      const d = BigInteger.fromHex(f.d)
      const Q = secp256k1.G.multiply(d)
      const publicKeyHex = Q.getEncoded().toString('hex')

      expect(verifyHash(hash, f.signature, publicKeyHex)).toBeFalsy()
    })
  })
})
