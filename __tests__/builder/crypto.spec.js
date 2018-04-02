import { Buffer } from 'buffer/'
import ecurve from 'ecurve'
import ECPair from '@/crypto/ecpair'
import ecdsa from '@/crypto/ecdsa'
import cryptoBuilder from '@/builder/crypto'

const curve = ecdsa.__curve

describe('cryptoBuilder.js', () => {
  describe('#getBytes', () => {
    const getBytes = cryptoBuilder.getBytes
    let bytes = null

    it('should be a function', () => {
      expect(getBytes).toBeFunction()
    })

    it('should return Buffer of simply transaction and buffer must be 202 length', () => {
      const transaction = {
        type: 0,
        amount: 1000,
        fee: 2000,
        recipientId: 'AJWRd23HNEhPLkK1ymMnwnDBX2a7QBZqff',
        timestamp: 141738,
        asset: {},
        senderPublicKey: '5d036a858ce89f844491762eb89e2bfbd50a4a0a0da658e4b2628b25b117ae09',
        signature: '618a54975212ead93df8c881655c625544bce8ed7ccdfe6f08a42eecfb1adebd051307be5014bb051617baf7815d50f62129e70918190361e5d4dd4796541b0a',
        id: '13987348420913138422'
      }

      bytes = getBytes(transaction)
      expect(bytes).toBeObject()
      expect(bytes).toHaveLength(202)
    })

    it('should return Buffer of transaction with second signature and buffer must be 266 length', () => {
      const transaction = {
        type: 0,
        amount: 1000,
        fee: 2000,
        recipientId: 'AJWRd23HNEhPLkK1ymMnwnDBX2a7QBZqff',
        timestamp: 141738,
        asset: {},
        senderPublicKey: '5d036a858ce89f844491762eb89e2bfbd50a4a0a0da658e4b2628b25b117ae09',
        signature: '618a54975212ead93df8c881655c625544bce8ed7ccdfe6f08a42eecfb1adebd051307be5014bb051617baf7815d50f62129e70918190361e5d4dd4796541b0a',
        signSignature: '618a54975212ead93df8c881655c625544bce8ed7ccdfe6f08a42eecfb1adebd051307be5014bb051617baf7815d50f62129e70918190361e5d4dd4796541b0a',
        id: '13987348420913138422'
      }

      bytes = getBytes(transaction)
      expect(bytes).toBeObject()
      expect(bytes).toHaveLength(266)
    })
  })

  describe('#getHash', () => {
    const getHash = cryptoBuilder.getHash

    it('should be a function', () => {
      expect(getHash).toBeFunction()
    })

    it('should return Buffer and Buffer most be 32 bytes length', () => {
      const transaction = {
        type: 0,
        amount: 1000,
        fee: 2000,
        recipientId: 'AJWRd23HNEhPLkK1ymMnwnDBX2a7QBZqff',
        timestamp: 141738,
        asset: {},
        senderPublicKey: '5d036a858ce89f844491762eb89e2bfbd50a4a0a0da658e4b2628b25b117ae09',
        signature: '618a54975212ead93df8c881655c625544bce8ed7ccdfe6f08a42eecfb1adebd051307be5014bb051617baf7815d50f62129e70918190361e5d4dd4796541b0a'
      }

      const result = getHash(transaction)
      expect(result).toBeObject()
      expect(result).toHaveLength(32)
    })
  })

  describe('#getId', () => {
    const getId = cryptoBuilder.getId

    it('should be a function', () => {
      expect(getId).toBeFunction()
    })

    it('should return string id and be equal to 619fd7971db6f317fdee3675c862291c976d072a0a1782410e3a6f5309022491', () => {
      const transaction = {
        type: 0,
        amount: 1000,
        fee: 2000,
        recipientId: 'AJWRd23HNEhPLkK1ymMnwnDBX2a7QBZqff',
        timestamp: 141738,
        asset: {},
        senderPublicKey: '5d036a858ce89f844491762eb89e2bfbd50a4a0a0da658e4b2628b25b117ae09',
        signature: '618a54975212ead93df8c881655c625544bce8ed7ccdfe6f08a42eecfb1adebd051307be5014bb051617baf7815d50f62129e70918190361e5d4dd4796541b0a'
      }

      const id = getId(transaction)
      (id).toBeString().and.equal('952e33b66c35a3805015657c008e73a0dee1efefd9af8c41adb59fe79745ccea')
    })
  })

  describe('#getFee', () => {
    const getFee = cryptoBuilder.getFee

    it('should be a function', () => {
      expect(getFee).toBeFunction()
    })

    it('should return number', () => {
      const fee = getFee({amount: 100000, type: 0})
      expect(fee).toBeNumber()
      expect(fee).not.toBeNaN()
    })

    it('should return 10000000', () => {
      const fee = getFee({amount: 100000, type: 0})
      expect(fee).toBeNumber()
      expect(fee).toBe(10000000)
    })

    it('should return 10000000000', () => {
      const fee = getFee({type: 1})
      expect(fee).toBeNumber()
      expect(fee).toBe(10000000000)
    })

    it('should be equal 1000000000000', () => {
      const fee = getFee({type: 2})
      expect(fee).toBeNumber()
      expect(fee).toBe(1000000000000)
    })

    it('should be equal 100000000', () => {
      const fee = getFee({type: 3})
      expect(fee).toBeNumber()
      expect(fee).toBe(100000000)
    })
  })

  describe('fixedPoint', () => {
    const fixedPoint = cryptoBuilder.fixedPoint

    it('should be number', () => {
      expect(fixedPoint).toBeNumber()
      expect(fixedPoint).not.toBeNaN()
    })

    it('should be equal 100000000', () => {
      expect(fixedPoint).toBe(100000000)
    })
  })

  describe('#sign', () => {
    const sign = cryptoBuilder.sign

    it('should be a function', () => {
      expect(sign).toBeFunction()
    })
  })

  describe('#secondSign', () => {
    const secondSign = cryptoBuilder.secondSign

    it('should be a function', () => {
      expect(secondSign).toBeFunction()
    })
  })

  describe('#getKeys', () => {
    const getKeys = cryptoBuilder.getKeys

    it('should be a function', () => {
      expect(getKeys).toBeFunction()
    })

    it('should return two keys in hex', () => {
      const keys = getKeys('secret')

      expect(keys).toBeObject()
      expect(keys).toHaveProperty('publicKey')
      expect(keys).toHaveProperty('privateKey')

      expect(keys.publicKey).toBeString()
      expect(keys.publicKey).toMatch(Buffer.from(keys.publicKey, 'hex'))

      expect(keys.privateKey).toBeString()
      expect(keys.privateKey).toMatch(Buffer.from(keys.privateKey, 'hex'))
    })
  })

  describe('#getAddress', () => {
    const getAddress = cryptoBuilder.getAddress

    it('should be a function', () => {
      expect(getAddress).toBeFunction()
    })

    it('should generate address by publicKey', () => {
      const keys = cryptoBuilder.getKeys('secret')
      const address = getAddress(keys.publicKey)

      expect(address).toBeString()
      expect(address).toBe('AJWRd23HNEhPLkK1ymMnwnDBX2a7QBZqff')
    })

    it('should generate address by publicKey - second test', () => {
      const keys = cryptoBuilder.getKeys('secret second test to be sure it works correctly')
      const address = getAddress(keys.publicKey)

      expect(address).toBeString()
      expect(address).toBe('AQSqYnjmwj1GBL5twD4K9EBXDaTHZognox')
    })

    it('should generate the same address as ECPair.getAddress()', () => {
      const keys = cryptoBuilder.getKeys('secret second test to be sure it works correctly')
      const address = getAddress(keys.publicKey)

      const Q = ecurve.Point.decodeFrom(curve, Buffer.from(keys.publicKey, 'hex'))
      const keyPair = new ECPair(null, Q)

      expect(address).toBe(keyPair.getAddress())
    })
  })

  describe('#verify', () => {
    it('should be function', () => {
      expect(cryptoBuilder.verify).toBeFunction()
    })
  })

  describe('#verifySecondSignature', () => {
    it('should be function', () => {
      expect(cryptoBuilder.verifySecondSignature).toBeFunction()
    })
  })
})

describe.skip('different networks', () => {
  it('validate address on tesnet should be ok', () => {
    ark.cryptoBuilder.setNetworkVersion(0x52)
    expect(ark.cryptoBuilder.getNetworkVersion()).toBe(0x52)

    const validate = ark.cryptoBuilder.validateAddress('a6fpb1BJZq4otWiVsBcuLG1ZGs5WsqqQtH')
    expect(validate).toBeTruthy()

    ark.cryptoBuilder.setNetworkVersion(0x17)
    expect(ark.cryptoBuilder.getNetworkVersion()).toBe(0x17)
  })
})
