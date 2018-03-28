import Ark from '../../../src'
import network from '../../../src/networks/mainnet'
import ApiResource from '../../../src/api/resources/statistics'

let resource

beforeEach(() => {
  const ark = new Ark(network)
  resource = ark.getClient('https://localhost:4003/').resource('statistics')
})

test('statistics resource can be instantiated', () => {
  expect(resource).toBeInstanceOf(ApiResource)
})

test('statistics resource can call "blockchain" method', () => {
  expect(resource.blockchain()).toBeInstanceOf(Promise)
})

test('statistics resource can call "transactions" method', () => {
  expect(resource.transactions()).toBeInstanceOf(Promise)
})

test('statistics resource can call "blocks" method', () => {
  expect(resource.blocks()).toBeInstanceOf(Promise)
})

test('statistics resource can call "votes" method', () => {
  expect(resource.votes()).toBeInstanceOf(Promise)
})

test('statistics resource can call "unvotes" method', () => {
  expect(resource.unvotes()).toBeInstanceOf(Promise)
})
