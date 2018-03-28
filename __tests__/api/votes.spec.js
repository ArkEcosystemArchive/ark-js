import Ark from '../../src'
import network from '../../src/networks/mainnet'
import ApiResource from '../../src/api/resources/votes'

let resource

beforeEach(() => {
  const ark = new Ark(network)
  resource = ark.getClient('https://localhost:4003/').resource('votes')
})

test('votes resource can be instantiated', () => {
  expect(resource).toBeInstanceOf(ApiResource)
})

test('votes resource can call "all" method', () => {
  expect(resource.all()).toBeInstanceOf(Promise)
})

test('votes resource can call "get" method', () => {
  expect(resource.get('id')).toBeInstanceOf(Promise)
})
