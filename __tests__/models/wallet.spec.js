import Wallet from '@/models/wallet'
import multiTx from './fixtures/multi-transaction'

import configManager from '@/managers/config'
import network from '@/networks/devnet'

describe('Models - Wallet', () => {
  describe('toString', () => {
    // TODO implementation is right?
    it('returns the address and the balance', () => {
      const address = 'Abcde'
      const wallet = new Wallet(address)
      const balance = parseFloat((Math.random() * 1000).toFixed(8))
      wallet.balance = balance * 10 ** 8

      expect(wallet.toString()).toBe(`${address}=${balance}`)
    })
  })

  describe('apply transaction', () => {
    it('should be ok for a multitx', () => {
      const multitx = require('./fixtures/multi-transaction')

      expect(testWallet.canApply(multitx)).toBeTruthy()
    })
  })
})
