import Wallet from '@/models/wallet'
import multiTx from './fixtures/multi-transaction'
import cryptoBuilder from '@/builder/crypto'

import configManager from '@/managers/config'
import network from '@/networks/ark/devnet'

const verifyHash = require('@/utils/verify-hash')
const verifyHashMock = jest.fn()
jest.spyOn(verifyHash, 'default').mockImplementation(verifyHashMock)

describe('Models - Wallet', () => {
  beforeEach(() => configManager.setConfig(network))

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
    const testWallet = new Wallet('D61xc3yoBQDitwjqUspMPx1ooET6r1XLt7')
    const data = {
      publicKey: '02337316a26d8d49ec27059bd0589c49ba474029c3627715380f4df83fb431aece',
      secondPublicKey: '020d3c837d0a47ee7de1082cd48885003c5e92964e58bb34af3b58c6e42208ae03',
      balance: 109390000000,
      vote: null,
      username: null,
      votebalance: 0,
      multisignature: null,
      dirty: false,
      producedBlocks: 0,
      missedBlocks: 0
    }

    xit('should be ok for a multi-transaction', () => {
      Object.keys(data).forEach(k => (testWallet[k] = data[k]))
      expect(testWallet.canApply(multiTx)).toBeTruthy()
    })
  })

  describe('verifyTransaction', ()=> {
    it('computes and verifies the hash of the transaction', () => {
      const wallet = new Wallet('AdVSe37niA3uFUPgCgMUH2tMsHF4LpLoiX')
      const transaction = {
        type: 0,
        amount: 1000,
        fee: 2000,
        recipientId: 'AJWRd23HNEhPLkK1ymMnwnDBX2a7QBZqff',
        timestamp: 141738,
        asset: {},
        senderPublicKey: '5d036a858ce89f844491762eb89e2bfbd50a4a0a0da658e4b2628b25b117ae09',
        signature: '618a54975212ead93df8c881655c625544bce8ed7ccdfe6f08a42eecfb1adebd051307be5014bb051617baf7815d50f62129e70918190361e5d4dd4796541b0a', // eslint-disable-line max-len
      }
      const hash = cryptoBuilder.getHash(transaction)
      const publicKey = '036928c98ee53a1f52ed01dd87db10ffe1980eb47cd7c0a7d688321f47b5d7d760'

      wallet.verifyTransaction(transaction, wallet.signature, publicKey)
      expect(verifyHashMock).toHaveBeenCalledWith(hash, wallet.signature, publicKey)
    })
  })
})
