import Transaction from '@/builder/transactions/delegate-resignation'

export default () => {
  describe('inherits from Transaction', ()=> {
    it('as an instance', () => {
      expect(tx).toBeInstanceOf(Transaction)
    })

    it('should have the essential properties', () => {
      expect(tx).toHaveProperty('model')

      expect(tx).toHaveProperty('id')
      expect(tx).toHaveProperty('timestamp')
      expect(tx).toHaveProperty('version')
      expect(tx).toHaveProperty('network')

      expect(tx).toHaveProperty('type')
      expect(tx).toHaveProperty('fee')
    })

    describe('setFee', ()=> {
      it('should set the fee', () => {
        tx.setFee('fake')
        expect(tx.fee).toBe('fake')
      })
    })

    describe('setAmount', ()=> {
      it('should set the amount', () => {
        tx.setAmount('fake')
        expect(tx.amount).toBe('fake')
      })
    })

    describe('setRecipientId', ()=> {
      it('should set the recipient id', () => {
        tx.setRecipientId('fake')
        expect(tx.recipientId).toBe('fake')
      })
    })

    describe('setSenderPublicKey', ()=> {
      it('should set the sender public key', () => {
        tx.setSenderPublicKey('fake')
        expect(tx.senderPublicKey).toBe('fake')
      })
    })
  })
}
