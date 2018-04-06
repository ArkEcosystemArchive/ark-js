import Ark from '@/'
import network from '@/networks/ark/devnet'
import ApiResource from '@/api/resources/v2/multisignatures'
require('../mocks')

let resource

beforeEach(() => {
  const ark = new Ark(network)
  resource = ark.getClient('https://localhost:4003/').resource('multisignatures')
})

describe('API - Resources - MultiSignatures', () => {
  test('should be instantiated', () => {
    expect(resource).toBeInstanceOf(ApiResource)
  })

  test('should call "all" method', async () => {
    const response = await resource.all()
    await expect(response.status).toBe(200)
  })

  test('should call "pending" method', async () => {
    const response = await resource.pending()
    await expect(response.status).toBe(200)
  })

  test('should call "wallets" method', async () => {
    const response = await resource.wallets()
    await expect(response.status).toBe(200)
  })
})
