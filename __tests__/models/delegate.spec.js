import Wallet from '@/models/wallet'

describe('Models - Delegate', () => {
  describe('forge', () => {
    describe('without version option', () => {
      it('doesn\'t sort the transactions', () => {
        const address = 'Abcde'
        const wallet = new Wallet(address)
        wallet.balance = 10 ** 8

        expect(wallet.toString()).toBe(`${address}=1`)
      })

      // TODO probably useful for debugging
      it('throws an Error', () => {})
    })
  })
})
