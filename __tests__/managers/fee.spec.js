import FeeManager from '@/managers/fee'
import { TRANSACTION_TYPES } from '@/constants'

describe('Fee Manager', () => {
  it('should be instantiated', () => {
    expect(FeeManager).toBeInstanceOf(Object)
  })

  it('should set the fee', () => {
    FeeManager.set(TRANSACTION_TYPES.TRANSFER, 1)

    expect(FeeManager.get(TRANSACTION_TYPES.TRANSFER)).toEqual(1)
  })
})
