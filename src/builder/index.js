export default class Builder {
  delegateResignation () {
    return this.getTransaction('delegate-resignation')
  }

  delegate () {
    return this.getTransaction('delegate')
  }

  ipfs () {
    return this.getTransaction('ipfs')
  }

  multiPayment () {
    return this.getTransaction('multi-payment')
  }

  multiSignature () {
    return this.getTransaction('multi-signature')
  }

  secondSignature () {
    return this.getTransaction('second-signature')
  }

  timelockTransfer () {
    return this.getTransaction('timelock-transfer')
  }

  transfer () {
    return this.getTransaction('transfer')
  }

  vote () {
    return this.getTransaction('vote')
  }

  getTransaction (transaction) {
    return require(`./transactions/${transaction}`)
  }
}
