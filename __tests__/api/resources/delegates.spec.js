import Ark from '../../../src'
import network from '../../../src/networks/mainnet'
import ApiResource from '../../../src/api/resources/delegates'
require('../mocks')

let resource

beforeEach(() => {
  const ark = new Ark(network)
  resource = ark.getClient('https://localhost:4003/').resource('delegates')
})

describe('API - Resources - Delegates', () => {
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

  test('should call "blocks" method', async () => {
    const response = await resource.blocks('123')
    await expect(response.status).toBe(200)
  })

  test('should call "voters" method', async () => {
    const response = await resource.voters('123')
    await expect(response.status).toBe(200)
  })
})
