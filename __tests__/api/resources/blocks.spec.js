import Ark from '../../../src'
import network from '../../../src/networks/mainnet'
import ApiResource from '../../../src/api/resources/blocks'

let resource

beforeEach(() => {
  const ark = new Ark(network)
  resource = ark.getClient('https://localhost:4003/').resource('blocks')
})

test('blocks resource can be instantiated', () => {
  expect(resource).toBeInstanceOf(ApiResource)
})

test('blocks resource can call "all" method', () => {
  expect(resource.all()).toBeInstanceOf(Promise)
})

test('blocks resource can call "get" method', () => {
  expect(resource.get('id')).toBeInstanceOf(Promise)
})

test('blocks resource can call "transactions" method', () => {
  expect(resource.transactions('id')).toBeInstanceOf(Promise)
})

test('blocks resource can call "search" method', () => {
  expect(resource.search({})).toBeInstanceOf(Promise)
})
