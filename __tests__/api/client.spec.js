import Ark from '@/'
import network from '@/networks/devnet'
import ApiClient from '@/api'
import HttpClient from '@/api/http'
import ApiResource from '@/api/resources/transactions'

let client

beforeEach(() => {
  const ark = new Ark(network)
  client = ark.getClient('https://localhost:4003/')
})

describe('API - Client', () => {
  test('should be instantiated', () => {
    expect(client).toBeInstanceOf(ApiClient)
  })

  test('should set connection', () => {
    expect(client.http).toBeInstanceOf(HttpClient)
  })

  test('returns resource', () => {
    expect(client.resource('transactions')).toBeInstanceOf(ApiResource)
  })
})
