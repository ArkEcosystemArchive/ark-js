import Ark from '@/'
import network from '@/networks/ark/devnet'
import cryptoBuilder from '@/builder/crypto'
import transactionTests from './__shared__/transaction'

let ark
let tx

beforeEach(() => {
  ark = new Ark(network)
  tx = ark.getBuilder().delegate()

  global.tx = tx
})

describe('Delegate Transaction', () => {
  transactionTests()

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

  describe('sign', ()=> {
    xit('establish the public key of the delegate (on the asset property)', () => {
      cryptoBuilder.getKeys = jest.fn(pass => ({ publicKey: `${pass} public key` }))
      cryptoBuilder.sign = jest.fn()
      tx.sign('bad pass')
      expect(tx.senderPublicKey).toBe('bad pass public key')
    })
  })
})
