import Ark from '@/'
import Builder from '@/builder'
import Transaction from '@/builder/transactions/multi-signature'
import network from '@/networks/devnet'

let ark
beforeEach(() => (ark = new Ark(network)))

describe('Multi Signature Transaction', () => {
  test('should be instantiated', () => {
    expect(ark.getBuilder().multiSignature()).toBeInstanceOf(Transaction)
  })
})
