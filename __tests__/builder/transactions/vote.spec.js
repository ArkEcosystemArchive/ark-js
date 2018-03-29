import Ark from '@/'
import Builder from '@/builder'
import Transaction from '@/builder/transactions/vote'
import network from '@/networks/devnet'

let ark
beforeEach(() => (ark = new Ark(network)))

describe('Vote Transaction', () => {
  test('should be instantiated', () => {
    expect(ark.getBuilder().vote()).toBeInstanceOf(Transaction)
  })
})
