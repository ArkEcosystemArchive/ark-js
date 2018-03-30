import assert from 'assert'
import bigi from 'bigi'
import crypto from '@/crypto'
import ECPair from '@/crypto/ecpair'

import configManager from '@/managers/config'
import network from '@/networks/ark/mainnet'

beforeEach(() => configManager.setConfig(network))

describe('Basic Crypto', () => {
  it('can generate a random ark address', () => {
    const keyPair = ECPair.makeRandom({
        rng: () => new Buffer('zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz')
    })

    assert.strictEqual(keyPair.getAddress(), 'ANoMWEJ9jSdE2FgohBLLXeLzci59BDFsP4')
  })

  it('can generate an address from a SHA256 hash', () => {
    const hash = crypto.sha256('correct horse battery staple')
    const keyPair = new ECPair(bigi.fromBuffer(hash))

    assert.strictEqual(keyPair.getAddress(), 'AG5AtmiNbgv51eLwAWnRGvkMudVd7anYP2')
  })

  it('can generate a random keypair for alternative networks', () => {
    const keyPair = ECPair.makeRandom({
      network,
      rng: () => new Buffer('zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz')
    })

    assert.strictEqual(keyPair.getAddress(), 'ANoMWEJ9jSdE2FgohBLLXeLzci59BDFsP4')
    assert.strictEqual(keyPair.toWIF(), 'SDgGxWHHQHnpm5sth7MBUoeSw7V7nbimJ1RBU587xkryTh4qe9ov')
  })

  it('can import an address via WIF', () => {
    const keyPair = ECPair.fromWIF('SDgGxWHHQHnpm5sth7MBUoeSw7V7nbimJ1RBU587xkryTh4qe9ov')

    assert.strictEqual(keyPair.getAddress(), 'ANoMWEJ9jSdE2FgohBLLXeLzci59BDFsP4')
  })
})
