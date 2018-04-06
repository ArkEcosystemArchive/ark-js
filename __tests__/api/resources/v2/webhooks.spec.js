import Ark from '@/'
import network from '@/networks/ark/devnet'
import ApiResource from '@/api/resources/v2/webhooks'
require('../mocks')

let resource

beforeEach(() => {
  const ark = new Ark(network)
  resource = ark.getClient('https://localhost:4003/').resource('webhooks')
})

describe('API - Resources - Blocks', () => {
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

  test('should call "update" method', async () => {
    const response = await resource.update('123')
    await expect(response.status).toBe(200)
  })

  test('should call "delete" method', async () => {
    const response = await resource.delete('123')
    await expect(response.status).toBe(200)
  })

  test('should call "events" method', async () => {
    const response = await resource.events()
    await expect(response.status).toBe(200)
  })
})
