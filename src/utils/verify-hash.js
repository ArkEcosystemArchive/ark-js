import ECPair from '@/crypto/ecpair'
import ECSignature from '@/crypto/ecsignature'

/**
 * @param {String} hash
 * @param {String} signature
 * @param {String} publicKey
 */
export default function (hash, signature, publicKey) {
  const signatureBuffer = Buffer.from(signature, 'hex')
  const publicKeyBuffer = Buffer.from(publicKey, 'hex')

  const ecPair = ECPair.fromPublicKeyBuffer(publicKeyBuffer)
  const ecSignature = ECSignature.fromDER(signatureBuffer)

  return ecPair.verify(hash, ecSignature)
}
