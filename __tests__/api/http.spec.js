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

test('http client can send GET request', () => {
  expect(client.get('get')).toBeInstanceOf(Promise)
})

test('http client can send POST request', () => {
  expect(client.post('post')).toBeInstanceOf(Promise)
})

test('http client can send PUT request', () => {
  expect(client.put('put')).toBeInstanceOf(Promise)
})

test('http client can send PATCH request', () => {
  expect(client.patch('patch')).toBeInstanceOf(Promise)
})

test('http client can send DELETE request', () => {
  expect(client.delete('delete')).toBeInstanceOf(Promise)
})
