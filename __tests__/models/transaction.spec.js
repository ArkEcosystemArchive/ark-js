const Transaction = require('@/models/transaction')
const builder = require('@/builder')
const Crypto = require('@/builder/crypto')
const txdata = require('./fixtures/transaction')

const createRandomTx = type => {
  switch (type) {
    case 0: // transfer
      return builder.transaction(
        'AMw3TiLrmVmwmFVwRzn96kkUsUpFTqsAEX',
        ~~(Math.random() * Math.pow(10, 10)),
        Math.random().toString(36),
        Math.random().toString(36),
        Math.random().toString(36)
      )
    case 1: // second signature
      return builder.signature(Math.random().toString(36), Math.random().toString(36))
    case 2: // delegate registration
      return builder.delegate(Math.random().toString(36), Math.random().toString(12))
    case 3: // vote registration
      return builder.vote(Math.random().toString(36), ['+036928c98ee53a1f52ed01dd87db10ffe1980eb47cd7c0a7d688321f47b5d7d760'])
    case 4: // multisignature registration
      const ECkeys = [1, 2, 3].map(() => Crypto.getKeys(Math.random().toString(36)))
      const tx = builder.multisignature(Math.random().toString(36), '', ECkeys.map(k => k.publicKey), 48, 2)
      const hash = Crypto.getHash(tx, true, true)
      tx.signatures = ECkeys.slice(1).map(k =>
        k
          .sign(hash)
          .toDER()
          .toString('hex')
      )
      console.log(tx)
      return tx
    default:
      return null
  }
}

describe('Models - Transaction', () => {
  describe('static fromBytes', () => {
    it('returns a new transaction', () => {
      ;[0, 1, 2, 3, 4]
        .map(type => createRandomTx(type))
        .map(tx => {
          tx.network = 0x17
          return tx
        })
        .map(tx => Transaction.serialize(tx).toString('hex'))
        .map(tx => {
          console.log(tx)
          return tx
        })
        .map(serialized => Transaction.fromBytes(serialized))
        .forEach(tx => console.log(JSON.stringify(tx)))

      let hex = Transaction.serialize(txdata).toString('hex')
      let tx = Transaction.fromBytes(hex)

      expect(tx).toBeInstanceOf(Transaction)
      expect(tx.data).toEqual(txdata)
    })
  })

  test('static deserialize', () => {})

  test('serialize', () => {})
})
