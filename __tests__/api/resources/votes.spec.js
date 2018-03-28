import Ark from '../../../src'
import network from '../../../src/networks/mainnet'
import ApiResource from '../../../src/api/resources/votes'
require('../mocks')

let resource

beforeEach(() => {
  const ark = new Ark(network)
  resource = ark.getClient('https://localhost:4003/').resource('votes')
})

describe('API - Resources - Voters', () => {
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
})
