import verifyHash from '@/utils/verify-hash'
import fixtures from '../crypto/fixtures/ecdsa.json'

import bcrypto from '@/crypto'
import BigInteger from 'bigi'
import ecurve from 'ecurve'
import ECSignature from '@/crypto/ecsignature'

const secp256k1 = ecurve.getCurveByName('secp256k1')

describe('Utils - verifyHash', () => {
  fixtures.valid.ecdsa.forEach(f => {
    it('verifies a valid signature for "' + f.message + '"', () => {
      const hash = bcrypto.sha256(f.message)

      const d = BigInteger.fromHex(f.d)
      const Q = secp256k1.G.multiply(d)
      const publicKeyHex = Q.getEncoded().toString('hex')

      expect(verifyHash(hash, f.signature, publicKeyHex)).toBeTruthy()
    })
  })

  fixtures.invalid.verify.forEach(f => {
    xit('fails to verify with ' + f.description, () => {
      const hash = bcrypto.sha256(f.message)
      const d = BigInteger.fromHex(f.d)

      let signature
      if (f.signature) {
        signature = f.signature
      } else if (f.signatureRaw) {
        const ecsignature = new ECSignature(
          new BigInteger(f.signatureRaw.r, 16),
          new BigInteger(f.signatureRaw.s, 16)
        )
        // FIXME
        signature = ecsignature.toDER()
      }

      const Q = secp256k1.G.multiply(d)
      const publicKeyHex = Q.getEncoded().toString('hex')

      expect(verifyHash(hash, signature, publicKeyHex)).toBeFalsy()
    })
  })
})
