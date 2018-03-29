import Builder from '@/builder'
import ApiClient from '@/api'
import network from '@/networks/devnet'

let builder
beforeEach(() => (builder = new Builder()))

describe('Builder', () => {
  test('should be instantiated', () => {
    expect(builder).toBeInstanceOf(Builder)
  })
})
