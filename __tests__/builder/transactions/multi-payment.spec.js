import Ark from '@/'
import network from '@/networks/ark/devnet'

let ark
let tx

beforeEach(() => {
  ark = new Ark(network)
  tx = ark.getBuilder().multiPayment()
})

describe('Multi Payment Transaction', () => {
  it('should have its specific properties', () => {
    expect(tx).toHaveProperty('payments')
    expect(tx).toHaveProperty('vendorFieldHex')
  })

  describe('addPayment', ()=> {
    it('should add new payments', () => {
      tx.addPayment('address', 'amount')
      tx.addPayment('address', 'amount')
      tx.addPayment('address', 'amount')

      expect(tx.payments).toEqual({
        address1: 'address',
        address2: 'address',
        address3: 'address',
        amount1: 'amount',
        amount2: 'amount',
        amount3: 'amount'
      })
    })
  })
})
