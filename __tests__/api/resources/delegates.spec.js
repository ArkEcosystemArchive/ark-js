import Ark from '../../../src'
import network from '../../../src/networks/mainnet'
import ApiResource from '../../../src/api/resources/delegates'
require('./mock')

let resource

beforeEach(() => {
  const ark = new Ark(network)
  resource = ark.getClient('https://localhost:4003/').resource('delegates')
})

test('delegates resource can be instantiated', () => {
  expect(resource).toBeInstanceOf(ApiResource)
})

test('delegates resource can call "all" method', async () => {
  const response = await resource.all()
  await expect(response.status).toBe(200)
})

test('delegates resource can call "get" method', async () => {
  const response = await resource.get('123')
  await expect(response.status).toBe(200)
})

test('delegates resource can call "blocks" method', async () => {
  const response = await resource.blocks('123')
  await expect(response.status).toBe(200)
})

test('delegates resource can call "voters" method', async () => {
  const response = await resource.voters('123')
  await expect(response.status).toBe(200)
})
