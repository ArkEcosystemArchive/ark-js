import Ark from '../../../src'
import network from '../../../src/networks/mainnet'
import ApiResource from '../../../src/api/resources/statistics'
import Server from './utils/server'

let resource

beforeEach(() => {
  const ark = new Ark(network)
  resource = ark.getClient('https://localhost:4003/').resource('statistics')
})

test('statistics resource can be instantiated', () => {
  expect(resource).toBeInstanceOf(ApiResource)
})

test('statistics resource can call "blockchain" method', async () => {
  const response = await resource.blockchain()
  await expect(response.status).toBe(200)
})

test('statistics resource can call "transactions" method', async () => {
  const response = await resource.transactions()
  await expect(response.status).toBe(200)
})

test('statistics resource can call "blocks" method', async () => {
  const response = await resource.blocks()
  await expect(response.status).toBe(200)
})

test('statistics resource can call "votes" method', async () => {
  const response = await resource.votes()
  await expect(response.status).toBe(200)
})

test('statistics resource can call "unvotes" method', async () => {
  const response = await resource.unvotes()
  await expect(response.status).toBe(200)
})
