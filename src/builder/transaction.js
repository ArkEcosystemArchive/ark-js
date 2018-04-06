export default class Transaction {
  /**
   * [setFee description]
   * @param {[type]} value [description]
   */
  setFee (value) {
    this.fee = value
    return this
  }

  /**
   * [setAmount description]
   * @param {[type]} value [description]
   */
  setAmount (value) {
    this.amount = value
    return this
  }

  /**
   * [setRecipientId description]
   * @param {[type]} value [description]
   */
  setRecipientId (value) {
    this.recipientId = value
    return this
  }

  /**
   * [setSenderPublicKey description]
   * @param {[type]} value [description]
   */
  setSenderPublicKey (value) {
    this.senderPublicKey = value
    return this
  }

  /**
   * [verify description]
   * @return {[type]} [description]
   */
  verify () {
    return cryptoBuilder.verify(this)
  }

  /**
   * [serialise description]
   * @return {[type]} [description]
   */
  serialise () {
    return this.model.serialise(this.getStruct())
  }
}
