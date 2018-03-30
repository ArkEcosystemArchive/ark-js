import Ark from '@/'
import network from '@/networks/ark/devnet'
import ApiResource from '@/api/resources/blocks'
require('../mocks')

let resource

beforeEach(() => {
  const ark = new Ark(network)
  resource = ark.getClient('https://localhost:4003/').resource('blocks')
})

describe('API - Resources - Blocks', () => {
  test('should be instantiated', () => {
    expect(resource).toBeInstanceOf(ApiResource)
  })

  test('should call "all" method', async () => {
    const response = await resource.all()
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

  test('should call "search" method', async () => {
    const response = await resource.search({})
    await expect(response.status).toBe(200)
  })
})
