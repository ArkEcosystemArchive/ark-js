import Ark from '@/'
import network from '@/networks/ark/devnet'

let ark
let tx

beforeEach(() => {
  ark = new Ark(network)
  tx = ark.getBuilder().vote()
})

describe('Vote Transaction', () => {
  it('should have its specific properties', () => {
    expect(tx).toHaveProperty('amount')
    expect(tx).toHaveProperty('recipientId')
    expect(tx).toHaveProperty('senderPublicKey')
    expect(tx).toHaveProperty('asset')
  })

  describe('create', ()=> {
    it('establish the votes asset', () => {
      const nonsenseVotes = ['Trump', 'Brexit', 'Rajoy']
      tx.create(nonsenseVotes)
      expect(tx.asset.votes).toBe(nonsenseVotes)
    })
  })
})
