const path = require('path')

exports.ARKTOSHI = Math.pow(10, 8)

exports.TRANSACTION_TYPES = Object.freeze({
  TRANSFER: 0,
  SECOND_SIGNATURE: 1,
  DELEGATE: 2,
  VOTE: 3,
  MULTI_SIGNATURE: 4,
  IPFS: 5,
  TIMELOCK_TRANSFER: 6,
  MULTI_PAYMENT: 7,
  DELEGATE_RESIGNATION: 8
})

exports.CONFIGURATIONS = Object.freeze({
  ARK: {
    MAINNET: path.resolve(__dirname, 'networks/ark/mainnet.json'),
    DEVNET: path.resolve(__dirname, 'networks/ark/devnet.json')
  }
})
