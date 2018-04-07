import Ark from '@/'
import network from '@/networks/ark/devnet'
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

  describe('sign', ()=> {
    xit('signs this transaction with the keys of the passphrase', () => {
    })
  })

  describe('signSecond', ()=> {
    xit('signs this transaction with the keys of the second passphrase', () => {
    })
  })
})
