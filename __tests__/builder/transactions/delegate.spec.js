import Ark from '@/'
import Builder from '@/builder'
import Transaction from '@/builder/transactions/delegate'
import network from '@/networks/devnet'

let ark
let tx

beforeEach(() => {
  ark = new Ark(network)
  tx = ark.getBuilder().delegate()
})

describe('Delegate Transaction', () => {
  it('should be instantiated', () => {
    expect(tx).toBeInstanceOf(Transaction)
  })

  it('should have all properties', () => {
    expect(tx).toHaveProperty('id')
    expect(tx).toHaveProperty('type')
    expect(tx).toHaveProperty('fee')
    expect(tx).toHaveProperty('amount')
    expect(tx).toHaveProperty('timestamp')
    expect(tx).toHaveProperty('recipientId')
    expect(tx).toHaveProperty('senderPublicKey')
    expect(tx).toHaveProperty('asset')
    expect(tx).toHaveProperty('version')
    expect(tx).toHaveProperty('network')
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
