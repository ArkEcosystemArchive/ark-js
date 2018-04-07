import Ark from '@/'
import network from '@/networks/ark/devnet'
import transactionTests from './__shared__/transaction'

let ark
let tx

beforeEach(() => {
  ark = new Ark(network)
  tx = ark.getBuilder().vote()

  global.tx = tx
})

describe('Vote Transaction', () => {
  transactionTests()

  it('should have its specific properties', () => {
    expect(tx).toHaveProperty('amount')
    expect(tx).toHaveProperty('recipientId')
    expect(tx).toHaveProperty('senderPublicKey')
    expect(tx).toHaveProperty('asset')
  })

  describe('create', ()=> {
    it('establishes the votes asset', () => {
      const nonsenseVotes = ['Trump', 'Brexit', 'Rajoy']
      tx.create(nonsenseVotes)
      expect(tx.asset.votes).toBe(nonsenseVotes)
    })
  })
})
