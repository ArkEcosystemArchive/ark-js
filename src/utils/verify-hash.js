import ECPair from '@/crypto/ecpair'
import ECSignature from '@/crypto/ecsignature'

export default function (hash, signature, publicKey) {
  const signatureBuffer = Buffer.from(signature, 'hex')
  const publicKeyBuffer = Buffer.from(publicKey, 'hex')

  const ecpair = ECPair.fromPublicKeyBuffer(publicKeyBuffer)
  const ecsignature = ECSignature.fromDER(signatureBuffer)

  return ecpair.verify(hash, ecsignature)
}
