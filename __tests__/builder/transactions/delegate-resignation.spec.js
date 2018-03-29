import Ark from '@/'
import Builder from '@/builder'
import Transaction from '@/builder/transactions/delegate-resignation'
import network from '@/networks/devnet'

let ark
beforeEach(() => (ark = new Ark(network)))

describe('Delegate Resignation Transaction', () => {
  test('should be instantiated', () => {
    expect(ark.getBuilder().delegateResignation()).toBeInstanceOf(Transaction)
  })
})
