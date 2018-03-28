import Ark from '../../../src'
import network from '../../../src/networks/mainnet'
import ApiResource from '../../../src/api/resources/transactions'
require('../mocks')

let resource

beforeEach(() => {
  const ark = new Ark(network)
  resource = ark.getClient('https://localhost:4003/').resource('transactions')
})

test('transactions resource can be instantiated', () => {
  expect(resource).toBeInstanceOf(ApiResource)
})

test('transactions resource can call "all" method', async () => {
  const response = await resource.all()
  await expect(response.status).toBe(200)
})

test('transactions resource can call "create" method', async () => {
  const response = await resource.create()
  await expect(response.status).toBe(200)
})

test('transactions resource can call "get" method', async () => {
  const response = await resource.get('123')
  await expect(response.status).toBe(200)
})

test('transactions resource can call "allUnconfirmed" method', async () => {
  const response = await resource.allUnconfirmed()
  await expect(response.status).toBe(200)
})

test('transactions resource can call "getUnconfirmed" method', async () => {
  const response = await resource.getUnconfirmed('123')
  await expect(response.status).toBe(200)
})

test('transactions resource can call "search" method', async () => {
  const response = await resource.search({})
  await expect(response.status).toBe(200)
})

test('transactions resource can call "types" method', async () => {
  const response = await resource.types()
  await expect(response.status).toBe(200)
})
