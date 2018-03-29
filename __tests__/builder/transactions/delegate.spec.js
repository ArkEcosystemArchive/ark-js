import Ark from '@/'
import Builder from '@/builder'
import Transaction from '@/builder/transactions/delegate'
import network from '@/networks/devnet'

let ark
beforeEach(() => (ark = new Ark(network)))

describe('Delegate Transaction', () => {
  test('should be instantiated', () => {
    expect(ark.getBuilder().delegate()).toBeInstanceOf(Transaction)
  })
})
