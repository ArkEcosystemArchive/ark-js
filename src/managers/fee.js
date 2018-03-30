import { TRANSACTION_TYPES } from '@/constants'

class FeeManager {
  constructor () {
    this.fees = {}
  }

  set (type, value) {
    if (!this._validType(type)) {
      throw new Error('Invalid transaction type.')
    }

    this.fees[type] = value
  }

  get (type, value) {
    return this.fees[type]
  }

  _validType (type) {
    return Object.values(TRANSACTION_TYPES).indexOf(type) > -1
  }
}

export default new FeeManager()
