import Ark from '@/'
import network from '@/networks/ark/devnet'
import HttpClient from '@/api/http'

let client

beforeEach(() => {
  const ark = new Ark(network)
  client = ark.getClient('http://httpbin.org').getConnection()
})

describe('API - HTTP Client', () => {
  test('should be instantiated', () => {
    expect(client).toBeInstanceOf(HttpClient)
  })

  test('should send GET request', async () => {
    const response = await client.get('get')
    await expect(response.status).toBe(200)
  })

  test('should send POST request', async () => {
    const response = await client.post('post')
    await expect(response.status).toBe(200)
  })

  test('should send PUT request', async () => {
    const response = await client.put('put')
    await expect(response.status).toBe(200)
  })

  test('should send PATCH request', async () => {
    const response = await client.patch('patch')
    await expect(response.status).toBe(200)
  })

  test('should send DELETE request', async () => {
    const response = await client.delete('delete')
    await expect(response.status).toBe(200)
  })
})
