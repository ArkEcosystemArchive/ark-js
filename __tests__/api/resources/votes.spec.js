import Ark from '../../../src'
import network from '../../../src/networks/mainnet'
import ApiResource from '../../../src/api/resources/votes'
import Server from './utils/server'

let resource

beforeEach(() => {
  const ark = new Ark(network)
  resource = ark.getClient('https://localhost:4003/').resource('votes')
})

test('votes resource can be instantiated', () => {
  expect(resource).toBeInstanceOf(ApiResource)
})

test('votes resource can call "all" method', async () => {
  const response = await resource.all()
  await expect(response.status).toBe(200)
})

test('votes resource can call "get" method', async () => {
  const response = await resource.get('123')
  await expect(response.status).toBe(200)
})
