import Ark from '@/'
import Builder from '@/builder'
import Transaction from '@/builder/transactions/timelock-transfer'
import network from '@/networks/devnet'

let ark
beforeEach(() => (ark = new Ark(network)))

describe('Timelock Transfer Transaction', () => {
  test('should be instantiated', () => {
    expect(ark.getBuilder().timelockTransfer()).toBeInstanceOf(Transaction)
  })
})
