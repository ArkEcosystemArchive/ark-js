import feeManager from '@/managers/fee'
import configManager from '@/managers/config'
import cryptoBuilder from '@/builder/crypto'
import slots from '@/crypto/slots'
import Transaction from '@/builder/transaction'
import Model from '@/models/transaction'
import { TRANSACTION_TYPES } from '@/constants'

export default class DelegateResignation extends Transaction {
  /**
   * @constructor
   */
  constructor () {
    super()

    this.model = Model

    this.id = null
    this.type = TRANSACTION_TYPES.DELEGATE_RESIGNATION
    this.fee = feeManager.get(TRANSACTION_TYPES.DELEGATE_RESIGNATION)
    this.timestamp = slots.getTime()
    this.version = 0x02
    this.network = configManager.get('pubKeyHash')
  }
}
