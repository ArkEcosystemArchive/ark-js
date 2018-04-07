import Ark from '@/'
import network from '@/networks/ark/devnet'

let ark
let tx

beforeEach(() => {
  ark = new Ark(network)
  tx = ark.getBuilder().timelockTransfer()
})

describe('Timelock Transfer Transaction', () => {
  it('should have its specific properties', () => {
    expect(tx).toHaveProperty('amount')
    expect(tx).toHaveProperty('recipientId')
    expect(tx).toHaveProperty('senderPublicKey')
    expect(tx).toHaveProperty('timelockType')
    expect(tx).toHaveProperty('timelock')
  })
})
