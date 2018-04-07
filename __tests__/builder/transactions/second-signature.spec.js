import Ark from '@/'
import network from '@/networks/ark/devnet'

let ark
let tx

beforeEach(() => {
  ark = new Ark(network)
  tx = ark.getBuilder().secondSignature()
})

describe('Second Signature Transaction', () => {
  it('should have its specific properties', () => {
    expect(tx).toHaveProperty('amount')
    expect(tx).toHaveProperty('recipientId')
    expect(tx).toHaveProperty('senderPublicKey')
    expect(tx).toHaveProperty('asset')
  })
})
