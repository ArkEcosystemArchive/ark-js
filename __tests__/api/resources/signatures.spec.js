import Ark from '@/'
import network from '@/networks/ark/devnet'
import ApiResource from '@/api/resources/signatures'
require('../mocks')

let resource

beforeEach(() => {
  const ark = new Ark(network)
  resource = ark.getClient('https://localhost:4003/').resource('signatures')
})

describe('API - Resources - Signatures', () => {
  test('should be instantiated', () => {
    expect(resource).toBeInstanceOf(ApiResource)
  })

  test('should call "all" method', async () => {
    const response = await resource.all()
    await expect(response.status).toBe(200)
  })
})
