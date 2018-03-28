import Ark from '../../src'
import network from '../../src/networks/mainnet'
import ApiResource from '../../src/api/resources/transactions'

let resource

beforeEach(() => {
  const ark = new Ark(network)
  resource = ark.getClient('https://localhost:4003/').resource('transactions')
})

test('transactions resource can be instantiated', () => {
  expect(resource).toBeInstanceOf(ApiResource)
})

test('transactions resource can call "all" method', () => {
  expect(resource.all()).toBeInstanceOf(Promise)
})

test('transactions resource can call "create" method', () => {
  expect(resource.create()).toBeInstanceOf(Promise)
})

test('transactions resource can call "get" method', () => {
  expect(resource.get('id')).toBeInstanceOf(Promise)
})

test('transactions resource can call "allUnconfirmed" method', () => {
  expect(resource.allUnconfirmed()).toBeInstanceOf(Promise)
})

test('transactions resource can call "getUnconfirmed" method', () => {
  expect(resource.getUnconfirmed('id')).toBeInstanceOf(Promise)
})

test('transactions resource can call "search" method', () => {
  expect(resource.search({})).toBeInstanceOf(Promise)
})

test('transactions resource can call "types" method', () => {
  expect(resource.types()).toBeInstanceOf(Promise)
})
