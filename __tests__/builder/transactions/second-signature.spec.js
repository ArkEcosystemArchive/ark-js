import Ark from '@/'
import Builder from '@/builder'
import Transaction from '@/builder/transactions/second-signature'
import network from '@/networks/devnet'

let ark
beforeEach(() => (ark = new Ark(network)))

describe('Second Signature Transaction', () => {
  test('should be instantiated', () => {
    expect(ark.getBuilder().secondSignature()).toBeInstanceOf(Transaction)
  })
})
