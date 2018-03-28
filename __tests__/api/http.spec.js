import Ark from '../../src'
import network from '../../src/networks/mainnet'
import HttpClient from '../../src/api/http'

let client

beforeEach(() => {
  const ark = new Ark(network)
  client = ark.getClient('http://httpbin.org').getConnection()
})

test('http client can be instantiated', () => {
  expect(client).toBeInstanceOf(HttpClient)
})

test('http client can send GET request', async () => {
  const response = await client.get('get')
  await expect(response.status).toBe(200)
})

test('http client can send POST request', async () => {
  const response = await client.post('post')
  await expect(response.status).toBe(200)
})

test('http client can send PUT request', async () => {
  const response = await client.put('put')
  await expect(response.status).toBe(200)
})

test('http client can send PATCH request', async () => {
  const response = await client.patch('patch')
  await expect(response.status).toBe(200)
})

test('http client can send DELETE request', async () => {
  const response = await client.delete('delete')
  await expect(response.status).toBe(200)
})
