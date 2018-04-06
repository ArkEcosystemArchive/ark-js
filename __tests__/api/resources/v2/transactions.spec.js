import Ark from '@/'
import network from '@/networks/ark/devnet'
import ApiResource from '@/api/resources/v2/transactions'
require('../mocks')

let resource

beforeEach(() => {
  const ark = new Ark(network)
  resource = ark.getClient('https://localhost:4003/').resource('transactions')
})

describe('API - Resources - Transactions', () => {
  test('should be instantiated', () => {
    expect(resource).toBeInstanceOf(ApiResource)
  })

  test('should call "all" method', async () => {
    const response = await resource.all()
    await expect(response.status).toBe(200)
  })

  test('should call "create" method', async () => {
    const response = await resource.create()
    await expect(response.status).toBe(200)
  })

  test('should call "get" method', async () => {
    const response = await resource.get('123')
    await expect(response.status).toBe(200)
  })

  test('should call "allUnconfirmed" method', async () => {
    const response = await resource.allUnconfirmed()
    await expect(response.status).toBe(200)
  })

  test('should call "getUnconfirmed" method', async () => {
    const response = await resource.getUnconfirmed('123')
    await expect(response.status).toBe(200)
  })

  test('should call "search" method', async () => {
    const response = await resource.search({})
    await expect(response.status).toBe(200)
  })

  test('should call "types" method', async () => {
    const response = await resource.types()
    await expect(response.status).toBe(200)
  })
})
