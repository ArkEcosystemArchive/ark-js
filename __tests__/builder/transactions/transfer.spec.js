import Ark from '@/'
import Builder from '@/builder'
import Transaction from '@/builder/transactions/transfer'
import network from '@/networks/devnet'

let ark
beforeEach(() => (ark = new Ark(network)))

describe('Transfer Transaction', () => {
  test('should be instantiated', () => {
    expect(ark.getBuilder().transfer()).toBeInstanceOf(Transaction)
  })
})
