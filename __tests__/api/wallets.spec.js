import Ark from '../../src'
import network from '../../src/networks/mainnet'
import ApiResource from '../../src/api/resources/wallets'

let resource

beforeEach(() => {
  const ark = new Ark(network)
  resource = ark.getClient('https://localhost:4003/').resource('wallets')
})

test('wallets resource can be instantiated', () => {
  expect(resource).toBeInstanceOf(ApiResource)
})

test('wallets resource can call "all" method', () => {
  expect(resource.all()).toBeInstanceOf(Promise)
})

test('wallets resource can call "top" method', () => {
  expect(resource.top()).toBeInstanceOf(Promise)
})

test('wallets resource can call "get" method', () => {
  expect(resource.get('id')).toBeInstanceOf(Promise)
})

test('wallets resource can call "transactions" method', () => {
  expect(resource.transactions('id')).toBeInstanceOf(Promise)
})

test('wallets resource can call "transactionsSent" method', () => {
  expect(resource.transactionsSent('id')).toBeInstanceOf(Promise)
})

test('wallets resource can call "transactionsReceived" method', () => {
  expect(resource.transactionsReceived('id')).toBeInstanceOf(Promise)
})

test('wallets resource can call "votes" method', () => {
  expect(resource.votes('id')).toBeInstanceOf(Promise)
})

test('wallets resource can call "search" method', () => {
  expect(resource.search({})).toBeInstanceOf(Promise)
})
