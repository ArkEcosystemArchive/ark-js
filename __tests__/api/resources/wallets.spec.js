import Ark from '../../../src'
import network from '../../../src/networks/mainnet'
import ApiResource from '../../../src/api/resources/wallets'
require('./mock')

let resource

beforeEach(() => {
  const ark = new Ark(network)
  resource = ark.getClient('https://localhost:4003/').resource('wallets')
})

test('wallets resource can be instantiated', () => {
  expect(resource).toBeInstanceOf(ApiResource)
})

test('wallets resource can call "all" method', async () => {
  const response = await resource.all()
  await expect(response.status).toBe(200)
})

test('wallets resource can call "top" method', async () => {
  const response = await resource.top()
  await expect(response.status).toBe(200)
})

test('wallets resource can call "get" method', async () => {
  const response = await resource.get('123')
  await expect(response.status).toBe(200)
})

test('wallets resource can call "transactions" method', async () => {
  const response = await resource.transactions('123')
  await expect(response.status).toBe(200)
})

test('wallets resource can call "transactionsSent" method', async () => {
  const response = await resource.transactionsSent('123')
  await expect(response.status).toBe(200)
})

test('wallets resource can call "transactionsReceived" method', async () => {
  const response = await resource.transactionsReceived('123')
  await expect(response.status).toBe(200)
})

test('wallets resource can call "votes" method', async () => {
  const response = await resource.votes('123')
  await expect(response.status).toBe(200)
})

test('wallets resource can call "search" method', async () => {
  const response = await resource.search({})
  await expect(response.status).toBe(200)
})
