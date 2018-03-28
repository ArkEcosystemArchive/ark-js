import Ark from '../../../src'
import network from '../../../src/networks/mainnet'
import ApiResource from '../../../src/api/resources/loader'
require('./mock')

let resource

beforeEach(() => {
  const ark = new Ark(network)
  resource = ark.getClient('https://localhost:4003/').resource('loader')
})

test('loader resource can be instantiated', () => {
  expect(resource).toBeInstanceOf(ApiResource)
})

test('loader resource can call "status" method', async () => {
  const response = await resource.status()
  await expect(response.status).toBe(200)
})

test('loader resource can call "syncing" method', async () => {
  const response = await resource.syncing()
  await expect(response.status).toBe(200)
})

test('loader resource can call "configuration" method', async () => {
  const response = await resource.configuration()
  await expect(response.status).toBe(200)
})
