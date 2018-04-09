import sinon from 'sinon'
import Block from '@/models/block'

const verifyHash = require('@/utils/verify-hash')
const verifyHashMock = jest.fn()
jest.spyOn(verifyHash, 'default').mockImplementation(verifyHashMock)

describe('Models - Block', () => {
  const data = {
    id: 1,
    height: 1,
    totalAmount: 10,
    totalFee: 1,
    reward: 1,
    transactions: []
  }

  describe('constructor', () => {
    it('stores the data', () => {})
    it('verifies the block', () => {})
  })

  describe('static create', () => {
    xit('returns a new Block', () => {
      // FIXME
      const keys = {}
      expect(Block.create(data, keys)).toBeInstanceOf(Block)
    })
  })

  describe('static getId', () => {
  })

  describe('getHeader', () => {
    it('returns the block data without the transactions', () => {
      // Ignore the verification for testing purposes
      sinon.stub(Block.prototype, 'verify')

      const block = new Block(data)

      expect(block.getHeader().height).toBe(data.height)
      expect(block.getHeader().totalAmount).toBe(data.totalAmount)
      expect(block.getHeader().totalFee).toBe(data.totalFee)
      expect(block.getHeader().reward).toBe(data.reward)

      expect(block.getHeader()).not.toHaveProperty('transactions')
    })
  })

  describe('verifySignature', () => {
    // FIXME
    xit('computes and verifies the hash of the transaction', () => {
      data.version = 1
      data.timestamp = Date.now()
      data.height = 2
      data.numberOfTransactions = data.transactions.length
      data.payloadLength = 32 * data.numberOfTransactions
      const block = Block.create(data)

      const transaction = {
        type: 0,
        amount: 1000,
        fee: 2000,
        recipientId: 'AJWRd23HNEhPLkK1ymMnwnDBX2a7QBZqff',
        timestamp: 141738,
        asset: {},
        senderPublicKey: '5d036a858ce89f844491762eb89e2bfbd50a4a0a0da658e4b2628b25b117ae09',
        signature: '618a54975212ead93df8c881655c625544bce8ed7ccdfe6f08a42eecfb1adebd051307be5014bb051617baf7815d50f62129e70918190361e5d4dd4796541b0a' // eslint-disable-line max-len
      }

      const bytes = Block.serialize(data, false)
      const hash = crypto.createHash('sha256').update(bytes).digest()

      const publicKey = '036928c98ee53a1f52ed01dd87db10ffe1980eb47cd7c0a7d688321f47b5d7d760'

      const wallet = null

      block.verifySignature(transaction, wallet.signature, publicKey)
      expect(verifyHashMock).toHaveBeenCalledWith(hash, wallet.signature, publicKey)
    })
  })
})
