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

  describe('create', ()=> {
    it('establish the recipient id', () => {
      tx.create('homer')
      expect(tx.recipientId).toBe('homer')
    })
    it('establish the amount', () => {
      tx.create(null, 'a lot of ARK')
      expect(tx.amount).toBe('a lot of ARK')
    })
    it('establish the time lock', () => {
      tx.create(null, null, 'time lock')
      expect(tx.timelock).toBe('time lock')
    })
    it('establish the time lock type', () => {
      tx.create(null, null, null, 'time lock type')
      expect(tx.timelockType).toBe('time lock type')
    })
  })
})
