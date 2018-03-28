import Ark from '../../src'
import network from '../../src/networks/mainnet'
import ApiResource from '../../src/api/resources/multisignatures'

let resource

beforeEach(() => {
  const ark = new Ark(network)
  resource = ark.getClient('https://localhost:4003/').resource('multisignatures')
})

test('multisignatures resource can be instantiated', () => {
  expect(resource).toBeInstanceOf(ApiResource)
})

test('multisignatures resource can call "all" method', () => {
  expect(resource.all()).toBeInstanceOf(Promise)
})

test('multisignatures resource can call "pending" method', () => {
  expect(resource.pending()).toBeInstanceOf(Promise)
})

test('multisignatures resource can call "wallets" method', () => {
  expect(resource.wallets()).toBeInstanceOf(Promise)
})
