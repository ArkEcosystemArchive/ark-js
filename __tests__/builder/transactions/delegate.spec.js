import Ark from '@/'
import network from '@/networks/ark/devnet'
import cryptoBuilder from '@/builder/crypto'
import transactionTests from './__shared__/transaction'

let ark
let tx

beforeEach(() => {
  ark = new Ark(network)
  tx = ark.getBuilder().delegate()
})

describe('Delegate Transaction', () => {
  it('should have its specific properties', () => {
    expect(tx).toHaveProperty('amount')
    expect(tx).toHaveProperty('recipientId')
    expect(tx).toHaveProperty('senderPublicKey')
    expect(tx).toHaveProperty('asset')
  })

  it('should not have the username yet', () => {
    expect(tx).not.toHaveProperty('username')
  })

  describe('create', ()=> {
    it('establish the username', () => {
      tx.create('homer')
      expect(tx.username).toBe('homer')
    })
  })

  // TODO to shared
  describe('sign', ()=> {
    it('signs this transaction with the keys of the passphrase', () => {
      let keys
      cryptoBuilder.getKeys = jest.fn(pass => {
        keys = { publicKey: `${pass} public key` }
        return keys
      })
      cryptoBuilder.sign = jest.fn()
      tx.sign('bad pass')

      expect(cryptoBuilder.getKeys).toHaveBeenCalledWith('bad pass')
      expect(cryptoBuilder.sign).toHaveBeenCalledWith(tx, keys)
    })

    it('establish the public key of the sender', () => {
      cryptoBuilder.getKeys = jest.fn(pass => ({ publicKey: `${pass} public key` }))
      cryptoBuilder.sign = jest.fn()
      tx.sign('bad pass')
      expect(tx.senderPublicKey).toBe('bad pass public key')
    })
  })

  describe('signSecond', ()=> {
    it('signs this transaction with the keys of the second passphrase', () => {
      let keys
      cryptoBuilder.getKeys = jest.fn(pass => {
        keys = { publicKey: `${pass} public key` }
        return keys
      })
      cryptoBuilder.secondSign = jest.fn()
      tx.secondSign('bad second pass')

      expect(cryptoBuilder.getKeys).toHaveBeenCalledWith('bad second pass')
      expect(cryptoBuilder.secondSign).toHaveBeenCalledWith(tx, keys)
    })
  })
})
