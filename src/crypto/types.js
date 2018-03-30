import typeforce from 'typeforce'

const UINT31_MAX = Math.pow(2, 31) - 1

function UInt31 (value) {
  return typeforce.UInt32(value) && value <= UINT31_MAX
}

function BIP32Path (value) {
  return typeforce.String(value) && value.match(/^(m\/)?(\d+'?\/)*\d+'?$/)
}
BIP32Path.toJSON = () => {
  return 'BIP32 derivation path'
}

const SATOSHI_MAX = 21 * 1e14

function Satoshi (value) {
  return typeforce.UInt53(value) && value <= SATOSHI_MAX
}

// external dependent types
const BigInt = typeforce.quacksLike('BigInteger')
const ECPoint = typeforce.quacksLike('Point')

// exposed, external API
const ECSignature = typeforce.compile({
  r: BigInt,
  s: BigInt
})
const Network = typeforce.compile({
  messagePrefix: typeforce.oneOf(typeforce.Buffer, typeforce.String),
  bip32: {
    public: typeforce.UInt32,
    private: typeforce.UInt32
  },
  pubKeyHash: typeforce.UInt8,
  wif: typeforce.UInt8
})

// extend typeforce types with ours
let types = {
  BigInt: BigInt,
  BIP32Path: BIP32Path,
  Buffer256bit: typeforce.BufferN(32),
  ECPoint: ECPoint,
  ECSignature: ECSignature,
  Hash160bit: typeforce.BufferN(20),
  Hash256bit: typeforce.BufferN(32),
  Network: Network,
  Satoshi: Satoshi,
  UInt31: UInt31
}

for (const typeName in typeforce) {
  types[typeName] = typeforce[typeName]
}

export default types
