import Ark from '@/'
import network from '@/networks/ark/devnet'
import transactionTests from './__shared__/transaction'

let ark
let tx

beforeEach(() => {
  ark = new Ark(network)
  tx = ark.getBuilder().secondSignature()

  global.tx = tx
})

describe('Second Signature Transaction', () => {
  transactionTests()

  it('should have its specific properties', () => {
    expect(tx).toHaveProperty('amount')
    expect(tx).toHaveProperty('recipientId')
    expect(tx).toHaveProperty('senderPublicKey')
    expect(tx).toHaveProperty('asset')
  })
})
