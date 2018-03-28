import Ark from '../../src'
import network from '../../src/networks/mainnet'
import ApiResource from '../../src/api/resources/peers'

let resource

beforeEach(() => {
  const ark = new Ark(network)
  resource = ark.getClient('https://localhost:4003/').resource('peers')
})

test('peers resource can be instantiated', () => {
  expect(resource).toBeInstanceOf(ApiResource)
})

test('peers resource can call "all" method', () => {
  expect(resource.all()).toBeInstanceOf(Promise)
})

test('peers resource can call "get" method', () => {
  expect(resource.get('id')).toBeInstanceOf(Promise)
})
