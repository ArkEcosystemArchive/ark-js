import Ark from '@/'
import Builder from '@/builder'
import Transaction from '@/builder/transactions/ipfs'
import network from '@/networks/devnet'

let ark
beforeEach(() => (ark = new Ark(network)))

describe('IPFS Transaction', () => {
  test('should be instantiated', () => {
    expect(ark.getBuilder().ipfs()).toBeInstanceOf(Transaction)
  })
})
