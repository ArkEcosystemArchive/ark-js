import Ark from '../../src'
import network from '../../src/networks/mainnet'
import ApiClient from '../../src/api'
import HttpClient from '../../src/api/http'
import ApiResource from '../../src/api/resources/transactions'

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
