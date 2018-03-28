import Ark from '../../../src'
import network from '../../../src/networks/mainnet'
import ApiResource from '../../../src/api/resources/peers'
require('../mocks')

let resource

beforeEach(() => {
  const ark = new Ark(network)
  resource = ark.getClient('https://localhost:4003/').resource('peers')
})

test('peers resource can be instantiated', () => {
  expect(resource).toBeInstanceOf(ApiResource)
})

test('peers resource can call "all" method', async () => {
  const response = await resource.all()
  await expect(response.status).toBe(200)
})

test('peers resource can call "get" method', async () => {
  const response = await resource.get('123')
  await expect(response.status).toBe(200)
})
