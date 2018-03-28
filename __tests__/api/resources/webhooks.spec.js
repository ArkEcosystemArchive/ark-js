import Ark from '../../../src'
import network from '../../../src/networks/mainnet'
import ApiResource from '../../../src/api/resources/webhooks'
require('./mock')

let resource

beforeEach(() => {
  const ark = new Ark(network)
  resource = ark.getClient('https://localhost:4003/').resource('webhooks')
})

test('webhooks resource can be instantiated', () => {
  expect(resource).toBeInstanceOf(ApiResource)
})

test('webhooks resource can call "all" method', async () => {
  const response = await resource.all()
  await expect(response.status).toBe(200)
})

test('webhooks resource can call "create" method', async () => {
  const response = await resource.create()
  await expect(response.status).toBe(200)
})

test('webhooks resource can call "get" method', async () => {
  const response = await resource.get('123')
  await expect(response.status).toBe(200)
})

test('webhooks resource can call "update" method', async () => {
  const response = await resource.update('123')
  await expect(response.status).toBe(200)
})

test('webhooks resource can call "delete" method', async () => {
  const response = await resource.delete('123')
  await expect(response.status).toBe(200)
})

test('webhooks resource can call "events" method', async () => {
  const response = await resource.events()
  await expect(response.status).toBe(200)
})
