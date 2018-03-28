import Ark from '../src'
import ApiClient from '../src/api'
import network from '../src/networks/mainnet'

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
