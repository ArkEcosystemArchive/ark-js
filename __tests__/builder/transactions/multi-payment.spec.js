import Ark from '@/'
import Builder from '@/builder'
import Transaction from '@/builder/transactions/multi-payment'
import network from '@/networks/devnet'

let ark
beforeEach(() => (ark = new Ark(network)))

describe('Multi Payment Transaction', () => {
  test('should be instantiated', () => {
    expect(ark.getBuilder().multiPayment()).toBeInstanceOf(Transaction)
  })
})
