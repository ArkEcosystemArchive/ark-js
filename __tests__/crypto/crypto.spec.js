import crypto from '@/crypto'

const buffer = Buffer.from('Hello World')

describe('Ark', () => {
  test('should be instantiated', () => {
    expect(crypto).toBeInstanceOf(Object)
  })

  it('should return valid ripemd160', () => {
    expect(crypto.ripemd160(buffer).toString('hex')).toEqual('a830d7beb04eb7549ce990fb7dc962e499a27230')
  })

  it('should return valid sha1', () => {
    expect(crypto.sha1(buffer).toString('hex')).toEqual('0a4d55a8d778e5022fab701977c5d840bbc486d0')
  })

  it('should return valid sha256', () => {
    expect(crypto.sha256(buffer).toString('hex')).toEqual('a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e')
  })

  it('should return valid hash160', () => {
    expect(crypto.hash160(buffer).toString('hex')).toEqual('bdfb69557966d026975bebe914692bf08490d8ca')
  })

  it('should return valid hash256', () => {
    expect(crypto.hash256(buffer).toString('hex')).toEqual('42a873ac3abd02122d27e80486c6fa1ef78694e8505fcec9cbcc8a7728ba8949')
  })
})
