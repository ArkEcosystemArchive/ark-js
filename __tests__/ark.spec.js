import Ark from '@/'
import ApiClient from '@/api'
import network from '@/networks/mainnet'

let ark
beforeEach(() => (ark = new Ark(network)))

describe('Ark', () => {
  test('should be instantiated', () => {
    expect(ark).toBeInstanceOf(Ark)
  })

  test('returns an api client', () => {
    const client = ark.getClient('https://localhost:4003/')

    expect(client).toBeInstanceOf(ApiClient)
  })
})
