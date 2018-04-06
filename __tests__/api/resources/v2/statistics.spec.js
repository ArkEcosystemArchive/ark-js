import Ark from '@/'
import network from '@/networks/ark/devnet'
import ApiResource from '@/api/resources/v2/statistics'
require('../mocks')

let resource

beforeEach(() => {
  const ark = new Ark(network)
  resource = ark.getClient('https://localhost:4003/').resource('statistics')
})

describe('API - Resources - Statistics', () => {
  test('should be instantiated', () => {
    expect(resource).toBeInstanceOf(ApiResource)
  })

  test('should call "blockchain" method', async () => {
    const response = await resource.blockchain()
    await expect(response.status).toBe(200)
  })

  test('should call "transactions" method', async () => {
    const response = await resource.transactions()
    await expect(response.status).toBe(200)
  })

  test('should call "blocks" method', async () => {
    const response = await resource.blocks()
    await expect(response.status).toBe(200)
  })

  test('should call "votes" method', async () => {
    const response = await resource.votes()
    await expect(response.status).toBe(200)
  })

  test('should call "unvotes" method', async () => {
    const response = await resource.unvotes()
    await expect(response.status).toBe(200)
  })
})
