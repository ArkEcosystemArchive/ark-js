import transactionBuilder from '@/builder'
import ApiClient from '@/api'
import network from '@/networks/devnet'

describe('Builder', () => {
  test('should be instantiated', () => {
    expect(transactionBuilder).toBeInstanceOf(Object)
  })
})
