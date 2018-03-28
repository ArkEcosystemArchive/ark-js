import Ark from '../../../src'
import network from '../../../src/networks/mainnet'
import ApiResource from '../../../src/api/resources/multisignatures'
import Server from './utils/server'

let resource

beforeEach(() => {
  const ark = new Ark(network)
  resource = ark.getClient('https://localhost:4003/').resource('multisignatures')
})

test('multisignatures resource can be instantiated', () => {
  expect(resource).toBeInstanceOf(ApiResource)
})

test('multisignatures resource can call "all" method', async () => {
  const response = await resource.all()
  await expect(response.status).toBe(200)
})

test('multisignatures resource can call "pending" method', async () => {
  const response = await resource.pending()
  await expect(response.status).toBe(200)
})

test('multisignatures resource can call "wallets" method', async () => {
  const response = await resource.wallets()
  await expect(response.status).toBe(200)
})
