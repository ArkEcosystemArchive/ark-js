import Ark from '../../../src'
import network from '../../../src/networks/mainnet'
import ApiResource from '../../../src/api/resources/signatures'

let resource

beforeEach(() => {
  const ark = new Ark(network)
  resource = ark.getClient('https://localhost:4003/').resource('signatures')
})

test('signatures resource can be instantiated', () => {
  expect(resource).toBeInstanceOf(ApiResource)
})

test('signatures resource can call "all" method', () => {
  expect(resource.all()).toBeInstanceOf(Promise)
})
