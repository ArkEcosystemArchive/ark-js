export default class Transaction {
  setFee (value) {
    this.fee = value
    return this
  }

  setAmount (value) {
    this.amount = value
    return this
  }

  setRecipientId (value) {
    this.recipientId = value
    return this
  }

  setSenderPublicKey (value) {
    this.senderPublicKey = value
    return this
  }
}
