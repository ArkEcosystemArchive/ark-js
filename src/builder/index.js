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
    return this.getTransaction('multiPayment')
  }

  multiSignature () {
    return this.getTransaction('multiSignature')
  }

  secondSignature () {
    return this.getTransaction('secondSignature')
  }

  timelockTransfer () {
    return this.getTransaction('timelockTransfer')
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
