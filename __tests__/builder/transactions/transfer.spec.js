import Ark from '@/'
import network from '@/networks/ark/devnet'
import transactionTests from './__shared__/transaction'

let ark
let tx

beforeEach(() => {
  ark = new Ark(network)
  tx = ark.getBuilder().transfer()

  global.tx = tx
})

describe('Transfer Transaction', () => {
  transactionTests()

  it('should have its specific properties', () => {
    expect(tx).toHaveProperty('amount')
    expect(tx).toHaveProperty('recipientId')
    expect(tx).toHaveProperty('senderPublicKey')
    expect(tx).toHaveProperty('expiration')
  })

  describe('create', ()=> {
    it('establish the recipient id', () => {
      tx.create('homer')
      expect(tx.recipientId).toBe('homer')
    })
    it('establish the amount', () => {
      tx.create(null, 'a lot of ARK')
      expect(tx.amount).toBe('a lot of ARK')
    })
  })
})
