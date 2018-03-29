import Ark from '@/'
import network from '@/networks/devnet'
import ApiResource from '@/api/resources/wallets'
require('../mocks')

let resource

beforeEach(() => {
  const ark = new Ark(network)
  resource = ark.getClient('https://localhost:4003/').resource('wallets')
})

describe('API - Resources - Webhooks', () => {
  test('should be instantiated', () => {
    expect(resource).toBeInstanceOf(ApiResource)
  })

  test('should call "all" method', async () => {
    const response = await resource.all()
    await expect(response.status).toBe(200)
  })

  test('should call "top" method', async () => {
    const response = await resource.top()
    await expect(response.status).toBe(200)
  })

  test('should call "get" method', async () => {
    const response = await resource.get('123')
    await expect(response.status).toBe(200)
  })

  test('should call "transactions" method', async () => {
    const response = await resource.transactions('123')
    await expect(response.status).toBe(200)
  })

  test('should call "transactionsSent" method', async () => {
    const response = await resource.transactionsSent('123')
    await expect(response.status).toBe(200)
  })

  test('should call "transactionsReceived" method', async () => {
    const response = await resource.transactionsReceived('123')
    await expect(response.status).toBe(200)
  })

  test('should call "votes" method', async () => {
    const response = await resource.votes('123')
    await expect(response.status).toBe(200)
  })

  test('should call "search" method', async () => {
    const response = await resource.search({})
    await expect(response.status).toBe(200)
  })
})
