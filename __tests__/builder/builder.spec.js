import transactionBuilder from '@/builder'
import ApiClient from '@/api'
import network from '@/networks/ark/devnet'

describe('Builder', () => {
  test('should be instantiated', () => {
    expect(transactionBuilder).toBeInstanceOf(Object)
  })
})
