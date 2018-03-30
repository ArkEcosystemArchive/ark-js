import Ark from '@/'
import Builder from '@/builder'
import Transaction from '@/builder/transactions/multi-payment'
import network from '@/networks/devnet'

let ark
let tx

beforeEach(() => {
  ark = new Ark(network)
  tx = ark.getBuilder().multiPayment()
})

describe('Multi Payment Transaction', () => {
  it('should be instantiated', () => {
    expect(tx).toBeInstanceOf(Transaction)
  })

  it('should have all properties', () => {
    expect(tx).toHaveProperty('id')
    expect(tx).toHaveProperty('type')
    expect(tx).toHaveProperty('fee')
    expect(tx).toHaveProperty('timestamp')
    expect(tx).toHaveProperty('version')
  })

  it('should add new payments', () => {
    tx.addPayment('address', 'amount')
    tx.addPayment('address', 'amount')
    tx.addPayment('address', 'amount')

    expect(tx.payments).toEqual({
        "address1": "address",
        "address2": "address",
        "address3": "address",
        "amount1": "amount",
        "amount2": "amount",
        "amount3": "amount"
    })
  })

  it('should set the fee', () => {
    tx.setFee('fake')

    expect(tx.fee).toBe('fake')
  })

  it('should set the amount', () => {
    tx.setAmount('fake')

    expect(tx.amount).toBe('fake')
  })

  it('should set the recipient id', () => {
    tx.setRecipientId('fake')

    expect(tx.recipientId).toBe('fake')
  })

  it('should set the sender public key', () => {
    tx.setSenderPublicKey('fake')

    expect(tx.senderPublicKey).toBe('fake')
  })
})
