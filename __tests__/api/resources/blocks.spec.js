import Ark from '../../../src'
import network from '../../../src/networks/mainnet'
import ApiResource from '../../../src/api/resources/blocks'
require('./mock')

let resource

beforeEach(() => {
  const ark = new Ark(network)
  resource = ark.getClient('https://localhost:4003/').resource('blocks')
})

test('blocks resource can be instantiated', () => {
  expect(resource).toBeInstanceOf(ApiResource)
})

test('blocks resource can call "all" method', async () => {
  const response = await resource.all()
  await expect(response.status).toBe(200)
})

test('blocks resource can call "get" method', async () => {
  const response = await resource.get('123')
  await expect(response.status).toBe(200)
})

test('blocks resource can call "transactions" method', async () => {
  const response = await resource.transactions('123')
  await expect(response.status).toBe(200)
})

test('blocks resource can call "search" method', async () => {
  const response = await resource.search({})
  await expect(response.status).toBe(200)
})
