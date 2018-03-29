import Ark from '@/'
import network from '@/networks/devnet'
import ApiResource from '@/api/resources/loader'
require('../mocks')

let resource

beforeEach(() => {
  const ark = new Ark(network)
  resource = ark.getClient('https://localhost:4003/').resource('loader')
})

describe('API - Resources - Loader', () => {
  test('should be instantiated', () => {
    expect(resource).toBeInstanceOf(ApiResource)
  })

  test('should call "status" method', async () => {
    const response = await resource.status()
    await expect(response.status).toBe(200)
  })

  test('should call "syncing" method', async () => {
    const response = await resource.syncing()
    await expect(response.status).toBe(200)
  })

  test('should call "configuration" method', async () => {
    const response = await resource.configuration()
    await expect(response.status).toBe(200)
  })
})
