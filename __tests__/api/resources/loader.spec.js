import Ark from '../../../src'
import network from '../../../src/networks/mainnet'
import ApiResource from '../../../src/api/resources/loader'

let resource

beforeEach(() => {
  const ark = new Ark(network)
  resource = ark.getClient('https://localhost:4003/').resource('loader')
})

test('loader resource can be instantiated', () => {
  expect(resource).toBeInstanceOf(ApiResource)
})

test('loader resource can call "status" method', () => {
  expect(resource.status()).toBeInstanceOf(Promise)
})

test('loader resource can call "syncing" method', () => {
  expect(resource.syncing()).toBeInstanceOf(Promise)
})

test('loader resource can call "configuration" method', () => {
  expect(resource.configuration()).toBeInstanceOf(Promise)
})
