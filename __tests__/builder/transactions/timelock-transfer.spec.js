import Ark from '@/'
import Builder from '@/builder'
import Transaction from '@/builder/transactions/timelock-transfer'
import network from '@/networks/devnet'

let ark
let tx

beforeEach(() => {
    ark = new Ark(network)
    tx = ark.getBuilder().timelockTransfer()
})

describe('Timelock Transfer Transaction', () => {
  it('should be instantiated', () => {
    expect(tx).toBeInstanceOf(Transaction)
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
